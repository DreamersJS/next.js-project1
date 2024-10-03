"use client";
import { useState, useEffect } from 'react';
import { useSocketConnection } from '@/app/services/useSocket';
import { useRecoilValue } from "recoil";
import { userState } from "@/recoil/atoms/userAtom";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const user = useRecoilValue(userState);
  const username = user?.username;

  const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3000';
  if (!socketUrl) {
    console.error('Socket URL is undefined');
    return;
  }
  const socketRef = useSocketConnection(socketUrl, user);

  // Listen for incoming chat messages
  useEffect(() => {

    if (socketRef.current) {
      socketRef.current.on('message', (data) => {
        setMessages((prevMessages) => [...prevMessages, data]);
      });
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.off('message');
      }
    };
  }, [socketRef.current]);

  const handleSend = () => {
    if (socketRef.current && newMessage.trim()){
      setMessages([...messages, newMessage]);
      socketRef.current.emit('message', newMessage);
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
              {username || 'Unknown'}:{message}
            </div>
          ))}
        </div>
      </div>

      <div className="flex overflow-hidden space-x-2 border-t border-gray-300 pt-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message"
          className="flex-1 w-32  border rounded"
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
