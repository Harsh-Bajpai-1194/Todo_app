const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const db = process.env.MONGO_URI;
    if (!db) {
      throw new Error('MONGO_URI is not defined in .env file');
    }
    const conn = await mongoose.connect(db);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`Error: ${err.message}`);
    // Exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;