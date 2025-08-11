// import { database } from '@/services/firebase';
import { initFirebase } from './firebase';
import { ref, push, set, get } from 'firebase/database';
let database;

async function getDatabase() {
  if (!database) {
    const services = await initFirebase();
    database = services.database;
  }
  return database;
}

/**
 * Creates a new blank whiteboard in the Firebase database.
 * @returns {Promise<{ id: string, content: string }>} - An object containing the ID, content: photo url of the newly created whiteboard.
 */
export const createNewWhiteboard = async (userId) => {
  try {
    const database = await getDatabase();
    const newWhiteboardRef = push(ref(database, 'whiteboards'));
    const newWhiteboardId = newWhiteboardRef.key;

    // Set the initial whiteboard data
    await set(newWhiteboardRef, {
      id: newWhiteboardId,
      content: '',
      photo: '',
    });

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
      return await response.json(); // Return parsed data directly
    } else {
      console.error('Failed to load whiteboard:', response.statusText);
      return null; // Return null for error handling
    }
  } catch (error) {
    console.error('Error loading whiteboard:', error);
    return null; // Return null for error handling
  }
};

/**
 * Deletes a whiteboard by its ID from db and removes it from the user's list of whiteboards.
 * @param {string} whiteboardId - The ID of the whiteboard to delete.
 * @param {string} userId - The ID of the current user.
 */
export const deleteWhiteboard = async (whiteboardId, userId) => {
  try {

    const response = await fetch(`/api/whiteboards/${whiteboardId}?userId=${userId}`, {
      method: 'DELETE',
    });
    if (response.ok) {
      console.log('Deleted whiteboard:', whiteboardId);
    } else {
      console.error('Error deleting whiteboard:', response.statusText);
    }

  } catch (error) {
    console.error('Error deleting whiteboard:', error);
  }

};

/**
 * Function to get user's whiteboard IDs
 * @param {string} userId 
 * @returns array of whiteboard IDs
 */
export const getUserWhiteboards = async (userId) => {
  try {
    const database = await getDatabase();
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


/**
 * Save whiteboard content as an image.
 * @param {HTMLCanvasElement} canvas - The canvas element to capture.
 * @param {string} whiteboardId - The ID of the whiteboard.
 * @param {string} userId - The ID of the user.
 * @returns {Promise<void>}
 */
export const saveWhiteboardAsImage = async (canvas, whiteboardId, userId) => {
  if (!canvas || !whiteboardId || !userId) {
    console.error("Canvas, whiteboard ID or user ID is not defined.");
    return;
  }
  const dataURL = canvas.toDataURL('image/png');
  // Save the image URL to your database
  try {
    const response = await fetch(`/api/whiteboards/${whiteboardId}?userId=${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: whiteboardId, content: dataURL }),
    });

    if (response.ok) {
      alert('Whiteboard image saved successfully!');
    } else {
      alert('Failed to save the whiteboard image.');
    }
  } catch (error) {
    console.error('Error saving whiteboard image:', error);
  }
};
/**
 * Load a whiteboard image by its ID.
 * @param {string} whiteboardId - The ID of the whiteboard to load.
 * @returns {Promise<{ id: string, content: string, , photo: string }>} - An object containing the whiteboard ID and content: data:image/png;base64,(image URL) and , photo: "".
 */
export const loadWhiteboardImageById = async (whiteboardId) => {
  try {
    const response = await fetch(`/api/whiteboards/${whiteboardId}`, {
      method: 'GET',
    });

    const data = await response.json();
    if (!response.ok) {
      alert('No whiteboard data found.');
      throw new Error(`Error loading whiteboard: ${data.message}`);
    }
    return data;
  } catch (error) {
    console.error('Error loading whiteboard:', error);
  }
};