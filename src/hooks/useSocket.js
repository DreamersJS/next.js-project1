'use client';
import { useRef, useEffect } from 'react';
import io from 'socket.io-client';

/**
 * Custom hook to manage socket connection.
 * @param {string} socketUrl - process.env.NEXT_PUBLIC_SOCKET_URL
 * @param {string} user - 
 * @returns {Object} - An object containing the socket reference.
 */
export const useSocketConnection = (socketUrl, user) => {
  const socketRef = useRef(null);

  useEffect(() => {
    if (!socketUrl) {
      console.error('Socket URL is undefined');
      return;
    }

    socketRef.current = io(socketUrl, {
      query: { username: user?.username || 'Anonymous' },
      reconnection: true,
    });

    socketRef.current.on('connect', () => {
      console.log(`Connected io with ID: ${socketRef.current.id}`);
    });

    socketRef.current.on('connect_error', (err) => {
      console.error('Socket.IO connection error:', err);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        console.log('Socket.IO Client disconnected');
      }
    };
  }, [socketUrl, user]);

  return socketRef;
};