import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';
import { Server as socketIo } from 'socket.io';
import dotenv from 'dotenv';
dotenv.config(); // Load environment variables from a .env file

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });

  const io = new socketIo(server);

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
      for (const room of socket.rooms) {
        if (room !== socket.id) {
          socket.leave(room); // Leave all rooms except its own ID
          console.log(`${socket.id} auto-left room ${room}`);
        }
      }
      socket.join(whiteboardId);

      // Initialize board if not exist
      if (!whiteboardData.has(whiteboardId)) {
        console.log(`!whiteboardData.has(whiteboardId for ${whiteboardId}`);
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
      console.log(`${socket.id} left room ${whiteboardId}`);
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
      // board.drawnShapes = board.undoStack.slice();
      console.log('Sending shape to client:', shape);

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
    });
  });

  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`Ready on http://localhost:${port}`);
  });
});
