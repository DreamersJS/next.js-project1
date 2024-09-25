// app/api/whiteboards/loadWhiteboard.js
import { database } from '@/lib/firebase';
import { ref, get } from 'firebase/database';

export default async (req, res) => {
  if (req.method === 'GET') {
    const { id } = req.query;

    try {
      const snapshot = await get(ref(database, `whiteboards/${id}`));
      if (snapshot.exists()) {
        res.status(200).json({ content: snapshot.val().content });
      } else {
        res.status(404).json({ error: 'Whiteboard not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Failed to load whiteboard' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};
