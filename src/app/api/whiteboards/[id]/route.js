// src/app/api/whiteboards/[id]/route.js
import { database } from '@/lib/firebase'; 
import { ref, remove, set, get } from 'firebase/database';

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

export async function DELETE(req, { params }) {
    const { id } = params; 
    console.log(`Deleting whiteboard ID: ${id}`);

    try {
        const whiteboardRef = ref(database, `whiteboards/${id}`);
        await remove(whiteboardRef); 
        return new Response(JSON.stringify({ success: true }), { status: 200 });
    } catch (error) {
        console.error('Error deleting whiteboard:', error);
        return new Response(JSON.stringify({ success: false, error: 'Failed to delete whiteboard' }), { status: 500 });
    }
}

// New update function
export async function PUT(req, { params }) {
    const { id } = params; // Extract the dynamic parameter
    const { content } = await req.json(); // Get the new content from the request body
    console.log(`Updating whiteboard ID: ${id}`, content);

    try {
        const whiteboardRef = ref(database, `whiteboards/${id}`);
        await set(whiteboardRef, { content }); 
        return new Response(JSON.stringify({ success: true }), { status: 200 });
    } catch (error) {
        console.error('Error updating whiteboard:', error);
        return new Response(JSON.stringify({ success: false, error: 'Failed to update whiteboard' }), { status: 500 });
    }
}
