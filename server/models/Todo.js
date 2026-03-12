const mongoose = require('mongoose');

const TodoSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  task: {
    type: String,
    required: true,
  },
  time: {
    type: String, // Or Date, depending on desired format
  },
  completed: {
    type: Boolean,
    default: false,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  order: {
    type: Number,
    // Default to 0 for existing tasks that don't have an order.
    default: 0,
  },
});

module.exports = mongoose.model('todo', TodoSchema);