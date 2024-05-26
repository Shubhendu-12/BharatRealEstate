

import Listing from '../models/listing.model.js'
import { errorHandler } from '../utils/error.js';

// User can create his own listings
export const createListing = async(req,res,next) => {
  try {
    const listing = await Listing.create(req.body);
    return res.status(201).json(listing);

  } catch (error) {
    next(error);
  }
};

// User can Delete his own listings
export const deleteListing = async (req,res,next)=>{
  const listing = await Listing.findById(req.params.id);

  if(!listing){
    return next(errorHandler(404,'Lisitng not found'));
  }
  if (req.user.id !== listing.userRef) {
    return next(errorHandler(401,'You can only update your own listings !'));
  }

  try {
    await Listing.findByIdAndDelete(req.params.id);
    res.status(200).json('Listing has been deleted !');
  } catch (error) {
    next(error);
  }
};

// User can Update his own listings
export const updateListing = async(req,res,next)=>{
  const listing = await Listing.findById(req.params.id);

  if (!listing) {
    return next(errorHandler(404,'Listing not found !'));
  }
  if (req.user.id !== listing.userRef) {
    return next(errorHandler(401,'You can only update your own listings!'));
  }

  try {
     const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      {new:true}
      );
      res.status(200).json(updatedListing);
  } catch (error) {
    next(error);
  }
};

// Show User his own listings inside Profile Page 
export const getListing = async(req,res,next) =>{
  
  try {
    const listing = await Listing.findById(req.params.id);
  
    if (!listing) {
      return next(errorHandler(404,'Listing not found !'))
    };
     res.status(200).json(listing);
    
  } catch (error) {
    next(error);
  }
}

// Get ALL Listings of every User at (one place like Search page and Home Page).
export const getAllListings = async(req,res,next)=>{
  
  try {
    const limit = parseInt(req.query.limit) || 8;
    // To set the limit of how many items to show per page max item at once is 8.
    const startIndex = parseInt(req.query.startIndex) || 0;

    let offer = req.query.offer;
    if (offer === undefined || offer === 'false') {
      offer = {$in: [false,true]};
    }
    
    let furnished = req.query.furnished;
    if (furnished === undefined || furnished === 'false') {
      furnished = {$in: [false,true]};
    }

    let parking = req.query.parking;
    if (parking === undefined || parking === 'false') {
      parking = {$in: [false,true]};
    }

    let type = req.query.type;
    if (type === undefined || type === 'all') {
      type = {$in:['sale','rent']};
    }

    const searchTerm = req.query.searchTerm || '';

    const sort = req.query.sort || 'createdAt';

    const order = req.query.order || 'desc';

    const listings = await Listing.find({
      name: { $regex: searchTerm, $options:'i'},
      offer,
      furnished,
      parking,
      type,
    })
    .sort({[sort]: order})
    .limit(limit)
    .skip(startIndex);

    return res.status(200).json(listings);

  } catch (error) {
   next(error);    
  }
};

// Admin Listing Deletion without User Verification

export const deletelistingAdmin = async (req,res,next)=>{
  const listing = await Listing.findById(req.params.id);

  if(!listing){
    return next(errorHandler(404,'Lisitng not found'));
  }
  

  try {
    await Listing.findByIdAndDelete(req.params.id);
    res.status(200).json('Listing has been deleted !');
  } catch (error) {
    next(error);
  }
};