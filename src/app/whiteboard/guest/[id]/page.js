// app/whiteboard/guest/[id]/page.js
'use client';
import dynamic from 'next/dynamic';

const Whiteboard = dynamic(() => import('@/components/Whiteboard'), { ssr: false });

const GuestWhiteboardWrapper = ({ params }) => {
  const { id } = params;

  return <Whiteboard id={id} isGuest={true} />;
};

export default GuestWhiteboardWrapper;
