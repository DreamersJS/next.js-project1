"use client";
import { useState, useEffect } from 'react';

export default function Chat({socket, username}) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    if (socket) {
      socket.on('message', (data) => {
        setMessages((prevMessages) => [...prevMessages, data]);
      });
    }
  
    return () => {
      if (socket) {
        socket.off('message');
      }
    };
  }, [socket]);
  
  const handleSend = () => {
    if (newMessage.trim()) {
      setMessages([...messages, newMessage]);
      socket.emit('message', { newMessage, username });
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
