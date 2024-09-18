// page.js
import dynamic from 'next/dynamic';
// Dynamically import the Canvas to prevent issues with SSR (since window isn't available during server-side rendering)
const Canvas = dynamic(() => import('./Canvas'), { ssr: false });

export default function Home() {
  return (
    <>
      <h1>HEY! Welcome to your Next.js app!</h1>
      <h2 className="text-center text-2xl font-bold mt-4">Online Whiteboard</h2>
      <Canvas />
    </>
  );
}
