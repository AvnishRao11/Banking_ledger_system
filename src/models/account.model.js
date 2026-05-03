import mongoose from "mongoose";

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
const accountModel = mongoose.model("account", accountSchema);

export default accountModel;
