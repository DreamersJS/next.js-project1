// api/auth/login/route.js
import { NextResponse } from 'next/server';
import { database } from '@/lib/firebase'; 
import { get, ref } from 'firebase/database';

export async function POST(req) {
  const { email, password } = await req.json();
  const userRef = ref(database, `users/${email}`);

  try {
    const snapshot = await get(userRef);
    if (snapshot.exists() && snapshot.val().password === password) {
      return NextResponse.json({ message: 'Login successful' }, { status: 200 });
    } else {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Failed to log in' }, { status: 500 });
  }
}
