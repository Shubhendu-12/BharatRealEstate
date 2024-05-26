import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import { createListing, deleteListing, deletelistingAdmin, getAllListings, getListing, updateListing } from "../controllers/listing.controller.js";


const router = express.Router();

router.post('/create',verifyToken,createListing);
// User can create his own Listing

router.delete('/delete/:id',verifyToken,deleteListing);
// User can delete his own Listing
router.delete('/delete/adminListingDelete/:id',deletelistingAdmin);
// Admin Listing Deletion without User Verification

router.post('/update/:id',verifyToken,updateListing);
// User can update his own Listing

router.get('/get/:id',getListing);
// Show User his own listings

router.get('/getAllListing',getAllListings);
// Get ALL Listings of every User at (one place like Search page and Home Page).

export default router;