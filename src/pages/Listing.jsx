import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
import { FaShare,FaBed,FaBath,FaParking,FaChair } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import Contact from "../components/Contact";

const Listing = () => {
  SwiperCore.use([Navigation]);
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [contact, setContact] = useState(false);
  const params = useParams();
  const {currentUser} = useSelector((state)=>{
    return state.user
  })

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const listingId = params.listingId;
        const res = await fetch(
          `https://bharatrealestate.onrender.com/api/listing/get/${listingId}`,
          
          {
            credentials: "include",
          }
        );
        const data = await res.json();
        // console.log(data.imageUrls);
        if (data.success === false) {
          console.log(data.message);
          setError(true);
          setLoading(false);
          return;
        }

        setListing(data);
        // console.log(data);
        setLoading(false);
        setError(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchListing();
  }, [params.listingId]);
  // console.log(loading);
 
 
  return (
    <main className="bg-slate-100 ">
      {/* Loading skeleton */}
      {loading && (
<div role="status" className=" mt-2 mx-2 space-y-8 animate-pulse md:space-y-0 md:space-x-8 rtl:space-x-reverse md:flex md:items-center">
    <div className="flex items-center justify-center w-full h-48 bg-gray-300 rounded sm:w-96 dark:bg-gray-700">
        <svg className="w-10 h-10 text-gray-200 dark:text-gray-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
            <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z"/>
        </svg>
    </div>
    <div className="w-full">
        <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4"></div>
        <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[480px] mb-2.5"></div>
        <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
        <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[440px] mb-2.5"></div>
        <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[460px] mb-2.5"></div>
        <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[360px]"></div>
    </div>
    <span className="sr-only">Loading...</span>
</div>
  )}
      {error && (
        <p className="text-center text-2xl my-6 ">Something went wrong !</p>
      )}

      {listing && !loading && !error && (
        <div>
          <Swiper navigation>
            {listing.imageUrls.map((url) => (
              <SwiperSlide key={url}>
                <div
                  className="h-[600px]"
                  style={{
                    background: `url(${url}) center no-repeat`,
                    backgroundSize: `100% 100%`,
                    // This adjusts the height and width to 100% without cropping the image
                  }}
                >
                  
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className=" fixed top-24 right-6 z-20 border rounded-full p-2 cursor-pointer w-12 h-12 flex items-center justify-center bg-slate-300 ">
            <FaShare
            className="text-slate-600"
            onClick={()=>{
              navigator.clipboard.writeText(window.location.href);
              setCopied(true);
              setTimeout(()=>setCopied(false),1500);
            }}
            />
          </div>
          {copied && (<p className="fixed top-36 right-5 z-20">Link copied</p>)}
        </div>
      )}
      <div className=" my-8 flex flex-col mx-auto max-w-4xl max-sm:mx-4  max-md:mx10 max-lg:mx-20 justify-center ">
        {listing?.name && <p className=" text-2xl font-semibold my-2">
         {listing.name} - ₹{' '}
          
          {listing.offer ? listing.discountedPrice.toLocaleString('en-IN') : listing.regularPrice.toLocaleString('en-IN')}
          {listing.type === 'rent' && '/month'}
        </p>}
        {listing?.address && <p className="mt-2 flex items-center gap-2 text-slate-800 text-sm">
        <FaLocationDot className="text-green-700"/>
        {listing.address}
        </p>}
        
        <div className="flex gap-2 mt-3">
        {listing?.type && <p >
        <button type="button" className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">{listing.type === 'rent' ? 'For Rent' : 'For Sale'}</button>
        </p> }
        {listing?.offer && <p>
        {listing.offer === true && (
          <button type="button" className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">₹{' '}{+listing.regularPrice - +listing.discountedPrice}.toLocaleString('en-IN')  discount</button>
        
        )} </p>}
        </div>
        <div className="mt-2 max-w-3xl my-1">
          {listing?.description && <p className="text-slate-800"> <span className="text-black font-semibold">Description - </span> {listing.description} </p>}
        </div>
        <ul className="flex flex-wrap mt-2 text-primary-800 gap-5 ">
        {listing?.bedrooms && <li className="flex items-center gap-1 ">
         <FaBed className="text-xl"/> 
          {listing.bedrooms} <span>Beds</span>
          </li>}

          {listing?.bathrooms && <li className="flex items-center gap-1 ">
         <FaBath className="text-xl"/> 
          {listing.bathrooms} <span>Baths</span>
          </li>}

          {listing?.parking && <li className="flex items-center gap-1 "> 
          <FaParking className="text-xl"/>
          {listing.parking ? 'Parking' : ' No Parking'}

            </li>}

           {listing?.furnished && <li className="flex items-center gap-1 "> 
          <FaChair  className="text-xl"/>
          {listing.furnished ? 'Furnished' : ' Not Furnished'}
          {/* listing?.furnished && : this method is called Optional Chaining */}
          {/* listing.furnished && : this method is called Conditioanl Rendering  */}
            </li>} 
        </ul>
        {currentUser && listing?.userRef && listing.userRef != currentUser._id && !contact &&(<button 
        onClick={()=> setContact(true)}
        className=" mt-5 max-w-3xl uppercase p-3 focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-800">Contact Landlord</button>

        )}
        {contact && <Contact listing ={listing}/>}
      </div>
    </main>
  );
};

export default Listing;
