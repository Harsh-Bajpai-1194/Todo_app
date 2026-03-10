const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Replace this with your MongoDB connection string if it's different.
    const db = process.env.MONGO_URI || 'mongodb://localhost:27017/todoapp';
    await mongoose.connect(db);

    console.log('MongoDB Connected...');
  } catch (err) {
    console.error(err.message);
    // Exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;