'use client';
import { useCallback, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useUser } from '@/hooks/useUser';

// Dynamically import the Canvas to prevent issues with SSR (since window isn't available during server-side rendering)
const Whiteboard = dynamic(() => import('@/components/Whiteboard'), { ssr: false });

const WhiteboardPage = ({ params }) => {
  const { id } = params;
  const router = useRouter();
  const { user } = useUser();

  const navigateTo = useCallback((path) => {
    router.push(`/${path}`);
  }, [router]);


  useEffect(() => {
    if (!user) {
      navigateTo(`login?redirect=/whiteboard/${id}`);
    }
  }, [user, id, navigateTo]);

  if (!user) {
    return <p>Redirecting to login...</p>;
  }

  return (
    <div aria-labelledby="whiteboard-session-heading" role="main" className="p-0">
      <Whiteboard id={id} />
    </div>
  );
};

export default WhiteboardPage;
