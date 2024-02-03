import React, { useState ,useEffect} from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

const UpdateListing = () => {
  const navigate = useNavigate();
  const params = useParams();
  const {currentUser} = useSelector((state)=>{
    return state.user
  });
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name:'',
    description: '',
    address:'',
    type:'rent',
    bedrooms:'1',
    bathrooms:'1',
    regularPrice:'50',
    discountedPrice:'0',
    offer:false,
    parking:false,
    furnished:false,

  });
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  // console.log(formData);

//   Fetch the listing from database/backend by useEffect hook

    useEffect(() => {
        const fetchListing = async()=>{
        const listingId = params.listingId;
        const res = await fetch (`https://bharatrealestate.onrender.com/api/listing/get/${listingId}`,{
            credentials: 'include',
        });
        const data = await res.json();
        if(data.success === false){
            console.log(data.message)
            return;
        }
        setFormData(data);
        };

        fetchListing();

    }, []);

  const handleImageSubmit = (e) => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploading(true);
      setImageUploadError(false);

      const promises = [];
      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setImageUploadError(false);
          setUploading(false);
        })
        .catch((err) => {
          setImageUploadError("Image upload failed(2 mb max per image)");
          setUploading(false);
        });
    } else {
      setImageUploadError("You can only upload 6 images per listing");
      setUploading(false);
    }
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload id ${progress}`);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => {
        return i !== index;
      }),
    });
  };
  // In .filter((_,i )), The first parameter is _ or underscore which means to ignore the first parameter.

   const handleChange = (e)=>{
    if(e.target.id === 'sale' || e.target.id === 'rent'){
      setFormData({
        ...formData,
        type:e.target.id,
      });
    }

    if (
      e.target.id === 'parking'||
      e.target.id === 'furnished'||
      e.target.id === 'offer'
    ) {
      setFormData({
        ...formData,
        [e.target.id] : e.target.checked,
      });
    }

    if (
      e.target.type === 'number' ||
      e.target.type === 'text' ||
      e.target.type === 'textarea'
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
   };
  // Increase and Decrease number of bedrooms and bathrooms 
   const handleIncrement1 = () => {
    setFormData({
      ...formData,
      bedrooms: Math.min(formData.bedrooms + 1, 10),
     
     
    });
  };

  const handleDecrement1 = () => {
    setFormData({
      ...formData,
      bedrooms: Math.max(formData.bedrooms - 1, 1),
      
    });
  };

  const handleIncrement2 = () => {
    setFormData({
      ...formData,
      bathrooms:Math.min(formData.bathrooms + 1, 5),
     
    });
  };

  const handleDecrement2 = () => {
    setFormData({
      ...formData,
     bathrooms:Math.max(formData.bathrooms - 1, 1),
    });
  };

  // Update listing API Route

   const handleSubmit = async (e) =>{
   e.preventDefault();
   try {
    if(formData.imageUrls.length < 1) {
    return setError('You must upload atlest 1 image');
    }
  if (+formData.regularPrice < +formData.discountedPrice) {
    return setError('Discounted price must be lower than regular price');
  }
  setLoading(true);
  setError(false);
  // API call starts from here 

  const res = await fetch(`https://bharatrealestate.onrender.com/api/listing/update/${params.listingId}`,{
    method: 'POST',
    credentials: "include",
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...formData,
      userRef: currentUser._id,
    }),
  });
  const data =await res.json();
  // console.log(data)
  setLoading(false);
  if (data.success === false) {
    setError(data.message);
  }
  navigate(`/listing/${data._id}`)

   } catch (error) {
    setError(error.message);
    setLoading(false);
   }
   };

   

  return (
    <>
      <main className="mx-auto max-w-5xl p-2">
        <h1 className="font-bold text-3xl text-center my-7">
          Update listing!
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row">
          <div className="flex flex-col gap-2 flex-1 mx-4">
            <label
              htmlFor="name"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              onChange={handleChange}
              value={formData.name}
              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Name"
              required
              minLength="5"
              maxLength="50"
            />

            <label
              htmlFor="description"
              className="block my-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Description
            </label>
            <textarea
              id="description"
              rows="4"
              onChange={handleChange}
              value={formData.description}
              className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Write your description here..."
              required
            ></textarea>

            <label
              htmlFor="address"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white mt-2"
            >
              Address
            </label>
            <input
              type="text"
              name="address"
              id="address"
              onChange={handleChange}
              value={formData.address}
              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Address"
              required
            />
            {/* Checkbox lists */}
            <div className="my-5">
              <ul className="items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                  <div className="flex items-center ps-3">
                    <input
                      id="sale"
                      type="checkbox"
                      onChange={handleChange}
                      checked={formData.type === 'sale'}
                      className="w-4 h-4 
                      text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                    />
                    <label
                      htmlFor="sale"
                      className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                    >
                      Sell
                    </label>
                  </div>
                </li>
                <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                  <div className="flex items-center ps-3">
                    <input
                      id="rent"
                      type="checkbox"
                      onChange={handleChange}
                    checked={formData.type === 'rent'}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                    />
                    <label
                      htmlFor="rent"
                      className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                    >
                      Rent
                    </label>
                  </div>
                </li>
                <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                  <div className="flex items-center ps-3">
                    <input
                      id="parking"
                      type="checkbox"
                      onChange={handleChange}
                      checked={formData.parking}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                    />
                    <label
                      htmlFor="parking"
                      className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                    >
                      Parking Spot
                    </label>
                  </div>
                </li>
                <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                  <div className="flex items-center ps-3">
                    <input
                      id="furnished"
                      type="checkbox"
                      onChange={handleChange}
                      checked={formData.furnished}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                    />
                    <label
                      htmlFor="furnished"
                      className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                    >
                      Furnished
                    </label>
                  </div>
                </li>
                <li className="w-full dark:border-gray-600">
                  <div className="flex items-center ps-3">
                    <input
                      id="offer"
                      type="checkbox"
                      onChange={handleChange}
                      checked={formData.offer}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                    />
                    <label
                      htmlFor="offer"
                      className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                    >
                      Offer
                    </label>
                  </div>
                </li>
              </ul>
            </div>
            <div className=" flex flex-col sm:flex-row ">
              {/* Input Boxes */}
              {/* Bedrooms */}
              <label
                htmlFor="bedrooms"
                className="flex items-center px-2  text-sm font-medium text-gray-900 dark:text-white"
              >
                Beds:
              </label>
              <div className="relative flex items-center max-w-[11rem]">
                <button
                  type="button"
                  id="bedrooms"
                  data-input-counter-decrement="bedrooms"
                  onClick={handleDecrement1}
                  className="bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 border border-gray-300 rounded-s-lg p-3 h-11 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none"
                >
                  <svg
                    className="w-3 h-3 text-gray-900 dark:text-white"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 18 2"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M1 1h16"
                    />
                  </svg>
                </button>
                <input
                  type="number"
                  id="bedrooms"
                  onChange={handleChange}
                  value={formData.bedrooms}
                  data-input-counter
                  data-input-counter-min="1"
                  data-input-counter-max="10"
                  aria-describedby="helper-text-explanation"
                  className="bg-gray-50 border-x-0 border-gray-300 h-11 font-medium text-center text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full pb-6 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  min={1}
                  max={10}
                  
                  required
                />
                <div className="absolute bottom-1 start-1/2 -translate-x-1/2 rtl:translate-x-1/2 flex items-center text-xs text-gray-400 space-x-1 rtl:space-x-reverse">
                  <svg
                    className="w-2.5 h-2.5 text-gray-400"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 20"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 8v10a1 1 0 0 0 1 1h4v-5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v5h4a1 1 0 0 0 1-1V8M1 10l9-9 9 9"
                    />
                  </svg>
                  <span>Bedrooms</span>
                </div>
                <button
                  type="button"
                  id="bedrooms"
                  onClick={handleIncrement1}
                  data-input-counter-increment="bedrooms"
                  className="bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 border border-gray-300 rounded-e-lg p-3 h-11 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none"
                >
                  <svg
                    className="w-3 h-3 text-gray-900 dark:text-white"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 18 18"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 1v16M1 9h16"
                    />
                  </svg>
                </button>
              </div>
              {/* <p
                id="helper-text-explanation"
                className="mt-2 px-2 text-sm text-gray-500 dark:text-gray-400"
              >
                Please select the number of bedrooms.
              </p> */}
              {/* Bathrooms */}

              <label
                htmlFor="bathrooms"
                className="flex items-center px-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Bathrooms:
              </label>
              <div className="relative flex items-center max-w-[11rem]">
                <button
                  type="button"
                  id="decrement-button"
                  data-input-counter-decrement="bathrooms"
                  onClick={handleDecrement2}
                  className="bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 border border-gray-300 rounded-s-lg p-3 h-11 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none"
                >
                  <svg
                    className="w-3 h-3 text-gray-900 dark:text-white"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 18 2"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M1 1h16"
                    />
                  </svg>
                </button>
                <input
                  type="number"
                  id="bathrooms"
                  onChange={handleChange}
                  value={formData.bathrooms}
                  data-input-counter
                  data-input-counter-min="1"
                  data-input-counter-max="5"
                  aria-describedby="helper-text-explanation"
                  className="bg-gray-50 border-x-0 border-gray-300 h-11 font-medium text-center text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full pb-6 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder=""
                  
                  required
                />
                <div className="absolute bottom-1 start-1/2 -translate-x-1/2 rtl:translate-x-1/2 flex items-center text-xs text-gray-400 space-x-1 rtl:space-x-reverse">
                  <svg
                    className="w-2.5 h-2.5 text-gray-400"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 20"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 8v10a1 1 0 0 0 1 1h4v-5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v5h4a1 1 0 0 0 1-1V8M1 10l9-9 9 9"
                    />
                  </svg>
                  <span>Bathrooms</span>
                </div>
                <button
                  type="button"
                  id="increment-button"
                  data-input-counter-increment="bathrooms"
                  onClick={handleIncrement2}
                  className="bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 border border-gray-300 rounded-e-lg p-3 h-11 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none"
                >
                  <svg
                    className="w-3 h-3 text-gray-900 dark:text-white"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 18 18"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 1v16M1 9h16"
                    />
                  </svg>
                </button>
              </div>
              {/* <p
                id="helper-text-explanation"
                className="mt-2 px-2 text-sm text-gray-500 dark:text-gray-400"
              >
                Please select the number of bathrooms.
              </p>
               */}
            </div>
            <div className="flex flex-col sm:flex-row  justify-between">
              {/* Regular price */}
              <div className="">
                <label
                  htmlFor="regularPrice"
                  className="block mb-2 px-2 mx-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Regular Price:
                </label>
                <input
                  type="number"
                  id="regularPrice"
                  onChange={handleChange}
                  value={formData.regularPrice}
                  min={50}
                  max={100000000}
                  aria-describedby="helper-text-explanation"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="$/Month"
                  required
                />
              </div>
              {formData.offer &&(
              <div className="">
                {/* Discounted price */}
                <label
                  htmlFor="discountedPrice"
                  className="block mb-2 px-2 mx-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Discounted Price:
                </label>
                <input
                  type="number"
                  id="discountedPrice"
                  onChange={handleChange}
                  value={formData.discountedPrice}
                  min={0}
                  max={100000000}
                  aria-describedby="helper-text-explanation"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="$/Month"
                  required
                />
              </div>
              )}
            </div>
          </div>
          <div className="flex flex-col flex-1 mx-4">
            {/*Image Upload Section  */}
            <label
              className="block my-3 sm:mb-2 text-sm font-medium text-gray-900 dark:text-white "
              htmlFor="images"
            >
              Upload multiple images : The 1st image will be cover (Max 6)
            </label>
            <input
              onChange={(e) => {
                setFiles(e.target.files);
              }}
              className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
              id="images"
              type="file"
              accept="image/*"
              multiple
            />

            <button
              type="button"
              onClick={handleImageSubmit}
              disabled={uploading}
              className="ml-2 my-4 focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
            >
              {uploading ? "Uploading" : "Upload"}
            </button>

            <p className="text-red-600 text-sm">
              {imageUploadError && imageUploadError}
            </p>
            {formData.imageUrls.length > 0 &&
              formData.imageUrls.map((url, index) => (
                <div key={url}
                className="flex justify-between items-center my-4">
                  <img src={url} alt="lisitng-image" className="h-20 w-20 object-contain" />

                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className=" text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 focus:outline-none dark:focus:ring-red-800 "
                  >
                    Delete
                  </button>
                </div>
              ))}

            <button 
            disabled={loading || uploading}
             className=" ml-2 my-4 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 uppercase">
              {/* Create Listing */}
              {loading ? 'Updating' : 'Update Listing'}
            </button>
            {error && <p className="text-red-600 text-sm"> {error}</p>}
          </div>
        </form>
      </main>
    </>
  );
};

export default UpdateListing;

