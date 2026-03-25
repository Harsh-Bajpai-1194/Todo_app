const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const cors = require('cors');
const connectDB = require('./config/db');
const socketAuth = require('./socketAuth');

// Initialize App and HTTP Server
const app = express();
const server = http.createServer(app);

// Load Environment Variables
require('dotenv').config({ path: './.env' });

// 1. Consolidated CORS Setup
// In production, Render needs to know where your Vercel frontend is.
const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
app.use(cors({
  origin: clientUrl,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"]
}));

// 2. Fatal Error Check for Email (Required for your OTP logic)
if (!process.env.EMAIL_USERNAME || !process.env.EMAIL_PASSWORD) {
  console.error('\x1b[31m%s\x1b[0m', 'FATAL ERROR: EMAIL_USERNAME and EMAIL_PASSWORD are not defined.');
  process.exit(1);
}

// 3. Standard Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// 4. Socket.io Configuration (Sharing the same HTTP server)
const io = new Server(server, {
  cors: {
    origin: clientUrl,
    methods: ["GET", "POST"]
  }
});

io.use(socketAuth);
app.set('socketio', io);

// 5. Routes
app.get('/', (req, res) => res.json({ status: "API is working", timestamp: new Date() }));
app.use('/api/users', require('./routes/users'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/todos', require('./routes/todos'));

// 6. Socket logic
io.on('connection', (socket) => {
  console.log(`Connected: ${socket.id} (User: ${socket.user.id})`);
  socket.join(socket.user.id);
  socket.on('disconnect', () => console.log(`Disconnected: ${socket.id}`));
});

// 7. Dynamic Port Binding for Render
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    // CRITICAL: Bind to 0.0.0.0 so Render can route traffic to it
    server.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Database connection failed:', error.message);
    process.exit(1);
  }
};

if (require.main === module) {
  startServer();
}

module.exports = server;