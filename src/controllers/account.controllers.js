import accountModel from '../models/account.model.js'

/**
 *  
 */

export const createAccountController=async(req,res)=>{
    const user=req.user;
    const account =await accountModel.create({
        User:user._id,
    })
    res.status(201).json({
        account
    })
}

export const getUserAccountController=async(req,res)=>{
    const accounts=await accountModel.find({
        User:req.user._id
    })
    return res.status(200).json({
        accounts

    })
}
export const getAccountBalanceController=async(req,res)=>{
    const {accountId}=req.params;
    const account=await accountModel.findOne({
        _id:accountId,
        User:req.user._id
    })
    if(!account){
        return res.status(404).json({
            message:"Account not found.."
        })
    }
    const balance=await account.getBalance();
    return res.status(200).json({
        account:account._id,
        balance
    })
}   