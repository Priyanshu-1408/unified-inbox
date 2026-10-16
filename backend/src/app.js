import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import gmailRoutes from './modules/integrations/providers/gmail/gmail.routes.js';
import slackRoutes from './modules/integrations/providers/slack/slack.routes.js';

const app = express();
const server = createServer(app);

app.use(cors({ origin: process.env.CLIENT_ORIGIN ?? 'http://localhost:5173' }));
app.use(express.json());

app.use('/api/integrations/gmail', gmailRoutes);
app.use('/api/integrations/slack', slackRoutes);

const io = new Server(server, {
  cors: { origin: process.env.CLIENT_ORIGIN ?? 'http://localhost:5173' },
});

io.on('connection', () => {});

const port = Number(process.env.PORT) || 3000;

mongoose.connect(process.env.MONGODB_URI)
  .then(() => server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  }))
  .catch(err => {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
  });