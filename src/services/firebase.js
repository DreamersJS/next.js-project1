import dotenv from 'dotenv';
dotenv.config();

// const firebaseConfig = {
//   apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
//   authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
//   projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
//   storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
//   databaseURL:NEXT_PUBLIC_FIREBASE_DATABASE_URL,
// };

// Initialize Firebase
let app, database, auth;

export async function initFirebase() {
  if (!app) {
    const { initializeApp } = await import('firebase/app');
    const { getDatabase } = await import('firebase/database');
    const { getAuth } = await import('firebase/auth');

    const firebaseConfig = {
      apiKey: "AIzaSyD4WKVJHyacrwtjJ8YtJzE1Z14ozGlnq84",
      authDomain: "whiteboard-4bb76.firebaseapp.com",
      projectId: "whiteboard-4bb76",
      storageBucket: "whiteboard-4bb76.appspot.com",
      messagingSenderId: "360749039257",
      appId: "1:360749039257:web:8ba47acd3df8d1d9cd8208",
      databaseURL: "https://whiteboard-4bb76-default-rtdb.europe-west1.firebasedatabase.app/"
    };
    app = initializeApp(firebaseConfig);
    database = getDatabase(app);
    auth = getAuth(app);
  }
  return { app, database, auth };
}