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

// 1. Consolidated CORS Setup
const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
app.use(cors({
  origin: clientUrl,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"]
}));

// 2. Fatal Error Check for Email Functionality
if (!process.env.EMAIL_USERNAME || !process.env.EMAIL_PASSWORD) {
  console.error('\x1b[31m%s\x1b[0m', 'FATAL ERROR: EMAIL_USERNAME and EMAIL_PASSWORD must be defined.');
  process.exit(1);
}

// 3. Essential Middleware (Must be before routes)
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// 4. Socket.io Configuration
const io = new Server(server, {
  cors: {
    origin: clientUrl,
    methods: ["GET", "POST"]
  }
});

io.use(socketAuth);
app.set('socketio', io);

// 5. Define Routes
app.get('/', (req, res) => res.json({ msg: 'Welcome to the Todo API...' }));
app.use('/api/users', require('./routes/users'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/todos', require('./routes/todos'));

// 6. Handle socket connections
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id} (User ID: ${socket.user.id})`);
  socket.join(socket.user.id);

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 5000;

// 7. Fixed Start Logic (Using 'server.listen' only)
const startServer = async () => {
  try {
    await connectDB();
    server.listen(PORT, '0.0.0.0', () => {
      console.log(`Server started on port ${PORT}`);
      console.log(`API is running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server due to database connection error:', error.message);
    process.exit(1);
  }
};

server.on('error', (error) => {
  if (error.syscall !== 'listen') throw error;
  switch (error.code) {
    case 'EADDRINUSE':
      console.error(`Error: Port ${PORT} is already in use.`);
      process.exit(1);
      break;
    default:
      throw error;
  }
});

if (require.main === module) {
  startServer();
}

module.exports = server;