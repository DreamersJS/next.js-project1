// components/WhiteboardList.jsx
'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function WhiteboardList() {
  const [whiteboards, setWhiteboards] = useState([]);

  useEffect(() => {

    const fetchWhiteboards = async () => {
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
            setWhiteboards(whiteboardsArray);
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
      }
    };

    fetchWhiteboards();
  }, []);

  if (!Array.isArray(whiteboards) || whiteboards.length === 0) {
    return <div className="mt-8">No whiteboards available</div>;
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Available Whiteboards</h2>
      <ul>
        {whiteboards.map((whiteboard) => (
          <li className="bg-white p-4 rounded shadow-md hover:bg-gray-100 transition-colors" key={whiteboard.id}>
            <Link href={`/whiteboard/[id]`} as={`/whiteboard/${whiteboard.id}`} passHref className="text-blue-500 hover:underline" aria-label={`Go to whiteboard ${whiteboard.id}`}>
              Whiteboard ID: {whiteboard.id}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}