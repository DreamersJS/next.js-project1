// lib/auth.js
import { auth, database } from './firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInAnonymously,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { ref, set } from "firebase/database";

/**
 * Register a new user
 * @param {string} email 
 * @param {string} password 
 * @returns userCredential.user
 */
export const registerUser = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
};


/**
 * Login an existing user
 * @param {string} email 
 * @param {string} password 
 * @returns userCredential.user
 */
export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error('Error logging in user:', error);
    throw error;
  }
};

/**
 * Login as a guest
 * @returns userCredential.user
 */
export const loginAsGuest = async () => {
    const userCredential = await signInAnonymously(auth);

    // Set a username for the guest (e.g., guest123) and avatar
    const username = `guest${Math.floor(Math.random() * 10000)}`;
    const avatarUrl = `https://api.adorable.io/avatars/285/${username}.png`;

    await updateProfile(userCredential.user, { username });
      // Save guest user data to the database
      const userData = {
        username,
        avatar: avatarUrl,
        listOfWhiteboardIds: [],
      };
  
      const userRef = ref(database, `users/${user.uid}`);
      await set(userRef, userData);
  
    return userCredential.user;
  };

// Logout the current user
export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error logging out:', error);
  }
};
