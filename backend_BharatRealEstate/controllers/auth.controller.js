import User from "../models/user.model.js";
import bcryptjs from "bcryptjs"
import { errorHandler } from "../utils/error.js";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export const signup = async(req,res,next) =>{
const {username,email,password} = req.body;
const hashedPassword = bcryptjs.hashSync(password,10);
const newUser = new User ({username,email,password:hashedPassword});
try {
await newUser.save();
res.status(201).json('User created sucessfully');
} catch (error) {
    // res.status(500).json(error)
    next(error);
}
};

export const login = async(req,res,next)=>{
    const {email,password}= req.body;
    try {
        const validUser = await User.findOne({email});
        if(!validUser) return next(errorHandler(404,'User not found'));
        const validPassword = bcryptjs.compareSync(password,validUser.password);
        if(!validPassword) return next(errorHandler(401,'Wrong Credentials!'));
        //   If everything is valid the program goes below this line without any error

    const token = jwt.sign({id: validUser._id},process.env.JWT_SECRET);
    const {password:pass, ...rest} = validUser._doc;
    res.cookie('access_token',token,{httpOnly:true})
    .status(200).json(rest);


    } catch (error) {
        next(error);
    }
}