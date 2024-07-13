// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API,
  authDomain: "blog-a1672.firebaseapp.com",
  projectId: "blog-a1672",
  storageBucket: "blog-a1672.appspot.com",
  messagingSenderId: "593372184318",
  appId: "1:593372184318:web:d0939393dcf7339cb1efaf"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);