import { database } from '@/lib/firebase'; 
import { ref, push, set } from 'firebase/database';

/**
 * Creates a new whiteboard in the Firebase database.
 * @returns {Promise<{ id: string }>} - An object containing the ID of the newly created whiteboard.
 */
export const createNewWhiteboard = async () => {
  try {
    const newWhiteboardRef = push(ref(database, 'whiteboards')); 
    const newWhiteboardId = newWhiteboardRef.key; 

    await set(newWhiteboardRef, {
      id: newWhiteboardId,
      content: [], // Initial content can be an empty array or customized
      photo: '', // Optional: Add a photo URL for the whiteboard
    });

    console.log('New Whiteboard Created:', newWhiteboardId);
    return { id: newWhiteboardId, content: [], photo: '' }; 
  } catch (error) {
    console.error('Error in createNewWhiteboard:', error); 
    throw error; 
  }
};
