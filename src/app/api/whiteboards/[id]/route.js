// src/app/api/whiteboards/[id]/route.js
import { database } from '@/app/services/firebase'; 
import { ref, remove, set, get } from 'firebase/database';

// load board by id
export async function GET(req, { params }) {
    const { id } = params; 
    console.log(`Loading whiteboard ID: ${id}`);

    try {
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

// delete board by id
export async function DELETE(req, { params }) {
    const { userId, id } = params; // Assuming userId is part of the URL params
    console.log(`Deleting whiteboard ID: ${id}`);

    try {
        const whiteboardRef = ref(database, `whiteboards/${id}`);
        await remove(whiteboardRef); // Remove the whiteboard

        // Remove the whiteboard ID from the user's listOfWhiteboardIds
        const userWhiteboardRef = ref(database, `users/${userId}/listOfWhiteboardIds/${id}`);
        await remove(userWhiteboardRef);

        return new Response(JSON.stringify({ success: true }), { status: 200 });
    } catch (error) {
        console.error('Error deleting whiteboard:', error);
        return new Response(JSON.stringify({ success: false, error: 'Failed to delete whiteboard' }), { status: 500 });
    }
}


/**
 * Save update board by id
 * @param {*} req { id, content, photo }
 * @param {*} param1 { userId }
 * @returns new Response
 */
export async function PUT(req, { params }) {
    const { userId } = params; // Assuming userId is passed in the request
    const { id, content, photo } = await req.json(); // Get content, photo, and id from the request body

    // Validate inputs
    if (!userId || !id || typeof content !== 'string' || typeof photo !== 'string') {
        return new Response(JSON.stringify({ success: false, error: 'Invalid input' }), { status: 400 });
    }

    try {
        const whiteboardRef = ref(database, `whiteboards/${id}`);
        // Save the whiteboard with its ID, content, and photo
        await set(whiteboardRef, { id, content, photo });

        // Update the user's listOfWhiteboardIds
        const userRef = ref(database, `users/${userId}/listOfWhiteboardIds/${id}`);
        await set(userRef, true); // Add the whiteboard ID to the user's list

        return new Response(JSON.stringify({ success: true, message: 'Whiteboard saved successfully.' }), { status: 200 });
    } catch (error) {
        console.error('Error saving whiteboard:', error);
        return new Response(JSON.stringify({ success: false, error: 'Failed to save whiteboard.' }), { status: 500 });
    }
}
