import { ref, get } from 'firebase/database';
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

/**
 * const response = await fetch(`/api/whiteboards?userId=${user.uid}`, {
 *   method: 'GET',
 * });
 * if (response.ok) {
 *   const data = await response.json();
 * }
 * 
 * @param {*} request - HTTP request object with query params
 * @returns array of whiteboards belonging to user
 */
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

    const whiteboardIds = snapshot.val() || {};
    const whiteboards = [];

    // Fetch each whiteboard data by id
    for (const whiteboardId in whiteboardIds) {
      const whiteboardRef = ref(database, `whiteboards/${whiteboardId}`);
      const whiteboardSnapshot = await get(whiteboardRef);
      if (whiteboardSnapshot.exists()) {
        whiteboards.push({ id: whiteboardId, ...whiteboardSnapshot.val() });
      }
    }

    return NextResponse.json(whiteboards);
  } catch (error) {
    console.error("Error fetching user's whiteboards:", error);
    return NextResponse.json({ error: 'Failed to fetch whiteboards' }, { status: 500 });
  }
}
