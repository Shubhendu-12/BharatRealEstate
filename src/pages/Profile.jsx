import React from 'react'
import { useSelector,useDispatch } from 'react-redux'
import { useRef,useState,useEffect } from 'react';
import {getDownloadURL, getStorage,ref,uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase';
import { updateUserStart,updateUserSuccess,updateUserFailure } from '../app/features/user/userSlice';

const Profile = () => {
   
    const fileRef = useRef(null);
    const {currentUser,loading,error} = useSelector((state)=> {
        return state.user
    })
    const [file, setFile] = useState(undefined);
    const [filePercentage, setFilePercentage] = useState(0);
    const [fileUploadError, setFileUploadError] = useState(false);
    const [formData, setFormData] = useState({});
    const [updateSuccess, setUpdateSuccess] = useState();
    const dispatch = useDispatch();

    useEffect(() => {
        if(file) {
            handleFileUpload(file);
        }
    }, [file]);

    // const handleClick = () => {
    //     if (fileRef.current) {
    //       fileRef.current.click();
    //     }
    //   };
    // Need to work on this onClick on Image

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
    console.log(formData);

    const handleSubmit =async (e) =>{
        e.preventDefault();
        try {
         dispatch(updateUserStart());
         const res = await fetch(`http://localhost:3000/api/user/update/${currentUser._id}`,{
            method:'PUT',
            headers:{
              'Content-Type':'application/json',
              'Authorization':`Bearer ${currentUser._id}`,
            },
            body: JSON.stringify(formData),
          });
          
          const data = await res.json();
          console.log(data);

          if (data.success===false) {
            dispatch(updateUserFailure(data.message));
            return;
          } 
         
          dispatch(updateUserSuccess(data));
          setUpdateSuccess(true);
        
     } catch (error) {
        dispatch(updateUserFailure(error.message));
     }
    };

  return (
    <>
      <div className='font-semibold text-3xl bg-gray-50 text-center pt-4'>Profile
      
      </div>
      <section className="bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center justify-center px-6 mx-auto md:h-screen lg:py-0">
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
         
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Update your account
              </h1>
              <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
              <div className='flex items-center justify-center flex-col pt-3'>
        <input  onChange={(e)=>setFile(e.target.files[0])} type='file'accept='image/*'  />
          <img className='rounded-full object-cover my-4  cursor-pointer h-20 w-20 bg-gray-50'
        //   onClick={()=>{
        //     if (fileRef.current) {
        //       return  fileRef.current.click();
        //     }
        //     }}
        // onClick={handleClick}
        onClick={()=> fileRef.current.click()}
          src={formData.avatar||currentUser.avatar} 
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
               <div className='flex justify-between mt-2'>
                <span className='text-red-600 cursor-pointer'>Delete Account </span>
                <span className='text-red-600 cursor-pointer'>Sign Out</span>
               </div>
                
              </form>
              <p className='text-red-600 text-sm mt-2'>{error?error:" "}</p>
              <p className='text-green-700 text-sm mt-2'>
                {updateSuccess?'User Updated Successfully' : ' '}</p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Profile
