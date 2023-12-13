import { getFirestore } from "firebase/firestore/lite";
import { initializeApp } from "firebase/app";

// Firebase configuration
const firebaseConfig = initializeApp({
  apiKey: "AIzaSyBM2UKRsIbPd_P8uw4Y6_MdfzTQxUPT2xU",
  authDomain: "rist3-43b09.firebaseapp.com",
  projectId: "rist3-43b09",
  storageBucket: "rist3-43b09.appspot.com",
  messagingSenderId: "560528178346",
  appId: "1:560528178346:web:c1b12d6b01730ccd8ba4d3",
  measurementId: "G-4R72VD8CJL",
});

export const db = getFirestore(firebaseConfig);
