'use client';
import { useEffect } from 'react';

const ErrorDisplay = ({ error, reset })=> {
  useEffect(() => {
    console.error('Error:', error);
  }, [error]);

  return (
    <div 
      className="flex flex-col items-center justify-center h-screen"
      role="alert" 
      aria-live="assertive"
      aria-label="Error notification"
    >
      <h1 className="text-2xl font-bold text-red-600">Something went wrong!</h1>
      <button
        onClick={() => reset()}
        className="mt-4 px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-700 transition"
        aria-label="Retry the action"
      >
        Retry
      </button>
    </div>
  );
}
export default ErrorDisplay;