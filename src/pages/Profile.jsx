import React from 'react'
import { useSelector,useDispatch } from 'react-redux'
import { useRef,useState,useEffect } from 'react';
import {getDownloadURL, getStorage,ref,uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase';
import { updateUserStart,updateUserSuccess,updateUserFailure, deleteUserStart, deleteUserFailure, deleteUserSuccess,signOutUserStart,signOutUserSuccess,signOutUserFailure } from '../app/features/user/userSlice';
import { Link, useNavigate } from 'react-router-dom';


const Profile = () => {
   
    const fileRef = useRef(null);
    const {currentUser,loading,error} = useSelector((state)=> {
        return state.user
    });
    const [file, setFile] = useState(undefined);
    const [filePercentage, setFilePercentage] = useState(0);
    const [fileUploadError, setFileUploadError] = useState(false);
    const [formData, setFormData] = useState({});
    const [updateSuccess, setUpdateSuccess] = useState(false);
    const [showListingError, setShowListingError] = useState(false);
    const [userListings, setUserListings] = useState([]);
    const dispatch = useDispatch();
 const navigate = useNavigate();
    useEffect(() => {
        if(file) {
            handleFileUpload(file);
        }
    }, [file]);

    

    const handleFileUpload = (file)=>{
        const storage = getStorage(app);
        const fileName = new Date().getTime() + file.name;
        const storageRef = ref(storage,fileName);
        const uploadTask = uploadBytesResumable(storageRef ,file);
    
    // Progress update

    uploadTask.on(
        "state_changed",
        (snapshot)=>{
            const progress = (snapshot.bytesTransferred/snapshot.totalBytes)*100;
            setFilePercentage(Math.round(progress));
        },
        (error)=>{
            setFileUploadError(true);
        },
        ()=>{
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL)=>{
                return setFormData({...formData,avatar:downloadURL})
            });
        }
    );
    };

    const handleChange = (e)=>{
      setFormData({...formData,
        [e.target.id]: e.target.value});
    }
    // console.log(formData);
  // Update User API ROUTE
    const handleSubmit =async (e) =>{
        e.preventDefault();
        try {
         dispatch(updateUserStart());
         const res = await fetch(`https://bharatrealestate.onrender.com/api/user/update/${currentUser._id}`,{
            method:'POST',
            headers:{
              'Content-Type':'application/json',
            },
            body: JSON.stringify(formData),
            credentials: "include",
          });
          
          const data = await res.json();
          // console.log(currentUser._id);
          // console.log(data);

          if (data.success === false) {
            dispatch(updateUserFailure(data.message));
            return;
          } 
         
          dispatch(updateUserSuccess(data));
          setUpdateSuccess(true);
        
     } catch (error) {
        dispatch(updateUserFailure(error.message));
     }
    };
   
    // Delete User API ROUTE
    const handleDelete = async ()=>{
       
      try {
        dispatch(deleteUserStart());
        const res = await fetch(`https://bharatrealestate.onrender.com/api/user/delete/${currentUser._id}`,{
          method : 'DELETE',
          credentials: "include",
        });

        const data = await res.json();
        // console.log(data);
        if (data.success === false) {
          deleteUserFailure(data.message);
          return;
        }
        deleteUserSuccess(data);
        //  navigate('/login');
        // Need to work in this issue where a user is not directly redirected to login page after deletion of account

      } catch (error) {
        deleteUserFailure(error.message);
      }
    }
  //  SignOut User API ROUTE
    const handleSignOut = async () => {

      try {
        dispatch(signOutUserStart())
        const res = await fetch('https://bharatrealestate.onrender.com/api/auth/signout');
        const data = await res.json();
        if (data.success === false) {
          dispatch(signOutUserFailure(data.message));
          return;
        }
        dispatch(signOutUserSuccess(data));
      } catch (error) {
        dispatch(signOutUserFailure(error.message));
      }
    }
    // Show User Listings API Route

    const handleShowUserListings = async()=>{
     try {
      setShowListingError(false);
      const res = await fetch(`https://bharatrealestate.onrender.com/api/user/listings/${currentUser._id}`,{
      credentials: "include"});
     
      
      const data = await res.json();
      if (data.success === false) {
        setShowListingError(true);
        return;
      }

      setUserListings(data);
     } catch (error) {
      setShowListingError(true);
     }
    }

    // Delete User Listing API Route

    const handleListingDelete = async (listingId)=>{
      try {
        
        const res = await fetch(`https://bharatrealestate.onrender.com/api/listing/delete/${listingId}`,{
          method : 'DELETE',
          credentials: "include",
        });
    
        const data = await res.json();
        if (data.success === false) {
          console.log(data.message);
          return;
        }
        setUserListings((prev)=>
       prev.filter((listing)=>listing._id !== listingId)    
        );
      } catch (error) {
        console.log(error.message)
      }
    };
   

  return (
    <>
    <div className='py-12  bg-gray-50 flex flex-col gap-6'>
      <div className='font-semibold text-3xl bg-gray-50 text-center  py-10'>Profile
      
      </div>
      <section className="bg-gray-50 dark:bg-gray-900 ">
        <div className="flex flex-col items-center justify-center px-6 mx-auto md:h-screen lg:py-0">
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
         
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl text-center font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Update your account
              </h1>
              <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
              <div className='flex items-center justify-center flex-col pt-3 max-sm:mx-3'>
        <input  ref={fileRef} onChange={(e)=>setFile(e.target.files[0])} type='file'accept='image/*'  />
          <img className='rounded-full object-cover my-4  cursor-pointer h-20 w-20 bg-gray-50'
        
        onClick={()=> fileRef.current.click()}
          src={formData.avatar || currentUser.avatar} 
        // src={setFile.avatar}
          alt="Profile Photo" />
          <p>{fileUploadError?(
            <span className='text-red-600'>Error Image Upload (image must be less than 2 mb)</span> ): filePercentage > 0 && filePercentage < 100 ? (<span className='text-slate-600'>{`Uploading ${filePercentage}%`}</span>) : filePercentage === 100? (
                <span className='text-green-600'> Image uploaded sucessfully</span>
            ) : (' ')}</p>
          </div>
                <div>
                  <label
                    htmlFor="username"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Your User Name
                  </label>
                  <input
                    type="text"
                    name="username"
                    id="username"
                    onChange={handleChange}
                    defaultValue={currentUser.username}
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="User Name"
                    
                    // minLength={5}
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Your email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    onChange={handleChange}
                    defaultValue={currentUser.email}
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="name@company.com"
                    
                  />
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    placeholder="••••••••"
                    onChange={handleChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    
                  />
                </div>
               
                <button
                  type="submit"
                  disabled={loading} 
                  // Need to work on that
                  className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                >
                  
                  {loading ? 'Loading...' : 'Update'} 
                   {/* Update */}
                </button>
                <Link to={'/create-listing'}>
                <button
                  className="w-full text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800 mt-2"
                > Create Listing 
                </button>
                </Link>
               <div className='flex justify-between mt-3'>
                <span className='text-red-600 cursor-pointer'onClick={handleDelete}>Delete Account </span>
                <span onClick={handleSignOut} className='text-red-600 cursor-pointer'>Sign Out</span>
               </div>
                
              </form>
              <p className='text-red-600 text-sm mt-2'>{error?error:" "}</p>
              <p className='text-green-700 text-sm mt-2'>
                {updateSuccess?'User Updated Successfully' : ' '}</p>
            <div className='max-w-lg'>
            <button onClick={handleShowUserListings}
                  className="w-full text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800 mt-2"
                > Show Listings 
                </button>
                <p className='text-red-700 mt-5'>{showListingError?'Error showing listing': ''}</p>

                {userListings && userListings.length > 0 && 
                <div className='flex flex-col'>
                  <h1 className='text-center font-semibold my-3 text-2xl'>Your Listings</h1>

                  {userListings.map((listing)=>(
                    <div
                    className='flex items-center justify-between border p-3 rounded-lg my-2'
                    key={listing._id}
                    >
                    <Link to={`/listing/${listing._id}`}> 
                    <img src={listing.imageUrls[0]}
                    alt='Listing cover'
                    className='h-16 w-16 object-contain'
                    />
                  
                  </Link>
                  <div className='max-sm:w-24 px-1 max-md:28 max-lg:w-36 w-36'>
                  <Link to={`/listing/${listing._id}`}>
                    <p className='hover:underline text-gray-800 font-semibold truncate '>{listing.name}</p>
                  </Link>
                  </div>
                  <div className=' flex flex-col'>
                   <Link to={`/update-listing/${listing._id}`}>
                  <button type='button'
                  className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 mt-2 uppercase"
                > Edit 
                </button>
                </Link>
                 <button type='button'
                 onClick={()=>handleListingDelete(listing._id)}
                  className="w-full text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800 mt-2
                  uppercase"
                > Delete
                </button>
                  </div>
                  </div>

                  ))}

                </div> }
              
            </div>
          </div>
          
          </div>
            </div>
          
      </section>
      </div>
    </>
  )
}

export default Profile
