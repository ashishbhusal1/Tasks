// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDXvwK7_gnUVlSyaLrQyKtFD6NmXDWPAng",
  authDomain: "project-fcaef.firebaseapp.com",
  projectId: "project-fcaef",
  storageBucket: "project-fcaef.appspot.com",
  messagingSenderId: "505062958563",
  appId: "1:505062958563:web:af4c31abe2b473b5956cd6",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
export { db, storage };
