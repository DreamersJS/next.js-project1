// page.js
import dynamic from 'next/dynamic';
// Dynamically import the Canvas to prevent issues with SSR (since window isn't available during server-side rendering)
const Whiteboard = dynamic(() => import('./whiteboard/Whiteboard'), { ssr: false });

export default function Home() {
  return (
    <>
    <div>
      <Whiteboard />
    </div>
    </>
  );
}
