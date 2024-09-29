// app/whiteboard/[id]/page.js
'use client';

import dynamic from 'next/dynamic';
// Dynamically import the Canvas to prevent issues with SSR (since window isn't available during server-side rendering)
const Whiteboard = dynamic(() => import('@/components/Whiteboard'), { ssr: false });

const WhiteboardPage = ({ params }) => {
  const { id } = params; 

  return (
    <div aria-labelledby="whiteboard-session-heading" role="main" className="p-0">
      <Whiteboard id={id} />
    </div>
  );
};

export default WhiteboardPage;
