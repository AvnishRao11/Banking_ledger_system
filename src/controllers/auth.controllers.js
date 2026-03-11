import userModel from '../models/user.model.js'
import jwt from 'jsonwebtoken'
/**
 * - userRegisterController 
 * - POST /api/auth/register

 */
export const registerUserController = async (req, res) => {
    const {email,name,password}=req.body;
    const isExist=await userModel.findOne({
        email:email
    })
    if(isExist){
        res.status(422).json({
            message:"User already exist with this email",
            status:"Failed"
        })
    }
    const user= await userModel.create({
        email:email,
        name:name,
        password:password
    })
    const token=jwt.sign({
        userId:user._id,
    },process.env.JWT_SECRET,{expiresIn:"1d"})

    res.cookie("token",token);

    res.status(201).json({
        user:{
            id:user._id,
            email:user.email,
            name:user.name
        },
        message:"user created successfully",

    })
}
/**
 * - loginUserController
 * - POST/api/auth/login
 */
export const loginUserController=async(req,res)=>{
    const {email,password}=req.body;
    const user=await userModel.findOne({email:email}).select("+password")
    if(!user){
        return res.json(401).json({
            message:"Email or Password is Invalid"
        })
    }
    const isValidPassword=await user.comparePassword(password);
    if(!isValidPassword){
        return res.json(401).json({
            message:"Email or Password is Invalid"
        })
    }
    const token=jwt.sign({
        userId:user._id,
    },process.env.JWT_SECRET,{expiresIn:"1d"})

    res.cookie("token",token);

    res.status(200).json({
        user:{
            id:user._id,
            email:user.email,
            name:user.name
        },
        message:"logged in successfully",

    })

}