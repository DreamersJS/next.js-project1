'use client';

// import Chat from "@/components/Chat";
import { ChatBubbleBottomCenterTextIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useState, useEffect, useRef } from "react";
import { useSocketConnection } from "@/context/SocketProvider";
import { useParams } from 'next/navigation';
import dynamic from 'next/dynamic';

const Chat = dynamic(() => import('@/components/Chat'), { ssr: false });

export default function ChatToggleWrapper() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [messages, setMessages] = useState([]);

  const socketRef = useSocketConnection();
  const { id: whiteboardId } = useParams();

  // Join room once
  useEffect(() => {
    if (socketRef?.current && whiteboardId) {
      const socket = socketRef.current;
      socket.emit('joinRoom', whiteboardId);
    }
  }, [socketRef, whiteboardId]);

  // Listen for messages always
  useEffect(() => {
    if (!socketRef?.current) return;

    // capture once in var to avoid eslint issues
    const socket = socketRef.current;

    const handleMessage = (data) => {
      setMessages(prev => [...prev, data]);
      if (!isChatOpen) {
        setUnreadCount(prev => prev + 1);
      }
    };

    socket.on('message', handleMessage);

    return () => {
      socket.off('message', handleMessage);
    };
  }, [socketRef, isChatOpen]);

  const toggleChat = () => {
    setIsChatOpen(prev => !prev);
    if (!isChatOpen) setUnreadCount(0);
  };

  return (
    <div className=" flex flex-row h-screen overflow-hidden relative">
      <div className="fixed bottom-4 right-4 z-[1000]">
        {!isChatOpen ? (
          <button
            onClick={toggleChat}
            className="relative bg-blue-700 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg"
          >
            <ChatBubbleBottomCenterTextIcon className="h-6 w-6" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full px-1">
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
        <aside
          className="overflow-hidden bg-gray-200 p-2 border-l border-gray-300 w-56 flex-shrink-0 h-full"
          role="complementary"
          aria-label="Chat sidebar"
        >
          <Chat messages={messages} sendMessage={(msg) => {
            if (socketRef?.current) {
              socketRef.current.emit('message', msg);
            }
          }} />
        </aside>
      )}
    </div>
  );
}
