// lib/useSocket.js
import { useEffect, useState } from "react";
import io from 'socket.io-client';

export function useSocket() {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Initialize the socket connection
    const newSocket = io();
    setSocket(newSocket);

    // Cleanup on component unmount
    return () => {
      newSocket.disconnect();
    };
  }, []); // Empty dependency array ensures this runs only once

  return socket;
}
