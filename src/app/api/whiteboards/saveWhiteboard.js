// app/api/whiteboards/saveWhiteboard.js
import { database } from '@/lib/firebase'; // Your Firebase setup
import { ref, set } from 'firebase/database';

export default async (req, res) => {
    if (req.method === 'POST') {
        const { id, content } = req.body;
        console.log(`Saving whiteboard ID: ${id}`, content);
        try {
            await set(ref(database, `whiteboards/${id}`), { content });
            res.status(200).json({ success: true });
        } catch (error) {
            console.error('Error saving whiteboard:', error);
            res.status(500).json({ error: 'Failed to save whiteboard' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
};
