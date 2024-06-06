import React from 'react'
import { useSelector } from 'react-redux'
import { Link,NavLink,useNavigate } from 'react-router-dom'
import { useState,useEffect } from 'react'
import BREstate from '../assets/b_r_estate_logo.png'



// const style1= {backgroundColor:"red"}
const Navbar = () => {

  const {currentUser} = useSelector((state)=>{
    return state.user
  })

  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSubmit =(e)=> {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('searchTerm',searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`)

  }

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
   if(searchTermFromUrl) {
    setSearchTerm(searchTermFromUrl)
   }
    
  }, [location.search]);

  return (
   
   <>
     

<nav className="bg-slate-200 border-gray-200 dark:bg-gray-900">
  <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
  <NavLink
           
           to={'/'}
             className="flex items-center mb-4 sm:mb-0 space-x-1 rtl:space-x-reverse bg-slate-200"
           >
             <img
               src={BREstate}
               className="h-16 w-32 "
               alt="B R Estate"
             />
             <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white text-slate-700">
             BR Estate
             </span>
           </NavLink>

  <div className="flex md:order-2">
  <Link to='/profile'>
            {currentUser ? (
              <img className='rounded-full h-7 w-7 object-cover' src={currentUser.avatar} alt='profile' />
            ) : (
              <li className=' text-slate-700 font-semibold hover:underline list-none'> Login</li>
            )}
           </Link> 
    
  </div>
    <div className="items-center justify-between  w-full md:flex md:w-auto md:order-1" id="navbar-search">
      <form onSubmit={handleSubmit} className="relative mt-1 mx-4 max-md:mt-4 ">
        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
          <button>
          <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
          </svg>
          </button>
        </div>
        <input
        value={searchTerm}
        onChange={(e)=>setSearchTerm(e.target.value)}
        type="text" id="search-navbar" className="block w-full p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search..."/>
      </form>
      <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-slate-200 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-slate-200 dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
        {/* <li>
          <a href="#" className="block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500" aria-current="page">Home</a>
        </li> */}
        <li>
          <Link to='/' className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">Home</Link>
        </li>
        <li>
          <Link to='/about' className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">About</Link>
        </li>
        <li>
          <Link to='/contactUs' className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">Contact Us</Link>
        </li>
      </ul>
    </div>
  </div>
</nav>


 
  </>
  )
}

export default Navbar