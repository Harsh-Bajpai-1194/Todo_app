const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const http = require('http');
const { Server } = require("socket.io");
const socketAuth = require('./socketAuth');

const app = express();
const server = http.createServer(app);

// Load Env Vars
require('dotenv').config({ path: './.env' });

// Init Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
}));

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

// Socket.io authentication middleware
io.use(socketAuth);

app.use(express.json());

app.get('/', (req, res) => res.json({ msg: 'Welcome to the Todo API...' }));

// Define Routes
app.use('/api/users', require('./users'));
app.use('/api/auth', require('./auth').router);
app.use('/api/todos', require('./todos'));

// Make io accessible to our router by setting it on the app
app.set('socketio', io);

// Handle socket connections
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id} (User ID: ${socket.user.id})`);
  // Join a room specific to the user ID. This ensures data privacy.
  socket.join(socket.user.id);

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    server.listen(PORT, () => console.log(`Server started on port ${PORT}\nAPI is running at http://localhost:${PORT}`));
  } catch (error) {
    console.error('Failed to start server due to database connection error:', error.message);
    process.exit(1);
  }
};

server.on('error', (error) => {
  if (error.syscall !== 'listen') {
    throw error;
  }

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EADDRINUSE':
      console.error(`Error: Port ${PORT} is already in use. Is another server instance running?`);
      process.exit(1);
      break;
    default:
      throw error;
  }
});

startServer();
