import { database } from '@/app/services/firebase';
import { ref, push, set, get,update } from 'firebase/database';

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

    // Add the new whiteboard ID to the user's listOfWhiteboardIds
    const userWhiteboardsRef = ref(database, `users/${userId}/listOfWhiteboardIds`);
    const snapshot = await get(userWhiteboardsRef);
    const updatedUserWhiteboards = snapshot.val() || [];

    // Add the new whiteboard ID to the list
    updatedUserWhiteboards.push(newWhiteboardId);

    // Update the user's whiteboard list in the database
    await set(userWhiteboardsRef, updatedUserWhiteboards);

    // Update the Recoil state for the user
    // setUser((prevUser) => ({
    //   ...prevUser,
    //   listOfWhiteboardIds: [...prevUser.listOfWhiteboardIds, newWhiteboardId],
    // }));

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
      // Delete the whiteboard from the database
      // const whiteboardRef = ref(database, `whiteboards/${whiteboardId}`);
      // await remove(whiteboardRef);
      const response = await fetch(`/api/whiteboards/${whiteboardId}`, {
        method: 'DELETE',
      });


      // Get the user's current list of whiteboards
      const userWhiteboardsRef = ref(database, `users/${userId}/listOfWhiteboardIds`);
      const snapshot = await get(userWhiteboardsRef);
      const userWhiteboards = snapshot.val() || [];

      // Remove the whiteboard ID from the user's list
      const updatedWhiteboardList = userWhiteboards.filter((id) => id !== whiteboardId);

      // Update the user's whiteboard list in the database
      await set(userWhiteboardsRef, updatedWhiteboardList);

      // Update the Recoil state for the user
      // setUser((prevUser) => ({
      //   ...prevUser,
      //   listOfWhiteboardIds: updatedWhiteboardList,
      // }));

      console.log('Deleted whiteboard:', whiteboardId);
    } catch (error) {
      console.error('Error deleting whiteboard:', error);
    }
  }
};