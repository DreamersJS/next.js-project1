export const dynamic = 'force-dynamic';

import { ref, get, push, set } from 'firebase/database';
import { NextResponse } from 'next/server';
import { initFirebase } from '@/services/firebase';

let database;

async function getFirebaseServices() {
  if (!database) {
    const services = await initFirebase();
    database = services.database;
  }
  return { database };
}

// get all boards for a user
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  try {
    const { database } = await getFirebaseServices();

    // Reference to the user's whiteboards
    const userWhiteboardsRef = ref(database, `users/${userId}/listOfWhiteboardIds`);
    const snapshot = await get(userWhiteboardsRef);

    const whiteboardObject = snapshot.val() || {};
    const whiteboardIds = Object.keys(whiteboardObject);

    return NextResponse.json(whiteboardIds);
  } catch (error) {
    console.error("Error fetching user's whiteboards:", error);
    return NextResponse.json({ error: 'Failed to fetch whiteboards' }, { status: 500 });
  }
}

// create a new whiteboard for a user
export async function POST(request) {
  // const { userId } = await request.json();
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  const { database } = await getFirebaseServices();

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  try {
    const newWhiteboardRef = push(ref(database, 'whiteboards'));
    const newWhiteboardId = newWhiteboardRef.key;
    // Set the initial whiteboard data
    await set(newWhiteboardRef, {
      id: newWhiteboardId,
      content: '',
      photo: '',
    });

    // Reference to the user's whiteboards
    const userWhiteboardsRef = ref(database, `users/${userId}/listOfWhiteboardIds`);
    const snapshot = await get(userWhiteboardsRef);
    const updatedUserWhiteboards = snapshot.val() || {};

    // Add the new whiteboard ID as a key-value pair (whiteboardId: true)
    updatedUserWhiteboards[newWhiteboardId] = true;

    // Update the user's whiteboard list in the database
    await set(userWhiteboardsRef, updatedUserWhiteboards);

    return NextResponse.json({ id: newWhiteboardId, content: '', photo: '' });
  } catch (error) {
    console.error("Error creating user's whiteboard:", error);
    return NextResponse.json({ error: 'Failed to create whiteboard' }, { status: 500 });
  }
}