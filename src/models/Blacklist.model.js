import mongoose from "mongoose";

const tokenBlacklistSchema = new mongoose.Schema({
    token: {
        type: String,
        required: [true, "Token is required for blacklisting"],
        unique: [true, "Token already blacklisted"],
    },
},
    { timestamps: true }
)

tokenBlacklistSchema.index({ CreatedAt: 1 },{expiredAfterSeconds: 60 * 60 * 24 *3 })  // expire after 3 days ;


const tokenBlacklistModel=mongoose.model("tokenBlacklist",tokenBlacklistSchema);

export default tokenBlacklistModel;