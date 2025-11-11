export const dynamic = 'force-dynamic';

import { initFirebase } from '@/services/firebase';
import { ref, remove} from 'firebase/database';

let database;

async function getFirebaseServices() {
  if (!database) {
    const services = await initFirebase();
    database = services.database;
  }
  return { database };
}

// delete a user
export async function DELETE(req) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');
  try {
    const { database } = await getFirebaseServices();

    if (!userId) {
      return Response.json({ error: 'Missing userId' }, { status: 400 });
    }
    const userRef = ref(database, `users/${userId}`);
    await remove(userRef);

    return Response.json({ message: 'User deleted' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return Response.json({ error: 'Failed to delete user' }, { status: 500 });
  }
}
