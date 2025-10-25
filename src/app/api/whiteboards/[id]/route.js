export const dynamic = 'force-dynamic';

import { initFirebase } from '@/services/firebase';
import { ref, remove, set, get, update } from 'firebase/database';

let database;

async function getFirebaseServices() {
    if (!database) {
        const services = await initFirebase();
        database = services.database;
    }
    return { database };
}

// Load board by id
export async function GET(req, { params }) {
    const { id } = params;

    try {
        const { database } = await getFirebaseServices();
        const whiteboardRef = ref(database, `whiteboards/${id}`);
        const snapshot = await get(whiteboardRef);

        if (snapshot.exists()) {
            return new Response(JSON.stringify(snapshot.val()), { status: 200 });
        } else {
            return new Response(JSON.stringify({ error: 'Whiteboard not found' }), { status: 404 });
        }
    } catch (error) {
        console.error('Error loading whiteboard:', error);
        return new Response(JSON.stringify({ error: 'Failed to load whiteboard' }), { status: 500 });
    }
}

// Delete board by id
export async function DELETE(req, { params }) {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const { id } = params;

    if (!userId || !id) {
        return new Response(JSON.stringify({ success: false, error: 'Missing userId or whiteboardId' }), { status: 400 });
    }

    try {
        const { database } = await getFirebaseServices();

        // 1. Delete the whiteboard
        const whiteboardRef = ref(database, `whiteboards/${id}`);
        await remove(whiteboardRef);

        // 2. Load user's whiteboard list
        const userWhiteboardsRef = ref(database, `users/${userId}/listOfWhiteboardIds`);
        const snapshotBefore = await get(userWhiteboardsRef);
        const userWhiteboards = snapshotBefore.val() || {};

        // 3. Remove whiteboard id
        if (userWhiteboards[id]) {
            delete userWhiteboards[id];
        } else {
            console.log(`Whiteboard ID ${id} not found in user's list.`);
        }

        // 4. Update user's whiteboard list
        await set(userWhiteboardsRef, userWhiteboards);

        return new Response(JSON.stringify({ success: true }), { status: 200 });
    } catch (error) {
        console.error('Error deleting whiteboard or updating user reference:', error);
        return new Response(JSON.stringify({ success: false, error: 'Failed to delete whiteboard or update user' }), { status: 500 });
    }
}

// Save update board by id
export async function PUT(req, { params }) {
    const { id } = params;
    const { content } = await req.json();

    if (!id || !content) {
        return new Response(JSON.stringify({ success: false, error: 'Invalid input' }), { status: 400 });
    }

    try {
        const { database } = await getFirebaseServices();
        const whiteboardRef = ref(database, `whiteboards/${id}`);

        // Check if whiteboard exists
        const snapshot = await get(whiteboardRef);
        const whiteboardVal = snapshot.val();

        if (whiteboardVal) {
            // Update only content field
            await update(whiteboardRef, { content });

            return new Response(JSON.stringify({ success: true, message: 'Whiteboard updated successfully.' }), { status: 200 });
        } else {
            return new Response(JSON.stringify({ success: false, error: 'Whiteboard not found.' }), { status: 404 });
        }
    } catch (error) {
        console.error('Error updating whiteboard:', error);
        return new Response(JSON.stringify({ success: false, error: 'Failed to update whiteboard.' }), { status: 500 });
    }
}
