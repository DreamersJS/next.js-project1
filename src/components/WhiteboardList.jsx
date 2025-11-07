'use client';
import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useUser } from '@/hooks/useUser';
import { useRouter } from 'next/navigation';
import WhiteboardItem from './WhiteboardListItem';
import Pagination from './Pagination';
import { usePagination } from '@/hooks/usePagination';

export default function WhiteboardList() {
  const { user, setUser } = useUser();
  const [whiteboards, setWhiteboards] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const {
    currentPage,
    totalPages,
    paginatedItems,
    nextPage,
    prevPage,
  } = usePagination(whiteboards, 5);

  const handleLoadSingleWhiteboard = useCallback(async (e, whiteboardId) => {
    e.preventDefault();
    const { loadWhiteboardById } = await import('@/services/whiteboardService');
    const data = await loadWhiteboardById(whiteboardId);
    router.push(`/whiteboard/${whiteboardId}`);
  }, [router]);

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

  if (loading) return <div className="mt-8">Loading whiteboards...</div>;
  if (!whiteboards.length) return <div className="mt-8">No whiteboards available</div>;

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Your Whiteboards</h2>
      <ul>
        {paginatedItems.map((id) => (
          <WhiteboardItem
            key={id}
            id={id}
            onDelete={handleDeleteWhiteboard}
            onLoad={handleLoadSingleWhiteboard}
          />
        ))}
      </ul>

      {/* Pagination Controls */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPrev={prevPage}
        onNext={nextPage}
      />
    </div>
  );
}