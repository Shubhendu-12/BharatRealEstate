// const express = require ('express');
import express from "express";
import mongoose from "mongoose";
import dotenv from 'dotenv'
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';
dotenv.config();
const app = express();
const port = 3000;
app.use(express.json());
const url = process.env.MONGOID;
mongoose
  .connect(url)
  .then(() => {
    console.log("Connected to MONGO ATLAS");
  })
  .catch((err) => {
    console.log(err);
  });

app.listen(port, () => {
  console.log(`App listening at port ${port}`);
});

app.use('/api/user',userRouter)

app.use('/api/auth',authRouter)

app.use((err,req,res,next)=>{
  const statusCode = err.statusCode|| 500;
  const message = err.message || 'Internal server error';
  return res.status(statusCode).json({
    sucess:false,
    statusCode,
    message,
  });
});