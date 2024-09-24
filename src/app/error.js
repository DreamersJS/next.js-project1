// app/error.js
'use client';

import { useEffect } from 'react';

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error('Error:', error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold text-red-600">Something went wrong!</h1>
      <button
        onClick={() => reset()} // Retry the action that caused the error
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Retry
      </button>
    </div>
  );
}
