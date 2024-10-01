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

  let drawnShapes = [];
  let undoStack = [];
  let redoStack = [];

  io.on('connection', (socket) => {
    console.log('New client connected');
    // const username = socket.handshake.query.username; // Retrieve username from query params

    // Send all previously drawn shapes to the new client
    socket.emit('initDrawings', drawnShapes);

    socket.on('previewDraw', (data) => {
      // Broadcast the preview to other clients but do not store it
      socket.broadcast.emit('previewDraw', data);
    });

    // Broadcast mouse movement to other clients
    socket.on('mousemove', (data) => {
      socket.broadcast.emit('mousemove', data);
    });

    socket.on('draw', (data) => {
      // Save the new shape
      // socket.broadcast.emit('draw', data);
      drawnShapes.push(data);
      undoStack.push(data); // Add to the undo stack
      redoStack = []; // Clear the redo stack as the new action invalidates future redos

      // Broadcast the drawing event to all clients, including the sender
      io.emit('draw', data);
    });

    socket.on('message', (data) => {
      const { message, username } = data;
      const messageWithUsername = { username: username || 'Anonymous', message };
      io.emit('message', messageWithUsername);
    });

    socket.on('clear', () => {
      drawnShapes = [];
      undoStack = [];
      redoStack = [];
      io.emit('clear');
    });

    socket.on('undo', () => {
      if (undoStack.length > 0) {
        const shape = undoStack.pop();
        redoStack.push(shape);
        drawnShapes = undoStack.slice(); // Reflect the change in drawnShapes

        // Broadcast the updated state to all clients
        io.emit('initDrawings', drawnShapes); // This ensures all clients get the same, updated state
      }
    });

    socket.on('redo', () => {
      if (redoStack.length > 0) {
        const shape = redoStack.pop();
        undoStack.push(shape);
        drawnShapes.push(shape);

        io.emit('draw', shape); // Send the redone shape to all clients
      }
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
