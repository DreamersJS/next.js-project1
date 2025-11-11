import { whiteboardSocketHandler } from './whiteboard.mjs';
import { chatSocketHandler } from './chat.mjs';
import { CORS_OPTIONS } from '../cors.mjs';
import { Server as socketIo } from 'socket.io';

export const initSocket = (server) => {
  const io = new socketIo(server, CORS_OPTIONS);

  const whiteboardData = new Map();

  io.on('connection', (socket) => {
    whiteboardSocketHandler(io, socket, whiteboardData);
    chatSocketHandler(io, socket);

    socket.on('disconnect', () => {
      console.log(`Socket ${socket.id} disconnected`);
    });
    
  });

};
