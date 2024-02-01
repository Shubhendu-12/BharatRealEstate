import express from "express";
import { deleteUser, getUserInfo, getUserListings, updateUser } from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";


const router = express.Router();

// router.get('/test',test);

router.post('/update/:id',verifyToken,updateUser);

router.delete('/delete/:id',verifyToken,deleteUser);

router.get('/listings/:id',verifyToken,getUserListings);

router.get('/getUserInfo/:id', getUserInfo);
// Don't use verifyToken here as this will not let the access to username and user email of the owner as the person accessing the listing will be diffrent from the owner.

export default router;