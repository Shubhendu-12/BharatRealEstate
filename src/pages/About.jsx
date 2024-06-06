import React from 'react'
import { Link } from 'react-router-dom'

const About = () => {
  return (
    <div className='max-w-7xl mx-auto flex flex-col gap-4 mt-10 max-sm:mx-4'> 
    <h1 className='font-semibold text-4xl'>About Rentify
      {/* <span className='text-slate-700'>Real Estate</span> */}
      </h1> 
   <div className='max-w-5xl flex flex-col gap-5'>
    <p>At <span className='font-semibold'> BR Estate </span> , we understand that finding the perfect property is not just about location; it's about discovering a place that truly feels like home. With a commitment to excellence and a passion for helping you find your dream property, we take pride in being your trusted partner in the real estate journey.</p>

    <h2 className='text-3xl font-semibold'>
    Why Choose Us?
    </h2>

    <ol >
      <li className='my-2'> <span className='font-semibold '>1: Expertise:</span> Our team of seasoned real estate professionals brings a wealth of knowledge and experience to the table. From market trends to negotiation strategies, we are dedicated to guiding you through every step of the buying or selling process.
      </li>
      <li className='my-2'> <span className='font-semibold'>2. Personalized Service:</span>  We believe in the power of personalized service. Your goals and aspirations are unique, and we tailor our approach to ensure your real estate experience is seamless and stress-free.
      </li>
      <li className='my-2'>
      <span className='font-semibold'>3. Comprehensive Listings:</span> Explore a diverse range of properties through our extensive listings. Whether you're looking for a cozy starter home, a luxury estate, or an investment opportunity, we have something for everyone.
      </li>
    </ol>

    <Link to={'/contactUs'}  className='font-semibold hover:underline text-2xl text-blue-800' >
      Contact Us
    </Link>
    <p>
    Ready to take the next step? Contact us today to start your real estate adventure. <br/> We look forward to being your trusted partner in turning dreams into addresses.
    </p>
    </div>
    </div>
  )
}

export default About
