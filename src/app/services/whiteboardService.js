import { database } from '@/app/services/firebase';
import { ref, push, set, get, update } from 'firebase/database';

/**
 * Creates a new blank whiteboard in the Firebase database.
 * @returns {Promise<{ id: string, content: string }>} - An object containing the ID, content: photo url of the newly created whiteboard.
 */
export const createNewWhiteboard = async (userId) => {
  try {
    const newWhiteboardRef = push(ref(database, 'whiteboards'));
    const newWhiteboardId = newWhiteboardRef.key;

    // Set the initial whiteboard data
    await set(newWhiteboardRef, {
      id: newWhiteboardId,
      content: '',
      photo: '',
    });

    console.log('New Whiteboard Created:', newWhiteboardId);

    // Reference to the user's whiteboards
    const userWhiteboardsRef = ref(database, `users/${userId}/listOfWhiteboardIds`);
    const snapshot = await get(userWhiteboardsRef);
    const updatedUserWhiteboards = snapshot.val() || {};

    // Add the new whiteboard ID as a key-value pair (whiteboardId: true)
    updatedUserWhiteboards[newWhiteboardId] = true;

    // Update the user's whiteboard list in the database
    await set(userWhiteboardsRef, updatedUserWhiteboards);

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
export const loadWhiteboardById = async (whiteboardId) => {
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
 * Deletes a whiteboard by its ID from db and removes it from the user's list of whiteboards.
 * @param {string} whiteboardId - The ID of the whiteboard to delete.
 * @param {string} userId - The ID of the current user.
 */
export const deleteWhiteboard = async (whiteboardId, userId) => {
  if (confirm('Are you sure you want to delete this whiteboard?')) {
    try {
      // Delete the whiteboard from the database (this part is still using fetch)
      const response = await fetch(`/api/whiteboards/${whiteboardId}`, {
        method: 'DELETE',
      });

      // Reference to the user's whiteboards
      const userWhiteboardsRef = ref(database, `users/${userId}/listOfWhiteboardIds`);
      const snapshot = await get(userWhiteboardsRef);
      const userWhiteboards = snapshot.val() || {};

      // Remove the whiteboard ID from the user's list by deleting the key
      delete userWhiteboards[whiteboardId];

      // Update the user's whiteboard list in the database
      await set(userWhiteboardsRef, userWhiteboards);

      console.log('Deleted whiteboard:', whiteboardId);
    } catch (error) {
      console.error('Error deleting whiteboard:', error);
    }
  }
};

/**
 * Function to get user's whiteboard IDs
 * @param {string} userId 
 * @returns array of whiteboard IDs
 */
export const getUserWhiteboards = async (userId) => {
  try {
    const userWhiteboardsRef = ref(database, `users/${userId}/listOfWhiteboardIds`);
    
    // Fetch user's whiteboards (as key-value pairs)
    const snapshot = await get(userWhiteboardsRef);
    
    const whiteboardObject = snapshot.val() || {};

    const whiteboardIds = Object.keys(whiteboardObject);

    return whiteboardIds;
  } catch (error) {
    console.error('Error fetching user whiteboards:', error);
    throw error;
  }
};
