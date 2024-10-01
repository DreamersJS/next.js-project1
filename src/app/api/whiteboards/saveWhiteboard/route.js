// src/app/api/whiteboards/saveWhiteboard/route.js
import { database } from '@/app/services/firebase'; 
import { ref, set } from 'firebase/database';

export async function POST(req) {
    const { id, content } = await req.json(); // Read the JSON body
    console.log(`Saving whiteboard ID: ${id}`, content);
    
    try {
        await set(ref(database, `whiteboards/${id}`), { content });
        return new Response(JSON.stringify({ success: true }), { status: 200 });
    } catch (error) {
        console.error('Error saving whiteboard:', error);
        return new Response(JSON.stringify({ error: 'Failed to save whiteboard' }), { status: 500 });
    }
}
