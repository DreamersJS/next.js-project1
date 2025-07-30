"use client";

import { useState, useEffect } from 'react';
import { useSocketConnection } from '@/hooks/useSocket';
import { useRecoilValue } from "recoil";
import { userState } from "@/recoil/atoms/userAtom";
import { useParams } from 'next/navigation';

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const user = useRecoilValue(userState);
  const username = user?.username;
  console.log("User:", user);

  const params = useParams();
  const whiteboardId = params.id;

  const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3000';
  if (!socketUrl) {
    console.error('Socket URL is undefined');
    return;
  }
  const socketRef = useSocketConnection(socketUrl, user);

  // Join the whiteboard room when the component mounts or when whiteboardId changes
  useEffect(() => {
    if (!socketRef.current || !whiteboardId) return;

    socketRef.current.emit('joinRoom', whiteboardId);
  }, [socketRef.current, whiteboardId]);

  // Listen for incoming chat messages
  useEffect(() => {

    if (socketRef.current) {
      const handleMessage = (data) => {
        console.log("Received message:", data);
        setMessages((prevMessages) => [...prevMessages, data]);
      };

      socketRef.current.on('message', handleMessage);

      // Cleanup listener when component unmounts or before adding a new one
      return () => {
        socketRef.current.off('message', handleMessage);
      };
    }
  }, [socketRef.current]);

  const handleSend = () => {
    if (socketRef.current && newMessage.trim()) {
      const messageData = {
        username: username || 'Unknown',
        text: newMessage,
        roomId: whiteboardId,  // Include whiteboard ID 
      };
      socketRef.current.emit('message', messageData);
      setNewMessage("");
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto mb-4">
        <h2 className="text-lg font-semibold mb-4">Chat</h2>
        <div className="space-y-2 overflow-scroll">
          {messages.map((message, index) => (
            <div key={index} className="bg-white p-2 rounded shadow-sm">
              {message.username}: {message.text}
            </div>
          ))}
        </div>
      </div>

      <div className="flex overflow-hidden space-x-2 border-t border-gray-300 pt-2">
        <input
          type="text"
          value={newMessage}
          name='message input'
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault(); // Prevents newline
              handleSend();
            }
          }}
          placeholder="Type a message"
          className="flex-1 w-32 border rounded"
        />
        <button
          onClick={handleSend}
          className="bg-blue-500 text-white py-2 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}
