import express from 'express';
import { google, login, signOut, signup } from '../controllers/auth.controller.js';



const router = express.Router();

router.post('/signup',signup);

router.post('/login',login);

router.post('/google',google)

router.get('/signout',signOut)

export default router;