'use client'
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
    const socketRef = useRef(null);
    const [isReady, setIsReady] = useState(false);
    const [socketUrl, setSocketUrl] = useState(null);

    // 1. Fetch the config from your API
    useEffect(() => {
        const fetchConfig = async () => {
            try {
                console.log('Fetching socket config...');
                const res = await fetch('/api/config');
                const data = await res.json();
                console.log('Fetched config:', data);
                setSocketUrl(data.socketUrl);
            } catch (err) {
                console.error('Failed to fetch socket URL:', err);
            }
        };
        fetchConfig();
    }, []);

    // 2️. Initialize socket once socketUrl is available
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
            console.log(`Socket connected with ID: ${socketRef.current.id}`);
            setIsReady(true); // trigger re-render only after connection
        });

        socketRef.current.on('connect_error', (err) => {
            console.error('Socket.IO connection error:', err);
        });

        console.log({ socketUrl });
        return () => {
            socketRef.current.disconnect();
            console.log('Socket disconnected');
        };
    }, [socketUrl]);

    if (!isReady) {
        return <div style={{ textAlign: 'center', marginTop: '2rem' }}>Connecting to whiteboard...</div>;
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
