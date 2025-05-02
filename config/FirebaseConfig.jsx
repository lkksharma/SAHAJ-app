import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAEAqZFlch5CJDoQkkW6teXaMnWU3Z2z4c",
  authDomain: "sahaj-91820.firebaseapp.com",
  projectId: "sahaj-91820",
  storageBucket: "sahaj-91820.appspot.com",
  messagingSenderId: "3887596486",
  appId: "1:3887596486:web:d77fe17be652d47f29e8c7",
  measurementId: "G-G45TBTC60J"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
