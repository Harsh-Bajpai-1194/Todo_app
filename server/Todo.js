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
  order: {
    type: Number,
    default: 0,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('todo', TodoSchema);