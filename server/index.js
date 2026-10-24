const express = require('express');
const http = require('http');
const cors = require('cors');//protects API calls
const helmet = require('helmet');//security headers
const { Server } = require('socket.io');//for chat function

const env = require('./config/env');

const app = express();
const httpServer = http.createServer(app);

// Allows real-time and rest to share a port for Socket.IO
const io = new Server(httpServer, {
  cors: { origin: env.clientUrl, methods: ['GET', 'POST'] },
});

// Middleware added
app.use(helmet());
app.use(cors({ origin: env.clientUrl }));
app.use(express.json());

//Route for testing
app.get('/api/statusCheck', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Just to check Socket.IO works
io.on('connection', (socket) => {
  console.log(`[socket] connected: ${socket.id}`);
  socket.on('disconnect', () => {
    console.log(`[socket] disconnected: ${socket.id}`);
  });
});

// Boot needed to allow Socket.IO
httpServer.listen(env.port, () => {
  console.log(`Server running on http://localhost:${env.port}`);
  console.log(`Environment: ${env.nodeEnv}`);
});