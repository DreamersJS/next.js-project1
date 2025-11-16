'use client';
import { AuthProvider } from "@/context/AuthProvider";
import { SocketProvider } from "@/context/SocketProvider";
import dynamic from 'next/dynamic';
const ChatToggleWrapper = dynamic(() => import('@/components/ChatToggleWrapper'), { ssr: false });

export default function WhiteboardLayout({ children }) {

  return (
    <AuthProvider>
      <div className="flex flex-row h-screen overflow-hidden">
        {/* Main Content - Whiteboard */}
        <main className="flex-grow h-full bg-white p-0 flex items-center justify-center overflow-hidden">
          <SocketProvider>
            {children}
          </SocketProvider>
        </main>

        {/* Right Rail - Chat */}
        <aside>
          <ChatToggleWrapper />
        </aside>
      </div>
    </AuthProvider>
  );
}
