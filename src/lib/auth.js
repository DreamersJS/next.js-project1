// lib/auth.js
import { auth, database } from './firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInAnonymously,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { ref, set, get } from "firebase/database";

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
    const user = userCredential.user;
    return user;
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
  try {
    const userCredential = await signInAnonymously(auth);

    // Set a username for the guest (e.g., guest123) and avatar
    const username = `guest${Math.floor(Math.random() * 10000)}`;
    const avatarUrl = `https://ui-avatars.com/api/?name=${username}&background=random&size=128`;

    // Update the guest user's profile with a username
    await updateProfile(userCredential.user, { displayName: username });

    // Save guest user data to the database
    const userData = {
      uid: userCredential.user.uid,
      username: username, // Use the generated username
      avatar: avatarUrl,
      listOfWhiteboardIds: [],
    };

    const userRef = ref(database, `users/${userCredential.user.uid}`);
    await set(userRef, userData);

    return userCredential.user; 
  } catch (error) {
    console.error('Error logging in as guest:', error);
    throw error; 
  }
};


// Logout the current user
export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error logging out:', error);
  }
};

/**
 * 
 * @param {string} uid 
 * @returns  snapshot.val()
 */
export const getUserByUid = async (uid) => {
  try {
    const userRef = ref(database, `users/${uid}`);
    const snapshot = await get(userRef);

    if (snapshot.exists()) {
      const userData = snapshot.val();
      return userData;
    } else {
      throw new Error('User not found');
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
};