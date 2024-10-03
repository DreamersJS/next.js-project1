'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { useSetRecoilState } from "recoil";
import { userState } from '@/recoil/atoms/userAtom';
import { deleteWhiteboard, getUserWhiteboards, loadWhiteboardById } from '@/app/services/whiteboardService';

export default function WhiteboardList() {
  const user = useRecoilValue(userState);
  const setUser = useSetRecoilState(userState);
  const [whiteboards, setWhiteboards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user.uid || !user.listOfWhiteboardIds) return;
  
    loadUserWhiteboards(user.uid);
  }, [user.uid]);
  
  const loadUserWhiteboards = async (userId) => {
    setLoading(true); 
    try {
      const whiteboardIds = await getUserWhiteboards(userId);
      const whiteboardData = await Promise.all(
        whiteboardIds.map(async (whiteboardId) => await loadWhiteboardById(whiteboardId))
      );
      setWhiteboards(whiteboardData);
    } catch (error) {
      console.error('Error loading user whiteboards:', error);
    } finally {
      setLoading(false); 
    }
  };
  
  if (loading) {
    return <div className="mt-8">Loading whiteboards...</div>;
  }
  
  if (!Array.isArray(whiteboards) || whiteboards.length === 0) {
    return <div className="mt-8">No whiteboards available</div>;
  }

  // Function to handle the deletion of a whiteboard
  const handleDeleteWhiteboard = async (event, whiteboardId) => {
    event.stopPropagation();
    
    // Optimistically remove the whiteboard from the UI
    setWhiteboards((prevWhiteboards) =>
      prevWhiteboards.filter((whiteboard) => whiteboard.id !== whiteboardId)
    );
    
    try {
      await deleteWhiteboard(user.uid, whiteboardId);
  
      setUser((prevUser) => ({
        ...prevUser,
        listOfWhiteboardIds: prevUser.listOfWhiteboardIds.filter(id => id !== whiteboardId),
      }));
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
