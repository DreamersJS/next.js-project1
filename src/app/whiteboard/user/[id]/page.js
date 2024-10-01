// app/whiteboard/user/[id]/page.js
'use client';
import dynamic from 'next/dynamic';

const Whiteboard = dynamic(() => import('@/components/Whiteboard'), { ssr: false });

const UserWhiteboardWrapper = ({ params }) => {
  const { id } = params;

  return <Whiteboard id={id} isGuest={false} />;
};

export default UserWhiteboardWrapper;
