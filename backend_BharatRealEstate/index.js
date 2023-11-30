// const express = require ('express');
import express from "express";
import mongoose from "mongoose";
import dotenv from 'dotenv'
import userRouter from './routes/user.route.js';
dotenv.config();
const app = express();
const port = 3000;
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