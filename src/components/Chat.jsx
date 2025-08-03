'use client';

import { useState, useRef, useEffect  } from 'react';
import { useRecoilValue } from "recoil";
import { userState } from "@/recoil/atoms/userAtom";
import { useParams } from 'next/navigation';

export default function Chat({ messages, sendMessage }) {
  const [newMessage, setNewMessage] = useState("");
  const user = useRecoilValue(userState);
  const username = user?.username || 'Unknown';
  const { id: whiteboardId } = useParams();
  const messagesEndRef = useRef(null);

  const handleSend = () => {
    if (!newMessage.trim()) return;

    const messageData = {
      username,
      text: newMessage,
      roomId: whiteboardId,
    };

    sendMessage(messageData);
    setNewMessage("");
  };

  // Scroll to bottom on new messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto mb-2 pr-1 text-wrap break-all">
        <div className="space-y-2">
          {messages.map((message, index) => (
            <div key={index} className="bg-white p-2 rounded shadow-sm">
              <strong>{message.username}:</strong> {message.text}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="flex space-x-0.5 border-t border-gray-300 pt-1 mt-auto">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="Type a message"
          className="flex-1 border rounded text-sm placeholder-gray-400 placeholder:text-sm"
        />
        <button
          onClick={handleSend}
          className="text-sm bg-blue-700 hover:bg-blue-700 text-white px-0.5 py-1 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}
