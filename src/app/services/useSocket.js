// service/useSocket.js
import { useEffect, useState } from "react";
import io from 'socket.io-client';

export function useSocket() {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Initialize socket connection, pass the server URL and options if needed
    const newSocket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3000', {
      reconnectionAttempts: 5, // Automatically retry up to 5 times
      transports: ['websocket'], // Enforce WebSocket connection
    });

    // Set the socket instance
    setSocket(newSocket);

    // Log connection events for debugging
    newSocket.on('connect', () => {
      console.log('Connected to socket server');
    });

    newSocket.on('disconnect', (reason) => {
      console.warn('Socket disconnected:', reason);
    });

    newSocket.on('connect_error', (err) => {
      console.error('Socket connection error:', err);
    });

    // Cleanup when component unmounts or dependency changes
    return () => {
      newSocket.disconnect(); // Properly close the socket connection
      console.log('Socket disconnected on unmount');
    };
  }, []); // Run only once on mount

  return socket;
}
