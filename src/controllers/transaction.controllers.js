import transcationModel from '../models/transcation.model.js'
import ledgerModel from '../models/ledger.model.js'
import { SendTransactionFailureEmail, sendTransactionEmail } from '../services/email.service.js'
import accountModel from '../models/account.model.js'
import mongoose from 'mongoose'
/***
 * * - Create new transaction 
 * The 10 Step Transfer flow 
 *  1. validate request 
 *  2. validate idempotency key 
 *  3. check account status 
 *  4. Derive sender balance from ledger 
 *  5. create transaction (Pending)
 *  6. create Debit ledger entry 
 *  7. create Credit ledger entry
 *  8. mark transaction as completed 
 *  9. commit  mongodb session 
 *  10. Send email notification 
 * 
 */
export const createTransactionController = async (req, res) => {
    /**
     * 1. validate request
     */
    const { fromAccount, toAccount, Amount, idempotencyKey } = req.body;

    if (!fromAccount || !toAccount || !Amount || !idempotencyKey) {
        return res.status(400).json({
            message: "All fields are required",
        })
    }
    const from_userAccount = await accountModel.findOne({
        _id: fromAccount,
    });
    const to_userAccount = await accountModel.findOne({
        _id: toAccount,
    });
    if (!from_userAccount || !to_userAccount) {
        return res.status(404).json({
            message: "Account not found",
        });
    }
    /**
     * 2. validate idempotency key
     */
    const isTransactionAlreadyExist = await transcationModel.findOne({
        idempotencyKey: idempotencyKey
    });
    if (isTransactionAlreadyExist) {
        if (isTransactionAlreadyExist.Status === "COMPLETED") {
            return res.status(200).json({
                message: "Transaction is already processed",
                transaction: isTransactionAlreadyExist,
            });
        }
        if (isTransactionAlreadyExist.Status === "PENDING") {
            return res.status(200).json({
                message: "Transaction is already in process",

            });
        }
        if (isTransactionAlreadyExist.Status === "FAILED") {
            return res.status(500).json({
                message: "Transaction is  failed , please retry",
                transaction: isTransactionAlreadyExist,
            });
        }
        if (isTransactionAlreadyExist.Status === "REVERSED") {

            return res.status(500).json({
                message: "Transaction is  reversed , please retry",
                transaction: isTransactionAlreadyExist,
            });
        }
    }
    /***
     * * 3. check account status
     */
    if (from_userAccount.Status !== "ACTIVE" || to_userAccount.Status !== "ACTIVE") {
        return res.status(400).json({
            message: "Both accounts must be active to process the transaction",
        })
    }
    /***
     *   4. Derive sender balance from ledger
     */
    const senderBalance = await from_userAccount.getBalance();
    if (senderBalance < Amount) {
        return res.status(400).json({
            message: `Insufficient balance . Current balance is ${senderBalance}. Requested Balance is ${Amount}.`,
        })
    }
    /**
     *  5. create transaction (Pending)
     */
    let transaction;
    try {
        const session = await mongoose.startSession();
        session.startTransaction();
        transaction = (await transcationModel.create([{
            fromAccount,
            toAccount,
            Amount,
            idempotencyKey,
            Status: "PENDING",
        }], { session }))[0]


        const debitLedgerEntry = await ledgerModel.create([{
            account: fromAccount,
            Amount,
            transcation: transaction._id,
            type: "DEBIT",
        }], { session })

        const creditLedgerEntry = await ledgerModel.create([{
            account: toAccount,
            Amount,
            transcation: transaction._id,
            type: "CREDIT",
        }], { session })


        await transcationModel.findOneAndUpdate(
            {
                _id: transaction._id,
            },
            {
                Status: "COMPLETED",
            },
            { session }
        )


        await session.commitTransaction();
        session.endSession();
    } catch (error) {
        return res.status(400).json({
            message: "Transaction failed to process",
            error: error.message,
        })
    }
    /**
     * 10. Send email notification
     */
    await sendTransactionEmail(req.user.email, Amount, transaction._id);
    return res.status(200).json({
        message: "Transaction processed successfully",
        transaction,
    })
}


export const createInitialFundsTransactionController = async (req, res) => {
    const { toAccount, Amount, idempotencyKey } = req.body;
    if (!toAccount || !Amount || !idempotencyKey) {
        return res.status(400).json({
            message: "All fields are required",
        })
    }
    const toUserAccount = await accountModel.findOne({
        _id: toAccount,
    });
    if (!toUserAccount) {
        return res.status(404).json({
            message: "Account not found",
        })
    }
    const fromuUserAccount = await accountModel.findOne({
        User: req.user._id,
    })
    if (!fromuUserAccount) {
        return res.status(404).json({
            message: "System user account not found"
        })
    }
    const session = await mongoose.startSession();
    session.startTransaction();
    const transaction = new transcationModel({
        fromAccount: fromuUserAccount._id,
        toAccount,
        Amount,
        idempotencyKey,
        status: "PENDING",
    })
    const debitLedgerEntry = await ledgerModel.create([{
        account: fromuUserAccount._id,
        Amount,
        transcation: transaction._id,
        type: "DEBIT",
    }], { session })
    const creditLedgerEntry = await ledgerModel.create([{
        account: toAccount,
        Amount,
        transcation: transaction._id,
        type: "CREDIT",
    }], { session })

    transaction.Status = "COMPLETED";
    await transaction.save({ session });
    await session.commitTransaction();
    session.endSession();
    return res.status(201).json({
        message: "Initial funds transaction created successfully",
        transaction,
    })



}