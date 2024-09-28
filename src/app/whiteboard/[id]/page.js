// app/whiteboard/[id]/page.js
'use client';

import dynamic from 'next/dynamic';
// Dynamically import the Canvas to prevent issues with SSR (since window isn't available during server-side rendering)
const Whiteboard = dynamic(() => import('@/components/Whiteboard'), { ssr: false });

const WhiteboardPage = ({ params }) => {
  const { id } = params; // Access the dynamic ID from the URL

  return (
    <div aria-labelledby="whiteboard-session-heading" role="main" className="p-0">
      {/* <h3 id="whiteboard-session-heading" className="mt-4 text-xl font-semibold" aria-label={`Whiteboard Session ID: ${id}`}>
        Whiteboard Session: {id}
      </h3> */}
      <Whiteboard id={id} /> {/* Passing the ID to the Whiteboard component */}
    </div>
  );
};

export default WhiteboardPage;
