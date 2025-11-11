'use client';
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
    const socketRef = useRef(null);
    const [isReady, setIsReady] = useState(false);
    const [socketUrl, setSocketUrl] = useState(null);

    useEffect(() => {
        const getSocketUrl = async () => {
            try {
                const res = process.env.NEXT_PUBLIC_SOCKET_URL
                setSocketUrl(res);
            } catch (err) {
                console.error('Failed to fetch socket URL:', err);
            }
        };

        getSocketUrl();
    }, []);

    // Initialize socket once socketUrl is available
    useEffect(() => {
        if (!socketUrl) {
            console.warn('No socketUrl yet');
            return;
        }

        socketRef.current = io(socketUrl, {
            transports: ["websocket"], // avoid long-polling fallback
            reconnection: true
        });

        socketRef.current.on('connect', () => {
            setIsReady(true);
        });

        socketRef.current.on('connect_error', (err) => {
            console.error('Socket.IO connection error:', err);
        });

        return () => {
            socketRef.current?.disconnect();
        };
    }, [socketUrl]);

    if (!isReady) {
        return <LoadingUI />;
    }

    return (
        <SocketContext.Provider value={socketRef}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocketConnection = () => {
    return useContext(SocketContext);
};

const LoadingUI = () => (
    <div>Connecting to server...</div>
);