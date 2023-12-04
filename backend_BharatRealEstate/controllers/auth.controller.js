import User from "../models/user.model.js";
import bcryptjs from "bcryptjs"

export const signup = async(req,res,next) =>{
const {username,email,password} = req.body;
const hashedPassword = bcryptjs.hashSync(password,10);
try {
    const newUser = new User ({username,email,password:hashedPassword});
await newUser.save();
res.status(201).json('User created sucessfully');
} catch (error) {
    // res.status(500).json(error)
    next(error);
}


};