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

// 1. Consolidated CORS (Use CLIENT_URL env var)
const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
app.use(cors({
  origin: clientUrl,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"]
}));

// 2. Fatal Error Check for OTP Functionality
if (!process.env.EMAIL_USERNAME || !process.env.EMAIL_PASSWORD) {
  console.error('FATAL ERROR: EMAIL_USERNAME and EMAIL_PASSWORD must be defined.');
  process.exit(1);
}

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const io = new Server(server, {
  cors: {
    origin: clientUrl,
    methods: ["GET", "POST"]
  }
});

io.use(socketAuth);
app.set('socketio', io);

// ... (Routes and socket logic remain the same)

const PORT = process.env.PORT || 5000;

// 3. FIXED: Single entry point using 'server'
const startServer = async () => {
  try {
    await connectDB();
    // Render needs '0.0.0.0' to bind correctly
    server.listen(PORT, '0.0.0.0', () => {
      console.log(`Server started on port ${PORT}`);
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