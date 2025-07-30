// components/WhiteboardLayout.jsx
'use client';
import Chat from "@/components/Chat";
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
          <aside className="bg-gray-200 p-2 mx-2 top-0 right-0 border-l border-gray-300 w-56 flex-shrink-0">
            <Chat />
          </aside>
        </div>
      </AuthProvider>
  );
}
