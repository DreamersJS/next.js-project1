import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';
import { Server as socketIo } from 'socket.io';
import dotenv from 'dotenv';
dotenv.config();

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const securityHeaders = {
    'Content-Security-Policy': `
        default-src 'self';
        script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.gstatic.com https://*.firebaseio.com https://*.firebaseapp.com https://*.firebasedatabase.app https://apis.google.com;
        style-src 'self' 'unsafe-inline';
        img-src 'self' data: https://*.googleusercontent.com https://*.firebaseapp.com https://avatars.dicebear.com https://images.pexels.com;
        connect-src 'self' https://*.firebaseio.com https://identitytoolkit.googleapis.com https://securetoken.googleapis.com wss:;
        font-src 'self' https://fonts.googleapis.com https://fonts.gstatic.com;
        frame-src 'self' https://*.firebaseio.com https://*.firebasedatabase.app https://*.firebaseapp.com https://www.gstatic.com;
      `.replace(/\s{2,}/g, ' ').trim(),
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
    'Cross-Origin-Opener-Policy': 'same-origin',
    'X-Frame-Options': 'DENY',
  };


  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);

    // Set security headers on every response
    for (const [key, value] of Object.entries(securityHeaders)) {
      res.setHeader(key, value);
    }

    process.env.SOCKET_URL = process.env.SOCKET_URL ?? '';
    process.env.CLIENT_ORIGIN = process.env.CLIENT_ORIGIN ?? '';

    // Optional: make NEXT_PUBLIC_* vars available to server code
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY = process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? '';
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? '';
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? '';
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? '';
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID = process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? '';
    process.env.NEXT_PUBLIC_FIREBASE_APP_ID = process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? '';
    process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL = process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL ?? '';

    handle(req, res, parsedUrl);
  });

  const CORS_OPTIONS = {
    cors: {
      origin: process.env.CLIENT_ORIGIN,
      methods: ["GET", "POST"],
      credentials: true
    }
  };

  const io = new socketIo(server, CORS_OPTIONS);

  const whiteboardData = new Map();

  io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('previewDraw', (whiteboardId, data) => {
      // Broadcast the preview to other clients but do not store it
      socket.to(whiteboardId).broadcast.emit('previewDraw', data);
    });

    // Broadcast mouse movement to other clients
    socket.on('mousemove', (whiteboardId, data) => {
      socket.to(whiteboardId).broadcast.emit('mousemove', data);
    });

    socket.on('join', (whiteboardId) => {

      if (!socket.rooms.has(whiteboardId)) {
        socket.join(whiteboardId);
        console.log(`${socket.id} joined room ${whiteboardId}`);
      }

      // Initialize board if not exist
      if (!whiteboardData.has(whiteboardId)) {
        whiteboardData.set(whiteboardId, {
          drawnShapes: [],
          undoStack: [],
          redoStack: [],
        });
      }
      const board = whiteboardData.get(whiteboardId);
      if (board) {
        // Send the current drawnShapes to the newly joined client
        socket.emit('initDrawings', board.drawnShapes || []);
      }
    });

    socket.on('leave', (whiteboardId) => {
      socket.leave(whiteboardId);
      console.log(`${socket.id} manually left room ${whiteboardId}`);
    });

    socket.on('draw', ({ whiteboardId, shape }) => {
      if (!whiteboardData.has(whiteboardId)) {
        whiteboardData.set(whiteboardId, {
          drawnShapes: [],
          undoStack: [],
          redoStack: [],
          content: "",     // Optional: for base64 image
        });
      }
      const board = whiteboardData.get(whiteboardId);
      if (!board) return;

      board.undoStack.push(shape);
      board.redoStack = [];
      board.drawnShapes.push(shape);

      io.to(whiteboardId).emit('draw', shape);
    });

    socket.on('clear', (whiteboardId) => {
      const board = whiteboardData.get(whiteboardId);
      if (!board) return;

      board.drawnShapes = [];
      board.undoStack = [];
      board.redoStack = [];

      io.to(whiteboardId).emit('clear');
    });

    socket.on('undo', (whiteboardId) => {
      const board = whiteboardData.get(whiteboardId);
      if (!board) return;

      if (board.undoStack.length > 0) {
        const shape = board.undoStack.pop();
        board.redoStack.push(shape);
        board.drawnShapes = board.undoStack.slice(); // Reflect the change in drawnShapes

        // Broadcast the updated state to all clients
        io.to(whiteboardId).emit('initDrawings', board.drawnShapes.filter(Boolean)); // This ensures all clients get the same, updated state
      }
    });

    socket.on('redo', (whiteboardId) => {
      const board = whiteboardData.get(whiteboardId);
      if (!board) return;

      if (board.redoStack.length > 0) {
        const shape = board.redoStack.pop();
        board.undoStack.push(shape);
        board.drawnShapes.push(shape);

        io.to(whiteboardId).emit('draw', shape); // Send the redone shape to all clients
      }
    });

    socket.on('loadImage', (whiteboardId, imageData) => {
      // Load the image data (in base64 or URL format) as a drawable shape
      const imageShape = {
        tool: 'image',
        src: imageData.src,
        startX: imageData.startX,
        startY: imageData.startY,
        width: imageData.width,
        height: imageData.height,
      };

      const board = whiteboardData.get(whiteboardId);
      if (!board) return;

      board.drawnShapes.push(imageShape);
      board.undoStack.push(imageShape);
      board.redoStack = [];

      io.to(whiteboardId).emit('draw', imageShape)
    });

    // for chat only
    socket.on('joinRoom', (roomId) => {
      socket.join(roomId);
      console.log(`${socket.id} joined room ${roomId}`);
    });

    socket.on('message', (data) => {
      const { roomId, username, text } = data;
      if (!roomId) return;  // Safety check
      io.to(roomId).emit('message', { username, text });
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected');
      return () => {
        socket.off('disconnect');
      };
    });
  });

  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`Ready on http://localhost:${port} [NODE_ENV=${process.env.NODE_ENV}] ${process.env.CLIENT_ORIGIN}${process.env.SOCKET_URL}`);
  });
});


// inspect Node memory programmatically
// setInterval(() => {
//   console.log(process.memoryUsage());
// }, 50000);