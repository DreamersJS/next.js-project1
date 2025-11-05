import { initFirebase } from '@/services/firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInAnonymously,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { ref, set, get } from "firebase/database";
import Cookies from 'js-cookie';
import { deleteWhiteboard, getUserWhiteboards } from './whiteboardService';
import { deleteUser} from './userService';

let database, auth;

async function getFirebaseServices() {
  if (!database || !auth) {
    const services = await initFirebase();
    database = services.database;
    auth = services.auth;
  }
  return { database, auth };
}

export const createUserProfile = async (
  uid,
  username,
  email,
  avatar,
  role = "user",
  listOfWhiteboardIds,
) => {
  const { database } = await getFirebaseServices();
  return set(ref(database, `users/${uid}`), {
    uid,
    username,
    email,
    avatar,
    role,
    listOfWhiteboardIds,
  });
};

/**
 * @see https://firebase.google.com/docs/reference/js/auth.md#auth_package
 * @see https://firebase.google.com/docs/reference/js/auth.md#createuserwithemailandpassword_21ad33b
 * @async
 * @function registerUser
 * Creates a new user account associated with the specified email address and password.
 * @param {import('firebase/auth').Auth} auth - The Firebase Auth instance.
 * @param {string} email 
 * @param {string} password 
 * @returns {Promise<import('firebase/auth').UserCredential>}
 */
export const registerUser = async (email, password) => {
  try {
    const { auth } = await getFirebaseServices();
    return createUserWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
};


/**
 * Logs in an existing user using Firebase Authentication.
 *
 * @async
 * @function loginUser
 * @param {import('firebase/auth').Auth} auth - The Firebase Auth instance.
 * @param {string} email - The user's email address.
 * @param {string} password - The user's password.
 * @returns {Promise<import('firebase/auth').UserCredential>} 
 * A Promise that resolves with a Firebase UserCredential object if the sign-in is successful,
 * or rejects with a FirebaseError if authentication fails.
 * 
 * @throws {import('firebase/app').FirebaseError} Throws a FirebaseError if authentication fails.
 * @error auth/invalid-email - The email address is badly formatted.
 * @error auth/user-disabled - The user account has been disabled by an administrator.
 * @error auth/user-not-found - There is no user corresponding to the given email.
 * @error auth/wrong-password - The password is invalid for the given email.
 */

export const loginUser = async (email, password) => {
  try {
    const { auth } = await getFirebaseServices();
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Set the authenticated cookie with the correct attributes
    Cookies.set('auth', 'true', {
      expires: 1,        // 1 day
      path: '/',         // Available across all routes
      sameSite: 'Lax',   // Ensure it’s sent with requests
      secure: process.env.NODE_ENV === 'production', // Only set 'secure' in production
    });

    return user;
  } catch (error) {
    console.error("Login failed:", error.code, error.message);
    throw error;
  }
};

/**
 * Login as a guest
 * @returns userCredential.user
 */
export const loginAsGuest = async () => {
  try {
    const { auth } = await getFirebaseServices();
    const userCredential = await signInAnonymously(auth);

    // Set up guest user profile
    const username = `guest${Math.floor(Math.random() * 10000)}`;
    const avatarUrl = '/default.webp';

    await updateProfile(userCredential.user, { displayName: username });

    const userData = {
      uid: userCredential.user.uid,
      username: username,
      avatar: avatarUrl,
      role: 'guest',
      createdAt: Date.now(),
    };

    const userRef = ref(database, `users/${userCredential.user.uid}`);
    await set(userRef, userData);

    // Set the authenticated cookie
    Cookies.set('auth', 'true', {
      expires: 1,
      path: '/',
      sameSite: 'Lax',
      secure: process.env.NODE_ENV === 'production',
    });

    return userCredential.user;
  } catch (error) {
    console.error('Error logging in as guest:', error);
    throw error;
  }
};


// Logout the current user
export const logoutUser = async () => {
  try {
    const { auth } = await getFirebaseServices();

    // check if it's a guest
    if (auth.currentUser?.isAnonymous) {
      await logoutGuest(auth);
    }

    // Sign out current user
    await signOut(auth);
    Cookies.remove('auth'); // Remove the auth cookie
    Cookies.remove('userState'); // Remove the userState cookie as well
  } catch (error) {
    console.error('Error logging out:', error);
  }
};

const logoutGuest = async (auth) => {
  try {
    const uid = auth.currentUser.uid;

    // Get user's whiteboards
    const whiteboardIds = await getUserWhiteboards(uid);
    if (whiteboardIds?.length) {
      for (const id of whiteboardIds) {
        await deleteWhiteboard(id, uid);
      }
    }

    // Delete user profile in DB
    await deleteUser(uid);

    // Delete the anonymous user from Firebase Auth
    await auth.currentUser.delete();

    console.log(`Guest ${uid} deleted successfully.`);
  } catch (error) {
    console.error('Error logging out guest:', error);
  }
};

/**
 * 
 * @param {string} uid 
 * @returns  snapshot.val() of user data
 */
export const getUserByUid = async (uid) => {
  try {
    const { database } = await getFirebaseServices();
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

// Save user state in a cookie
export const saveUserToCookie = (user) => {
  Cookies.set('userState', JSON.stringify(user), {
    expires: 1, // Cookie expires in 1 day
    path: '/',
    sameSite: 'Lax',
    secure: process.env.NODE_ENV === 'production',
  });
};