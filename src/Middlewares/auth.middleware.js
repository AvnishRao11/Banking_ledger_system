import userModel from "../models/user.model.js";
import jwt from 'jsonwebtoken';
import tokenBlacklistModel from "../models/Blacklist.model.js";
export const authMiddleware=async (req,res,next)=>{
    const token=req.cookies.token||req.headers?.authorization?.split(" ")[1];
    if(!token){
        return res.status(401).json({
            message:"Unauthorized acess, token is missing"
        })
    }
    const isBlacklisted=await tokenBlacklistModel.findOne({
        token:token,
    })
    if(isBlacklisted){
        return res.status(401).json({
            message:"Unauthorized acess, token is blacklisted"
        })
    }
    try{
        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        const user=await userModel.findById(decoded.userId);
        req.user=user;
        return next();
    }
    catch(err){
        return res.status(401).json({
            message:"Unauthorized acess, token is invalid.. "
        })

    }
}

export const authSystemUserMiddleware=async(req,res,next)=>{
    const token=req.cookies.token||req.headers?.authorization?.split(" ")[1];
    if(!token){
        return res.status(401).json({
            message:"Unauthorized acess, token is missing"
        })
    }
    const isBlacklisted=await tokenBlacklistModel.findOne({
        token:token,
    })
    if(isBlacklisted){
        return res.status(401).json({
            message:"Unauthorized acess, token is blacklisted"
        })
    }
    try{
        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        const user=await userModel.findById(decoded.userId).select("+systemUser");
        if(!user.systemUser){
            return res.status(403).json({
                message:"Forbidden access, user is not a system user"
            })
        }
        req.user=user;
        return next();

    }catch(err){
        return res.status(401).json({
            message:"Unauthorized acess, token is invalid ",
            error:err.message
        })
    }
     
}