// app/whiteboard/[id]/page.js
'use client';

import dynamic from 'next/dynamic';
// Dynamically import the Canvas to prevent issues with SSR (since window isn't available during server-side rendering)
const Whiteboard = dynamic(() => import('../../../components/Whiteboard'), { ssr: false });

const WhiteboardPage = ({ params }) => {
  const { id } = params; // Access the dynamic ID from the URL

  return (
    <div>
      <h3 className='mt-4'>Whiteboard Session: {id}</h3>
      <Whiteboard id={id} /> {/* Passing the ID to the Whiteboard component */}
    </div>
  );
};

export default WhiteboardPage;
