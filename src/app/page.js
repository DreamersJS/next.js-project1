'use client';
import { useState, Suspense, lazy, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/hooks/useUser';

const WhiteboardList = lazy(() => import('@/components/WhiteboardList'));

export default function HomePage() {
  const [newBoardId, setNewBoardId] = useState('');
  const [oldBoardId, setOldBoardId] = useState('');
  const router = useRouter();
  const { user, setUser, loading } = useUser();
  const [showList, setShowList] = useState(false);

  useEffect(() => {
    if (user?.role === 'registered') {
      // Delay a bit to avoid blocking LCP
      const timer = setTimeout(() => setShowList(true), 1000);
      return () => clearTimeout(timer);
    }
  }, [user]);

  const navigateToLogin = useCallback(() => {
    router.push('/login');
  }, [router]);

  useEffect(() => {
    if (!loading && !user?.uid) {
      navigateToLogin()
    }
  }, [loading, user, navigateToLogin]);

  const handleCreateNewBoard = async () => {
    try {
      if (!user?.uid) {
        return;
      }
      const { createNewWhiteboard } = await import('../services/whiteboardService');
      const data = await createNewWhiteboard(user.uid);
      setNewBoardId(data.id);

      setUser((prevUser) => ({
        ...prevUser,
        listOfWhiteboardIds: [...(prevUser.listOfWhiteboardIds || []), data.id],
      }));
      navigateToBoard(data.id);
    } catch (error) {
      console.error('Error creating whiteboard:', error);
    }
  };

  const navigateToBoard = useCallback((id) => {
    router.push(`/whiteboard/${id}`);
  }, [router]);

  const handleJoinBoard = () => {
    if (oldBoardId) {
      navigateToBoard(oldBoardId);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100" aria-label="Homepage">
      <h1 className="text-4xl font-bold mb-4" aria-label="Welcome to the Whiteboard App">
        Welcome to the Whiteboard App
      </h1>

      <p className="text-lg text-gray-700 mb-8" aria-label="Introduction to whiteboard sessions">
        Create a new whiteboard session or join an existing one.
      </p>

      {/* Create a New Whiteboard */}
      <div className="mb-6" aria-labelledby="create-whiteboard-section">
        <button
          aria-label="Create a new whiteboard session"
          onClick={handleCreateNewBoard}
          className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-700 transition"
          disabled={!user?.uid}
        >
          Create a New Whiteboard
        </button>

        {/* Display the link to the new whiteboard once created */}
        {newBoardId && (
          <div className="mt-4" aria-live="polite" aria-atomic="true">
            <button
              onClick={() => navigateToBoard(newBoardId)}
              className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 text-blue-600 underline"
              aria-label={`Go to your new whiteboard session with ID ${newBoardId}`}
            >
              Go to your new whiteboard session: {newBoardId}
            </button>
          </div>
        )}
      </div>

      {/* Join an Existing Whiteboard */}
      <div aria-labelledby="join-whiteboard-section">
        <label htmlFor="whiteboard-id-input" className="sr-only">
          Enter the ID of the whiteboard you wish to join
        </label>
        <input
          id="whiteboard-id-input"
          type="text"
          placeholder="Enter Whiteboard ID"
          aria-label="Enter Whiteboard ID"
          className="px-3 py-2 border rounded mr-2"
          value={oldBoardId}
          onChange={(e) => setOldBoardId(e.target.value)}
        />
        <button
          onClick={handleJoinBoard}
          disabled={!oldBoardId}
          className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-700 transition"
          aria-label="Join the whiteboard session"
        >
          Join Whiteboard
        </button>
      </div>

      {/* Show Recent Whiteboards only for Registered Users */}
      {user?.role === 'registered' && (
        <div className={`mt-8 transition-opacity duration-300`}
          style={{
            opacity: showList ? 1 : 0,
            pointerEvents: showList ? 'auto' : 'none',
          }} aria-label="Recent whiteboards section">
          <Suspense fallback={<p className="mt-8" aria-live="polite">Loading recent whiteboards...</p>}>
            {showList ? <WhiteboardList /> : null}
          </Suspense>
        </div>
      )}
    </div>
  );
}
