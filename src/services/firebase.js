import dotenv from 'dotenv';
dotenv.config();

// Initialize Firebase
let app, database, auth;

export async function initFirebase() {
  if (!app) {
    const { initializeApp } = await import('firebase/app');
    const { getDatabase } = await import('firebase/database');
    const { getAuth } = await import('firebase/auth');

    const firebaseConfig = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
      databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
    };

    app = initializeApp(firebaseConfig);
    database = getDatabase(app);
    auth = getAuth(app);
  }

  return { app, database, auth };
}
