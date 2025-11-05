'use client';
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
    const socketRef = useRef(null);
    const [isReady, setIsReady] = useState(false);
    const [socketUrl, setSocketUrl] = useState(null);

    // Fetch and cache socket URL
    useEffect(() => {
        const getSocketUrl = async () => {
            // Check if cached in sessionStorage
            const cached = sessionStorage.getItem('socketUrl');
            if (cached) {
                setSocketUrl(cached);
                return;
            }

            try {
                const res = await fetch('/api/config');
                const data = await res.json();
                if (data?.socketUrl) {
                    setSocketUrl(data.socketUrl);
                    sessionStorage.setItem('socketUrl', data.socketUrl); // cache it
                } else {
                    console.error('Socket URL not found in API response.');
                }
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
        return <div>Connecting to server...</div>;
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
