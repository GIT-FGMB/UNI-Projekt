import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD-YRTXetoPBWjWoZfo22JDe_HBuu_l63A",
  authDomain: "app-sportsfreunde.firebaseapp.com",
  projectId: "app-sportsfreunde",
  storageBucket: "app-sportsfreunde.firebasestorage.app",
  messagingSenderId: "965845585032",
  appId: "1:965845585032:web:906ce5c5dcbcc27c07633d",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
