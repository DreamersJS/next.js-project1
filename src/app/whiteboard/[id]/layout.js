'use client';

import Chat from "@/components/Chat";
import { AuthProvider } from "@/context/AuthProvider";
import { ChatBubbleBottomCenterTextIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useState, useEffect, useRef } from "react";
import { useSocketConnection } from "@/context/SocketProvider";
import { useParams } from 'next/navigation';

export default function WhiteboardLayout({ children }) {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [messages, setMessages] = useState([]);

  const socketRef = useSocketConnection();
  const { id: whiteboardId } = useParams();

  // Join room once
  useEffect(() => {
    if (socketRef?.current && whiteboardId) {
      socketRef.current.emit('joinRoom', whiteboardId);
    }
  }, [socketRef, whiteboardId]);

  // Listen for messages always
  useEffect(() => {
    if (!socketRef?.current) return;

    const handleMessage = (data) => {
      setMessages(prev => [...prev, data]);
      if (!isChatOpen) {
        setUnreadCount(prev => prev + 1);
      }
    };

    socketRef.current.on('message', handleMessage);

    return () => {
      socketRef.current.off('message', handleMessage);
    };
  }, [socketRef, isChatOpen]);

  const toggleChat = () => {
    setIsChatOpen(prev => !prev);
    if (!isChatOpen) setUnreadCount(0);
  };

  return (
    <AuthProvider>
      <div className="flex flex-row h-screen overflow-hidden relative">
        <main className="flex-grow h-full bg-white p-0 flex items-center justify-center overflow-hidden">
          {children}
        </main>

        <div className="fixed bottom-4 right-4 z-[1000]">
          {!isChatOpen ? (
            <button
              onClick={toggleChat}
              className="relative bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full shadow-lg"
            >
              <ChatBubbleBottomCenterTextIcon className="h-6 w-6" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">
                  {unreadCount}
                </span>
              )}
            </button>
          ) : (
            <button
              onClick={toggleChat}
              className="relative bg-gray-300 hover:bg-gray-400 text-black p-3 rounded-full shadow-lg"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          )}
        </div>

        {isChatOpen && (
          <aside className="bg-gray-200 p-2 border-l border-gray-300 w-64 flex-shrink-0 h-full">
            <Chat messages={messages} sendMessage={(msg) => {
              if (socketRef?.current) {
                socketRef.current.emit('message', msg);
              }
            }} />
          </aside>
        )}
      </div>
    </AuthProvider>
  );
}
