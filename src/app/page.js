// app/page.js
// introduction(?maybe pics,text or interactive tutorial?), links to join or create a whiteboard session, or perhaps show recent or available whiteboards.
// WhiteboardList is for registered users, not for guests.
'use client';

import Link from 'next/link';
import { useState, Suspense, lazy } from 'react';
import { createNewWhiteboard } from '../app/services/whiteboardService';
// import  WhiteboardList  from '@/components/WhiteboardList';
const WhiteboardList = lazy(() => import('@/components/WhiteboardList'));

export default function HomePage() {
  const [newBoardId, setNewBoardId] = useState('');
  const [oldBoardId, setOldBoardId] = useState('');

  const handleCreateNewBoard = async () => {
    try {
      const data = await createNewWhiteboard(); // Directly await the obj
      setNewBoardId(data.id);
      console.log('New Whiteboard Created:', data.id);
    } catch (error) {
      console.error('Error creating whiteboard:', error);
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
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Create New Whiteboard
        </button>

        {/* Display the link to the new whiteboard once created */}
        {newBoardId && (
          <div className="mt-4" aria-live="polite" aria-atomic="true">
            <Link href={`/whiteboard/${newBoardId}`} passHref>
              <button className="text-blue-500 underline" aria-label={`Go to your new whiteboard session with ID ${newBoardId}`}>
                Go to your new whiteboard session: {newBoardId}
              </button>
            </Link>
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
        <Link href={`/whiteboard/[id]`} as={`/whiteboard/${oldBoardId}`} passHref>
          <button 
            disabled={!oldBoardId} 
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            aria-label="Join the whiteboard session"
          >
            Join Whiteboard
          </button>
        </Link>
      </div>

      {/* Recent Whiteboards */}
      <div className="mt-8" aria-label="Recent whiteboards section">
        <Suspense fallback={<p className="mt-8" aria-live="polite">Loading recent whiteboards...</p>}>
          <WhiteboardList />
        </Suspense>
      </div>
    </div>
  );
}
