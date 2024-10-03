// app/api/whiteboards/route.js
import { database } from '@/app/services/firebase';
import { ref, push, get, set } from 'firebase/database';
import { NextResponse } from 'next/server';

export async function GET() {
  const dbRef = ref(database, 'whiteboards');
  try {
    const snapshot = await get(dbRef);
    if (!snapshot.exists()) {
      console.log('No whiteboards available');
    }
    const whiteboards = snapshot.exists() ? snapshot.val() : [];
    return NextResponse.json(whiteboards);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch whiteboards' }, { status: 500 });
  }
}

export async function POST(request) {
  console.log(`POST(request): ${JSON.stringify(request)}`);
  const newWhiteboard = await request.json();
  const whiteboardsRef = ref(database, 'whiteboards');
  
  try {
    const newWhiteboardRef = push(whiteboardsRef); // Create a new child reference
    console.log('newWhiteboardRef:', newWhiteboardRef);

    await set(newWhiteboardRef, newWhiteboard); // Use set() to save data to the new location
    console.log(`Whiteboard successfully created with ID: ${newWhiteboardRef.key}`);
    return NextResponse.json({ id: newWhiteboardRef.key, ...newWhiteboard }, { status: 201 });
  } catch (error) {
    console.error("Error creating whiteboard in POST:", error);
    return NextResponse.json({ error: 'Failed to create whiteboard' }, { status: 500 });
  }
}

