'use client';
import Link from 'next/link';
import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useUser } from '@/hooks/useUser';
import { useRouter } from 'next/navigation';

const WhiteboardItem = React.memo(function WhiteboardItem({ id, onDelete, onLoad }) {
  return (
    <li
      className="bg-white p-4 rounded shadow-md hover:bg-gray-100 transition-colors flex justify-between items-center"
    >
      <Link
        href={`/whiteboard/${id}`}
        onClick={(e) => onLoad(e, id)}
        className="text-blue-600 hover:underline flex-grow"
        aria-label={`Go to whiteboard ${id}`}
      >
        Whiteboard ID: {id}
      </Link>
      <button
        className="text-red-500 hover:text-red-700 ml-4"
        onClick={(event) => onDelete(event, id)}
        aria-label={`Delete whiteboard ${id}`}
      >
        x
      </button>
    </li>
  );
});

export default function WhiteboardList() {
  const { user, setUser } = useUser();
  const [whiteboards, setWhiteboards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;
  const router = useRouter();

  const handleLoadSingleWhiteboard = useCallback(async (e, whiteboardId) => {
    e.preventDefault();
    const { loadWhiteboardById } = await import('@/services/whiteboardService');
    const data = await loadWhiteboardById(whiteboardId);
    router.push(`/whiteboard/${whiteboardId}`);
  }, []);

  const loadUserWhiteboards = useCallback(async (userId) => {
    setLoading(true);
    const { getUserWhiteboards } = await import('@/services/whiteboardService');
    try {
      const whiteboardIds = await getUserWhiteboards(userId);
      setWhiteboards(whiteboardIds || []);
    } catch (error) {
      console.error('Error loading user whiteboards:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user?.uid) {
      loadUserWhiteboards(user.uid);
    }
  }, [user?.uid, loadUserWhiteboards]);

  const handleDeleteWhiteboard = useCallback(async (event, whiteboardId) => {
    event.stopPropagation();
    if (!confirm('Are you sure you want to delete this whiteboard?')) return;
    const { deleteWhiteboard } = await import('@/services/whiteboardService');


    try {
      await deleteWhiteboard(whiteboardId, user.uid);
      setWhiteboards((prev) => prev.filter((id) => id !== whiteboardId));
      setUser((prevUser) => ({
        ...prevUser,
        listOfWhiteboardIds: (prevUser.listOfWhiteboardIds || []).filter(
          (id) => id !== whiteboardId
        ),
      }));
    } catch (error) {
      console.error('Error deleting whiteboard:', error);
    }
  }, [setUser, user?.uid]);

  // Pagination
  const totalPages = Math.ceil(whiteboards.length / pageSize);
  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages || 1);
  }, [whiteboards.length, currentPage, totalPages]);
  const paginatedWhiteboards = useMemo(
    () => whiteboards.slice((currentPage - 1) * pageSize, currentPage * pageSize),
    [whiteboards, currentPage, pageSize]
  );

  if (loading) return <div className="mt-8">Loading whiteboards...</div>;
  if (!whiteboards.length) return <div className="mt-8">No whiteboards available</div>;

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Your Whiteboards</h2>
      <ul>
        {paginatedWhiteboards.map((id) => (
          <WhiteboardItem
            key={id}
            id={id}
            onDelete={handleDeleteWhiteboard}
            onLoad={handleLoadSingleWhiteboard}
          />
        ))}

      </ul>

      {/* Pagination Controls */}
      <div className="flex justify-center mt-4">
        <button
          className="bg-blue-700 text-white px-4 py-2 rounded mr-2"
          onClick={() => setCurrentPage((p) => p - 1)}
          disabled={currentPage === 1}
        >
          Prev
        </button>
        <span className="px-4 py-2 mr-2">
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="bg-blue-700 text-white px-4 py-2 rounded"
          onClick={() => setCurrentPage((p) => p + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}
