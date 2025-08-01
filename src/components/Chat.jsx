'use client';

import { useState } from 'react';
import { useRecoilValue } from "recoil";
import { userState } from "@/recoil/atoms/userAtom";
import { useParams } from 'next/navigation';

export default function Chat({ messages, sendMessage }) {
  const [newMessage, setNewMessage] = useState("");
  const user = useRecoilValue(userState);
  const username = user?.username || 'Unknown';

  const { id: whiteboardId } = useParams();

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

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto mb-4">
        <h2 className="text-lg font-semibold mb-4">Chat</h2>
        <div className="space-y-2">
          {messages.map((message, index) => (
            <div key={index} className="bg-white p-2 rounded shadow-sm">
              <strong>{message.username}:</strong> {message.text}
            </div>
          ))}
        </div>
      </div>

      <div className="flex space-x-2 border-t border-gray-300 pt-2">
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
          className="flex-1 border rounded p-1"
        />
        <button
          onClick={handleSend}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}
