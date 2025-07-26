import { initializeApp } from "firebase/app";
import { getDatabase } from 'firebase/database';
import { getAuth } from 'firebase/auth';

import dotenv from 'dotenv';
dotenv.config(); 

const firebaseConfig = {
  apiKey: "AIzaSyD4WKVJHyacrwtjJ8YtJzE1Z14ozGlnq84",
  authDomain: "whiteboard-4bb76.firebaseapp.com",
  projectId: "whiteboard-4bb76",
  storageBucket: "whiteboard-4bb76.appspot.com",
  messagingSenderId: "360749039257",
  appId: "1:360749039257:web:8ba47acd3df8d1d9cd8208",
  databaseURL:"https://whiteboard-4bb76-default-rtdb.europe-west1.firebasedatabase.app/"
};

// const firebaseConfig = {
//   apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
//   authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
//   projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
//   storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
//   databaseURL:NEXT_PUBLIC_FIREBASE_DATABASE_URL,
// };

// This is confirmed to be a known issue introduced in Firebase SDK v10.13.x (especially firebase/auth) due to internal changes to emulator detection.
// Safe guard to prevent emulator initialization
try {
  if (auth && typeof auth._canInitEmulator === 'function') {
    // Do nothing, all good
  } else {
    auth._canInitEmulator = () => false; // Prevent emulator call
  }
} catch (err) {
  console.warn('Safe guard for emulator failed:', err);
}
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);

export { database, auth };