const mongoose = require('mongoose');

const TodoSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true
  },
  task: {
    type: String,
    required: true
  },
  time: {
    type: String // Based on your 'Enter time...' input
  },
  completed: {
    type: Boolean,
    default: false // Matches your current toggle logic
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('todo', TodoSchema);