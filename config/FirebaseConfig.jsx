// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAu8NT_qskMRA0bzzANAPAvh0uU_F3D6U4",
  authDomain: "sahaj-9abf3.firebaseapp.com",
  projectId: "sahaj-9abf3",
  storageBucket: "sahaj-9abf3.firebasestorage.app",
  messagingSenderId: "411937034103",
  appId: "1:411937034103:web:6597b00383030720fa5b72",
  measurementId: "G-KR8GNNZ1NT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth=getAuth(app)
const db = getFirestore(app);
const storage = getStorage(app);
// Export Firestore & Auth
export { auth, db };
