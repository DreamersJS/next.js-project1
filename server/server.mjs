import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';
import dotenv from 'dotenv';
import { initSocket } from './socket/socket.mjs';
import { securityHeaders } from './securityHeaders.mjs';
dotenv.config();

const port = parseInt(process.env.PORT, 10);
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
    const server = createServer((req, res) => {
        for (const [key, value] of Object.entries(securityHeaders)) {
            res.setHeader(key, value);
        }
        const parsedUrl = parse(req.url, true);
        handle(req, res, parsedUrl);
    });

    initSocket(server);

    server.listen(port, (err) => {
        if (err) throw err;
        console.log(`Ready on http://localhost:${port} [NODE_ENV=${process.env.NODE_ENV}]`);
    });
});