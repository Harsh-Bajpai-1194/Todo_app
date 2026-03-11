const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');

const app = express();

// Load Env Vars
require('dotenv').config({ path: './.env' });

// Init Middleware
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.json({ msg: 'Welcome to the Todo API...' }));

// Define Routes
app.use('/api/users', require('./users'));
app.use('/api/auth', require('./auth').router);
app.use('/api/todos', require('./todos'));

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => console.log(`Server started on port ${PORT}\nAPI is running at http://localhost:${PORT}`));
  } catch (error) {
    console.error('Failed to start server due to database connection error.');
    process.exit(1);
  }
};

startServer();
