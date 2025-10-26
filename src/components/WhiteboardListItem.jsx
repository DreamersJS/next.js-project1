'use client';
import Link from 'next/link';
import React from 'react';

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
export default WhiteboardItem;