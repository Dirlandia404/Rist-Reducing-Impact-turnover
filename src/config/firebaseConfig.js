import { getFirestore } from "firebase/firestore/lite";
import { initializeApp } from "firebase/app";

// Firebase configuration
const firebaseConfig = initializeApp({
  apiKey: " apiKey",
  authDomain: " authDomain",
  projectId: "projectId:",
  storageBucket: " storageBucket",
  messagingSenderId: " messagingSenderId",
  appId: "appId",
  measurementId: "measurementId",
});

export const db = getFirestore(firebaseConfig);
