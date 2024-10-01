// api/auth/register/route.js
import { NextResponse } from 'next/server';
import { database, auth } from '@/app/services/firebase';
import { ref, set } from 'firebase/database';
import { registerUser } from '@/app/services/auth';
import {
  createUserWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';

export async function POST(req) {
  const { username, email, password } = await req.json();

  try {
    console.log('Registering user:', username, email, password);
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    // console.log('User registered, userCredential:', userCredential);
    const user = userCredential.user; // email, uid
    console.log(`user.uid: ${user.uid}`);
    console.log(`user.email: ${user.email}`);

    // Update the user's displayName instead of username
    await updateProfile(user, { displayName: username });
    console.log(`user.username: ${user.username}`);

    const avatarUrl = `https://api.adorable.io/avatars/285/${username}.png`;
    const userData = {
      uid: user.uid,
      email: user.email,
      username: user.displayName,
      avatar: avatarUrl,
      listOfWhiteboardIds: [],
      role: 'user',
    };

    const userRef = ref(database, `users/${user.uid}`); // add IndexOn rule in firebase console
    await set(userRef, userData);
    console.log('User data saved to database:', userData);

    // return user;
    return NextResponse.json({ user: userData, message: 'User registered successfully' }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to register user' }, { status: 500 });
  }
}