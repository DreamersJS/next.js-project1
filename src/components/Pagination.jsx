'use client';
import React from 'react';

export default function Pagination({ currentPage, totalPages, onPrev, onNext }) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center mt-4">
      <button
        className="bg-blue-700 text-white px-4 py-2 rounded mr-2"
        onClick={onPrev}
        disabled={currentPage === 1}
      >
        Prev
      </button>
      <span className="px-4 py-2 mr-2">
        Page {currentPage} of {totalPages}
      </span>
      <button
        className="bg-blue-700 text-white px-4 py-2 rounded"
        onClick={onNext}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>
  );
}
