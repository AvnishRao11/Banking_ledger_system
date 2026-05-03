import mongoose, { trusted } from "mongoose";

const transactionSchema=new mongoose.Schema({
    fromAccount:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"account",
        required:[true,"Transcation must be associated with the account"],
        index:true,   
    },
    toAccount:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"account",
        required:[true,"Transcation must be associated with the account"],
        index:true,   
    },
    Status:{
        type:String,
        enum:{
            values:["PENDING","COMPLETED","FAILED","REVERSED"],
            message:"Status can either be PENDING ,COMPLETED,FAILED,REVERSED",
        },
        default:"PENDING"
    },
    Amount:{
        type:Number,
        required:[true,"Amount is required for creating a Transcation"],
        min:[0,"Transcation amount can't be negative"]
    },
    idempotencyKey:{
        type:String,
        required:[true,"Idempotency Key is required for creating a Transcation"],
        index:true,
        unique:true,
    }
},{
    timestamps:true
}
)
const transcationModel=mongoose.model("transaction",transactionSchema);
export default transcationModel;