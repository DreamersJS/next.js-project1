'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { userState } from '@/recoil/atoms/userAtom';
import { deleteWhiteboard } from '@/app/services/whiteboardService';

export default function WhiteboardList() {
  const user = useRecoilValue(userState); 
  const [whiteboards, setWhiteboards] = useState([]);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    if (!user || !user.listOfWhiteboardIds) return; 

    const fetchUserWhiteboards = async () => {
      try {
        const response = await fetch('/api/whiteboards', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data && typeof data === 'object') {
            // Convert the object to an array
            const whiteboardsArray = Object.keys(data).map((key) => ({
              id: key,
              ...data[key],
            }));

            // Filter whiteboards that match the user's listOfWhiteboardIds
            const filteredWhiteboards = whiteboardsArray.filter((whiteboard) =>
              user.listOfWhiteboardIds.includes(whiteboard.id)
            );

            setWhiteboards(filteredWhiteboards);
          } else {
            console.error('Unexpected data format:', data);
            setWhiteboards([]);
          }
        } else {
          console.error('Failed to fetch whiteboards:', response.statusText);
          setWhiteboards([]);
        }
      } catch (error) {
        console.error('Error fetching whiteboards:', error);
        setWhiteboards([]);
      } finally {
        setLoading(false); 
      }
    };

    fetchUserWhiteboards();
  }, [user]); // Re-run this effect when the user data changes

  if (loading) {
    return <div className="mt-8">Loading...</div>;
  }

  if (!Array.isArray(whiteboards) || whiteboards.length === 0) {
    return <div className="mt-8">No whiteboards available</div>;
  }

  // Function to handle the deletion of a whiteboard
  const handleDeleteWhiteboard = async (event, whiteboardId) => {
    event.stopPropagation(); // Prevents the event from bubbling up to parent elements

    try {
      await deleteWhiteboard(user.uid, whiteboardId);

      // Remove the whiteboard from the local state
      setWhiteboards((prevWhiteboards) =>
        prevWhiteboards.filter((whiteboard) => whiteboard.id !== whiteboardId)
      );
    } catch (error) {
      console.error('Error deleting whiteboard:', error);
    }
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Your Whiteboards</h2>
      <ul>
        {whiteboards.map((whiteboard) => (
          <li
            className="bg-white p-4 rounded shadow-md hover:bg-gray-100 transition-colors flex justify-between items-center"
            key={whiteboard.id}
          >
            {/* Whiteboard Link */}
            <Link
              href={`/whiteboard/[id]`}
              as={`/whiteboard/${whiteboard.id}`}
              passHref
              className="text-blue-500 hover:underline flex-grow"
              aria-label={`Go to whiteboard ${whiteboard.id}`}
            >
              Whiteboard ID: {whiteboard.id}
            </Link>
            
            {/* Delete Button */}
            <button
              className="text-red-500 hover:text-red-700 ml-4"
              onClick={(event) => handleDeleteWhiteboard(event, whiteboard.id)}
              aria-label={`Delete whiteboard ${whiteboard.id}`}
            >
              x
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
