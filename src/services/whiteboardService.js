/**
 * Creates a new blank whiteboard in the Firebase database.
 * @returns {Promise<{ id: string, content: string }>} - An object containing the ID, content: photo url of the newly created whiteboard.
 */
export const createNewWhiteboard = async (userId) => {
  try {
    const response = await fetch(`/api/whiteboards?userId=${userId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId }),
    });

    if (response.ok) {
      return await response.json();
    } else {
      console.error('Failed to load whiteboard:', response.statusText);
      return null; 
    }
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
      return await response.json(); 
    } else {
      console.error('Failed to load whiteboard:', response.statusText);
      return null; 
    }
  } catch (error) {
    console.error('Error loading whiteboard:', error);
    return null; 
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
    const response = await fetch(`/api/whiteboards?userId=${userId}`, { method: 'GET' });
    if (!response.ok) throw new Error('Failed to fetch user whiteboards');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching user whiteboards:', error);
    return [];
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
      return { message: 'Whiteboard image saved successfully!' };
    } else {
      alert('Failed to save the whiteboard image.');
      throw new Error(`Error saving whiteboard image: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error saving whiteboard image:', error);
  }
};
