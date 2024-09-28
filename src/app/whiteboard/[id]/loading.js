// whiteboard/[id]/loading.js
import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h2 className="text-2xl font-bold mb-4">Loading...</h2>
      {/* Add some skeleton loaders */}
      <Skeleton height={40} width={300} className="mb-4" />
      <Skeleton height={30} width={200} className="mb-4" />
      <Skeleton height={500} width={600} />
    </div>
  );
}
