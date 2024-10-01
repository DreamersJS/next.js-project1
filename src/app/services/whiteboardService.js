import { database } from '@/app/services/firebase'; 
import { ref, push, set } from 'firebase/database';

/**
 * Creates a new blank whiteboard in the Firebase database.
 * @returns {Promise<{ id: string, content: string }>} - An object containing the ID, content: photo url of the newly created whiteboard.
 */
export const createNewWhiteboard = async () => {
  try {
    const newWhiteboardRef = push(ref(database, 'whiteboards')); 
    const newWhiteboardId = newWhiteboardRef.key; 

    await set(newWhiteboardRef, {
      id: newWhiteboardId,
      content: '', // Initial content can be empty
      photo: '', // Initial photo can be empty
    });

    console.log('New Whiteboard Created:', newWhiteboardId);
    return { id: newWhiteboardId, content: '', photo: '' }; 
  } catch (error) {
    console.error('Error in createNewWhiteboard:', error); 
    throw error; 
  }
};

/**
 * Loads the content of a whiteboard from the Firebase database.
 * @param {string} whiteboardId 
 * @returns {Promise<{ id: string, content: string}>} - An object containing the whiteboard ID, content: photo URL.
 */
const loadWhiteboardById = async (whiteboardId) => {
  try {
    const response = await fetch(`/api/whiteboards/${whiteboardId}`, {
      method: 'GET',
    });

    if (response.ok) {
      const data = await response.json();

return data;
    }
  } catch (error) {
    console.error('Error loading whiteboard:', error);
  }
};

/**
 * 
 * @param {string} whiteboardId 
 */
const deleteWhiteboard = async (whiteboardId) => {
  if (confirm('Are you sure you want to delete this whiteboard?')) {
    try {
      const response = await fetch(`/api/whiteboards/${whiteboardId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Deleted whiteboard:', data);
        // Handle the UI updates, e.g., remove the whiteboard from the list
      } else {
        alert('Failed to delete the whiteboard.');
      }
    } catch (error) {
      console.error('Error deleting whiteboard:', error);
    }
  }
};