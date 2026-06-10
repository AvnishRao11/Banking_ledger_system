import mongoose from "mongoose";
import ledgerModel from "./ledger.model.js";
const accountSchema = mongoose.Schema({
    User: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: [true, "Account must be associated with user"],
        index: true

    },
    Status: {
        type:String,
        enum: {
            values: ["ACTIVE", "FROZEN", "CLOSED"],
            message: "Status can either be ACTIVE , FROZEN or CLOSED",
        },
        default:"ACTIVE"
    },
    Currency: {
        type:String,
        required: [true, "Currency is required for creating an Account"],
        default: "INR"
    }

}, {
    timestamps: true
})
accountSchema.index({ User: 1 },{ Status: 1} );
accountSchema.methods.getBalance=async function(){
    // aggregate all the ledger entries for this account and calculate the balance     ---> aggregation pipeline
    const BalanceData=await ledgerModel.aggregate([
        {$match:{account :this._id}},
        {
            $group:{
                _id:null,
                totalDebit:{
                    $sum:{
                        $cond:[{$eq:["$type","DEBIT"]},"$Amount",0]
                    }
                },
                totalCredit:{
                    $sum:{
                        $cond:[{$eq:["$type","CREDIT"]},"$Amount",0]
                    }
                }
            }
        },
        {
            $project:{
                _id:0,
                balance:{$subtract:["$totalCredit","$totalDebit"]}
            }
        }
        
    ])
    if(BalanceData.length==0){
        return 0;
    }
    return BalanceData[0].balance;
}

const accountModel = mongoose.model("account", accountSchema);

export default accountModel;
