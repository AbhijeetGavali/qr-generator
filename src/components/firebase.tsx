// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBe5C9I3ekGRJ8WZ1HQhtsuVTMc_FkrNbI",
  authDomain: "qr-gen-ideasprout.firebaseapp.com",
  projectId: "qr-gen-ideasprout",
  storageBucket: "qr-gen-ideasprout.firebasestorage.app",
  messagingSenderId: "35433345092",
  appId: "1:35433345092:web:ea63bd26a855ae50180c11",
  measurementId: "G-SBRBS1K2JT",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
