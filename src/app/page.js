// app/page.js
//  introduction(?maybe pics,text or interactive tutorial?), links to join or create a whiteboard session, or perhaps show recent or available whiteboards.
'use client';

import Link from 'next/link';
import { useState } from 'react';
import { createNewWhiteboard } from '../app/services/whiteboardService';
import  WhiteboardList  from '@/components/WhiteboardList';
// import { useRouter } from 'next/navigation';

export default function HomePage() {
  // const router = useRouter();
  const [newBoardId, setNewBoardId] = useState('');

const handleCreateNewBoard = async () => {
  try {
    const data = await createNewWhiteboard(); // Directly await the obj
    setNewBoardId(data.id);
    console.log('New Whiteboard Created:', data.id);
  } catch (error) {
    console.error('Error creating whiteboard:', error);
  }
};

  // const handleNavigation = (e) => {
  //   e.preventDefault(); // Prevent the default link behavior
  //   // Add logic before navigating
  //   if (confirm('Are you sure you want to navigate?')) {
  //     router.push(`/whiteboard/${newBoardId}`);
  //   }
  // };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-4xl font-bold mb-4">Welcome to the Whiteboard App</h1>
      <p className="text-lg text-gray-700 mb-8">
        Create a new whiteboard session or join an existing one.
      </p>

      {/* Create a New Whiteboard */}
      <div className="mb-6">
        <button
          onClick={handleCreateNewBoard}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Create New Whiteboard
        </button>

        {/* Display the link to the new whiteboard once created */}
        {newBoardId && (
          <div className="mt-4">
            <Link href={`/whiteboard/${newBoardId}`} passHref>
              <button className="text-blue-500 underline">Go to your new whiteboard session: {newBoardId}</button>
            </Link>
          </div>
        )}
      </div>

      {/* Join an Existing Whiteboard */}
      <div>
        <input
          type="text"
          placeholder="Enter Whiteboard ID"
          className="px-3 py-2 border rounded mr-2"
          onChange={(e) => setNewBoardId(e.target.value)}
        />
        <Link href={`/whiteboard/[id]`} as={`/whiteboard/${newBoardId}`} passHref>
          <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition">
            Join Whiteboard
          </button>
        </Link>
      </div>

      {/* Recent Whiteboards */}
      <WhiteboardList />
    </div>
  );
}