import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
import ListingItem from '../components/ListingItem';

const Home = () => {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  SwiperCore.use([Navigation]);

  useEffect(() => {
    
    const fetchOfferListings = async () =>{
      try {
        const res = await fetch (`http://localhost:3000/api/listing/getAllListing?offer=true&limit=4`);

        const data = await res.json();
        setOfferListings(data);
        fetchRentListings();
      } catch (error) {
        console.log(error);
      }
    };

    const fetchRentListings = async ()=>{
      try {
        const res = await fetch (`http://localhost:3000/api/listing/getAllListing?type=rent&limit=4`);

        const data = await res.json();
        setRentListings(data);
        fetchSaleListings();
      } catch (error) {
        console.log(error);
      }
    };

    const fetchSaleListings = async ()=>{
      try {
        const res = await fetch (`http://localhost:3000/api/listing/getAllListing?type=sale&limit=4`);

        const data = await res.json();
        setSaleListings(data);

      } catch (error) {
        console.log(error);
      }
    };

    fetchOfferListings();
  
   
  }, []);

  return (
    <div className='bg-slate-100'>
      <div className='max-w-7xl p-7 mt-8 mx-auto'>
     {/* Top  section for heading*/}
     <h1 className='font-bold text-5xl max-md:text-3xl '>
     Discover Your Dream Home: <span className='text-slate-700'><br/> Elevate Your Living Experience</span>
     </h1>
     <p className='mt-4 text-slate-700'>Welcome to Bharat Real Estate, where your journey to finding the perfect home begins.<br /> As your dedicated real estate partner, we take pride in bringing you a curated selection <br /> of extraordinary properties.</p>
     <p className='mt-4 hover:text-blue-800 text-blue-700 hover:underline'><Link to='/search'>
      Let's get you started 
     </Link></p>
     </div>
     <div>
      {/* {/* Middle section for Swiper Image  */}
      <Swiper navigation>
        {offerListings && offerListings.length > 0 && offerListings.map((listing) => (
              <SwiperSlide key={listing._id}>
                <div
                  className="h-[600px]"
                  style={{
                    background: `url(${listing.imageUrls[0]}) center no-repeat`,
                    backgroundSize: `100% 100%`,
                     // This adjusts the height and width to 100% without cropping the image
                  }}
                >
                  
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
     </div>
     <div>
      {/* {/* Bottom  Section of Property Details Cards  */}
     {offerListings && offerListings.length > 0 && ( <div className='max-w-7xl mx-auto p-3 mt-10 flex flex-col gap-6'>
     <div>
      <h2 className='font-semibold text-2xl text-slate-800 '>Recent Offers </h2>
      <Link className='text-blue-700 hover:underline ' 
       to={'/search?offer=true'}> Show more offers
      </Link>
     </div>
      <div className='flex flex-wrap gap-10 '>
      {offerListings.map((listing)=>(
        <ListingItem listing={listing} key={listing._id}/>
      ))}  
      </div>
     </div> )}

     {rentListings && rentListings.length > 0 && ( <div className='max-w-7xl mx-auto p-3 mt-10 flex flex-col gap-6'>
     <div>
      <h2 className='font-semibold text-2xl text-slate-800 '>Recent places for Rent </h2>
      <Link className='text-blue-700 hover:underline ' 
       to={'/search?type=rent'}> Show more places for rent
      </Link>
     </div>
      <div className='flex flex-wrap gap-10 '>
      {rentListings.map((listing)=>(
        <ListingItem listing={listing} key={listing._id}/>
      ))}  
      </div>
     </div> )}

     {saleListings && saleListings.length > 0 && ( <div className='max-w-7xl mx-auto p-3 mt-10 flex flex-col gap-6'>
     <div>
      <h2 className='font-semibold text-2xl text-slate-800 '>Recent places for Sale </h2>
      <Link className='text-blue-700 hover:underline ' 
       to={'/search?type=sale'}> Show more places for sale
      </Link>
     </div>
      <div className='flex flex-wrap gap-10 '>
      {saleListings.map((listing)=>(
        <ListingItem listing={listing} key={listing._id}/>
      ))}  
      </div>
     </div> )}

     </div>
    </div>
  )
}

export default Home
