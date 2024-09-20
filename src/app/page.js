// page.js
import dynamic from 'next/dynamic';
// Dynamically import the Canvas to prevent issues with SSR (since window isn't available during server-side rendering)
const Canvas = dynamic(() => import('./Canvas'), { ssr: false });
const Whiteboard = dynamic(() => import('./whiteboard/Whiteboard'), { ssr: false });
//  <Whiteboard />
export default function Home() {
  return (
    <>
    <div className="flex flex-col h-full">
      <h2 className="text-center text-2xl font-bold mt-4">Online Whiteboard</h2>
      <Whiteboard />
    </div>
    </>
  );
}
