import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBk3h5kIXfqn1ZUH6WMAtlboIh6zi-Qldk",
  authDomain: "autism-det.firebaseapp.com",
  projectId: "autism-det",
  storageBucket: "autism-det.firebasestorage.app",
  messagingSenderId: "181738957874",
  appId: "1:181738957874:web:e3942a71af1978d54f602b",
  measurementId: "G-S6MTQLMZQ7"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { db, auth, provider };
