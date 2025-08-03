'use client';
import ChatToggleWrapper from "@/components/ChatToggleWrapper";
import { AuthProvider } from "@/context/AuthProvider";

export default function WhiteboardLayout({ children }) {

  return (
      <AuthProvider>
        <div className="flex flex-row h-screen overflow-hidden">
          {/* Main Content - Whiteboard */}
          <main className="flex-grow h-full bg-white p-0 flex items-center justify-center overflow-hidden">
            {children}
          </main>

          {/* Right Rail - Chat */}
          <aside>
            <ChatToggleWrapper />
          </aside>
        </div>
      </AuthProvider>
  );
}
