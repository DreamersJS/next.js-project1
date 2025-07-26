import { database } from '@/services/firebase';
import { ref, get } from 'firebase/database';
import { NextResponse } from 'next/server';

/**
 * const response = await fetch(`/api/whiteboards?userId=${user.uid}`, {
        method: 'GET',
  });
      if (response.ok) {
        const data = await response.json();
 * @param {*} request  This is the incoming HTTP request object. It contains details about the request, such as headers, query parameters, and the request body (if applicable). In this context, we specifically use it to access the query parameters (userId).
 * @returns returns an array of whiteboard objects containing the id, content, and photo 
 */
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  try {
    // Reference to the user's whiteboards
    const userWhiteboardsRef = ref(database, `users/${userId}/listOfWhiteboardIds`);
    const snapshot = await get(userWhiteboardsRef);
    
    const whiteboardIds = snapshot.val() || {};
    const whiteboards = [];

    // Iterate through whiteboard IDs to fetch each whiteboard's data
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
