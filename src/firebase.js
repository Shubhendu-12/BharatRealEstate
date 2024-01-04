// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "bharat-realestate.firebaseapp.com",
  projectId: "bharat-realestate",
  storageBucket: "bharat-realestate.appspot.com",
  messagingSenderId: "23586065882",
  appId: "1:23586065882:web:cdf518a0724403656c44e3",
  measurementId: "G-6HHCFE6TFW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);