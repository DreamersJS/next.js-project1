// server.mjs
import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';
import { Server as socketIo } from 'socket.io';

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

  io.on('connection', (socket) => {
    console.log('New client connected');
  
    // Send all previously drawn shapes to the new client
    socket.emit('initDrawings', drawnShapes);
  
    socket.on('draw', (data) => {
      // Save the new shape
      drawnShapes.push(data);
      
      // Broadcast the drawing event to all clients, including the sender
      io.emit('draw', data);
    });
  
    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });

  server.listen(3000, (err) => {
    if (err) throw err;
    console.log('Ready on http://localhost:3000');
  });
});
