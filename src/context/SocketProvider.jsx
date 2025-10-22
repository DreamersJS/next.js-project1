'use client'
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
    const socketRef = useRef(null);
    const [isReady, setIsReady] = useState(false);
    const socketUrl = process.env.SOCKET_URL;

    useEffect(() => {
        socketRef.current = io(socketUrl, {
            transports: ["websocket"], // avoid long-polling fallback
            reconnection: true
        });

        socketRef.current.on('connect', () => {
            console.log(`Socket connected with ID: ${socketRef.current.id}`);
            setIsReady(true); // trigger re-render only after connection
        });

        socketRef.current.on('connect_error', (err) => {
            console.error('Socket.IO connection error:', err);
        });

        console.log({socketUrl});
        return () => {
            socketRef.current.disconnect();
            console.log('Socket disconnected');
        };
    }, [socketUrl]);

    if (!isReady) return null; // or loading UI

    return (
        <SocketContext.Provider value={socketRef}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocketConnection = () => {
    return useContext(SocketContext);
};
