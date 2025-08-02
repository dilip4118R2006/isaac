// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDF0tfEfGoPgaL243cGOBFAxphpqYXLtl8",
  authDomain: "isaacasimov-761c1.firebaseapp.com",
  projectId: "isaacasimov-761c1",
  storageBucket: "isaacasimov-761c1.firebasestorage.app",
  messagingSenderId: "989863714429",
  appId: "1:989863714429:web:ff8e02059292978ec69b14"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;