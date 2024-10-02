// components/WhiteboardLayout.jsx
'use client';
import Chat from "@/components/Chat";
import { AuthProvider } from "@/app/services/AuthProvider";
import { useRecoilValue } from "recoil";
import { userState } from "@/recoil/atoms/userAtom"; 
import { useSocket } from "@/app/services/SocketContext"; 
import React, { useEffect, useState } from "react";

export default function WhiteboardLayout({ children }) {
  const user = useRecoilValue(userState);
  const username = user?.username;

  return (
    // <SocketProvider>
      <AuthProvider>
        <div className="flex-grow flex m-1 p-0 h-full overflow-hidden relative">
          {/* Main Content - Whiteboard */}
          <main className="flex-grow bg-white p-0 flex items-center justify-center">
            {/* Pass the socket to children components */}
            {React.cloneElement(children, { socket: useSocket() })} {/* Pass socket to children */}
          </main>

          {/* Right Rail - Chat */}
          <aside className="bg-gray-200 p-2 mx-2 top-0 right-0 border-l border-gray-300 w-56 flex-shrink-0">
            <Chat socket={useSocket()} username={username} /> {/* Pass socket to Chat component */}
          </aside>
        </div>
      </AuthProvider>
    // </SocketProvider>
  );
}
