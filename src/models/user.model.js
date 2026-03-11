import mongoose from "mongoose";
import bcrypt from 'bcryptjs'
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Email is Required for creating user"],
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, "Invalid Email Address"],
        unique: [true, "Email already exists"]
    },
    name: {
        type: String,
        required: [true, "Name is required for creating an account"]
    },
    password: {
        type: String,
        required: [true, "password is required for creating an account"],
        minlength: [6, "Password should  contain more than 6 characters "],
        select: false
    }

}, {
    timestamps: true
})

userSchema.pre("save",async function (){
    // updated passwords are hashed here 
    if(!this.isModified("password")){
        return 
    }
    const hash=await bcrypt.hash(this.password,10);
    this.password=hash
    return 
})

userSchema.methods.comparePassword =async function (password){
    return await bcrypt.compare(password,this.password)
}
const userModel=mongoose.model("user",userSchema);
export default userModel;
