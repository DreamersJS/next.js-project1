// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from 'firebase/database';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// https://whiteboard-4bb76-default-rtdb.europe-west1.firebasedatabase.app/
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD4WKVJHyacrwtjJ8YtJzE1Z14ozGlnq84",
  authDomain: "whiteboard-4bb76.firebaseapp.com",
  projectId: "whiteboard-4bb76",
  storageBucket: "whiteboard-4bb76.appspot.com",
  messagingSenderId: "360749039257",
  appId: "1:360749039257:web:8ba47acd3df8d1d9cd8208",
  databaseURL:"https://whiteboard-4bb76-default-rtdb.europe-west1.firebasedatabase.app/"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database };