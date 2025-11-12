import { createServer } from 'http';
import dotenv from 'dotenv';
import { initSocket } from './socket/socket.mjs';
import { securityHeaders } from './securityHeaders.mjs';

dotenv.config();

const port = process.env.PORT || 3001;

const server = createServer((req, res) => {
    for (const [key, value] of Object.entries()) {
        res.setHeader(key, value);
    }

    res.setHeader('Access-Control-Allow-Origin', process.env.CLIENT_ORIGIN);
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.url === '/health' && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('Backend is running.');
    } else {
        res.writeHead(404);
        res.end('Not found.');
    }
});

initSocket(server);

server.listen(port, (err) => {
    if (err) throw err;
    console.log(`Ready on http://localhost:${port}`);
});