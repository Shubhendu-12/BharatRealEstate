import React from 'react'
import { Link } from 'react-router-dom'
import { FaLocationDot } from "react-icons/fa6";


const ListingItem = ({listing}) => {
  return (
    <>
   
  
<div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 w-96 overflow-hidden ">

    <Link to={`/listing/${listing._id}`}>


      {listing?.imageUrls &&  <img className="rounded-t-lg hover:scale-105 transition duration-300 object-cover h-80 " src={listing.imageUrls[0]} alt="Listing Cover" />}
   
    <div className="p-5"> 
       
        {listing?.name &&    <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white truncate">{listing.name}</h5> }
        
       {listing?.address && <p className="mb-3 font-normal text-gray-700 dark:text-gray-400 flex items-center gap-1">
        <FaLocationDot className="text-green-700 truncate"/>
          {listing.address}</p>}

          {listing?.description && <p className="mb-3 font-normal text-gray-700 dark:text-gray-400 line-clamp-2">{listing.description}</p>}
        
          <div className='mb-3 font-semibold text-gray-700 dark:text-gray-400'>
          ₹ {' '}
            {listing.offer ? listing.discountedPrice.toLocaleString('en-IN')
            : listing.regularPrice.toLocaleString('en-IN') 
            }
            {listing.type === 'rent' && '/month'}
          </div>
          <div className=' flex gap-2 font-normal text-gray-800'>
            <div>
              {listing.bedrooms >1 ?  `${listing.bedrooms} beds ` : `${listing.bedrooms} bed, `}
            </div>

            <div>
              {listing.bathrooms >1 ?
              `${listing.bathrooms} baths` : `${listing.bathrooms} bath` }
            </div>
          </div>
    </div>
    </Link>
</div>

    </>
  )
}

export default ListingItem
