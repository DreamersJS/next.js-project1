// api/auth/register/route.js
import { NextResponse } from 'next/server';
import { database } from '@/lib/firebase'; 
import { ref, set } from 'firebase/database';

export async function POST(req) {
  const { username, password } = await req.json();
  const userRef = ref(database, `users/${username}`); // add IndexOn rule in firebase console

  try {
    await set(userRef, { username, password });
    return NextResponse.json({ message: 'User registered successfully' }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to register user' }, { status: 500 });
  }
}