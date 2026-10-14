import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { createServer } from 'node:http';
import { Server } from 'socket.io';

const app = express();
const server = createServer(app);

app.use(cors({ origin: process.env.CLIENT_ORIGIN ?? 'http://localhost:5173' }));
app.use(express.json());

const io = new Server(server, {
  cors: { origin: process.env.CLIENT_ORIGIN ?? 'http://localhost:5173' },
});

io.on('connection', () => {
  // Register feature socket handlers here as they are added.
});

const port = Number(process.env.PORT) || 3000;
server.listen(port, () => {
  console.log(`Unified Inbox server listening on port ${port}`);
});
