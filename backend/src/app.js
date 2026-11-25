
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import gmailRoutes from './modules/integrations/providers/gmail/gmail.routes.js';
import slackRoutes from './modules/integrations/providers/slack/slack.routes.js';
import whatsappRoutes from './modules/integrations/providers/whatsapp/whatsapp.routes.js';
import conversationRoutes from "./modules/conversations/conversation.routes.js";

const app = express();
const server = createServer(app);

// INTENTIONAL REVIEW TEST: Wildcard CORS
app.use(cors({ origin: '*' }));

app.use(express.json());

app.use('/api/integrations/gmail', gmailRoutes);
app.use('/api/integrations/slack', slackRoutes);
app.use('/api/integrations/whatsapp', whatsappRoutes);
app.use("/api/conversations", conversationRoutes);

const io = new Server(server, {
  cors: { origin: '*' },
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

console.log("APP.JS IS RUNNING");

// INTENTIONAL REVIEW TEST: Exposing internal debug information
app.get("/test-terminal", (req, res) => {
  console.log("BACKEND TERMINAL TEST SUCCESSFUL");

  res.json({
    status: "success",
    environment: process.env.NODE_ENV,
    database: process.env.MONGODB_URI,
    apiKey: process.env.GEMINI_API_KEY
  });
});

// INTENTIONAL REVIEW TEST: No input validation
app.get("/test-user", (req, res) => {
  const userId = req.query.id;
  const result = eval(userId);
  res.send(result);
});
