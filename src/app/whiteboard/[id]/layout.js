// whiteboard/[id]/layout.js
'use client';
import Chat from "@/components/Chat";
import { AuthProvider } from "@/components/AuthProvider";
import { useRecoilValue } from "recoil";
import { userState } from "@/recoil/atoms/userAtom";
import { useSocket } from "@/app/services/useSocket"; 
import React, { useEffect, useState } from "react";

export default function WhiteboardLayout({ children }) {
  const user = useRecoilValue(userState);
  const username = user.username;

  // Use the custom hook to get the socket instance
  const socket = useSocket();

  // States for loading and error messages
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (!socket) {
        setLoading(false);
        setError("Error: Unable to connect to the server.");
      }
    }, 5000); // Set the timeout duration (5 seconds)

    if (socket) {
      // If socket is ready, clear the timeout and set loading to false
      setLoading(false);
      clearTimeout(timeoutId);
    }

    // Clean up the timeout on component unmount
    return () => {
      clearTimeout(timeoutId);
    };
  }, [socket]);

  // Conditional rendering based on loading and error states
  if (loading) {
    return <div>Loading...</div>; // Loading indicator
  }

  if (error) {
    return <div>{error}</div>; // Error message
  }

  return (
    <div className="flex-grow flex m-1 p-0 h-full overflow-hidden relative">
      {/* Main Content - Whiteboard */}
      <main className="flex-grow bg-white p-0 flex items-center justify-center">
        <AuthProvider>
          {/* Pass the socket to children components */}
          {React.cloneElement(children, { socket })}
        </AuthProvider>
      </main>

      {/* Right Rail - Chat */}
      <aside className="bg-gray-200 p-2 mx-2 top-0 right-0 border-l border-gray-300 w-56 flex-shrink-0">
        <Chat socket={socket} username={username} />
      </aside>
    </div>
  );
}
