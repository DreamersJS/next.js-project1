export const deleteUser = async (userId) => {
    try {
      const response = await fetch(`/api/user?userId=${userId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        console.log('Deleted user:', userId);
      } else {
        console.error('Error deleting user:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };