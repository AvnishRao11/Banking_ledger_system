import mongoose from 'mongoose'
const ledgerSchema=new mongoose.Schema({
    account:{
        type:mongoose.Schema.Types.ObjectId ,
        ref:"account",
        required:[true,"Ledger must be associated with an account"],
        index:true,
        immutable:true,
    },
    Amount:{
        type:Number,
        required:[true,"Amount is required to create a ledger entry"],
        immutable:true, 
    },
    transcation:{
        type:mongoose.Schema.Types.ObjectId,
        required:[true,"Ledger must be associated with a transaction"],
        index:true,
        immutable:true,
    },
    type:{
        type:String,
        enum:{
            values:["CREDIT","DEBIT"],
            message:"Type can be either Debit or Credit"
        },
        requied:true,
        immutable:true,
    }
})

const preventLedgerModifications=()=>{
    throw new Error("Ledger model can't be modified or deleted");

}
ledgerSchema.pre('findOneAndUpdate',preventLedgerModifications);
ledgerSchema.pre('UpdateOne',preventLedgerModifications);
ledgerSchema.pre('delete',preventLedgerModifications);
ledgerSchema.pre('remove',preventLedgerModifications);
ledgerSchema.pre('deleteMany',preventLedgerModifications);
ledgerSchema.pre('updateMany',preventLedgerModifications);
ledgerSchema.pre('findOneAndDelete',preventLedgerModifications);
ledgerSchema.pre('findOneAndReplace',preventLedgerModifications);



const ledgerModel=mongoose.model("ledger",ledgerSchema);

export default ledgerModel;