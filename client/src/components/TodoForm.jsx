import React, { useState, useContext } from 'react';
import { TodoContext } from '../context/TodoContext';

const TodoForm = () => {
  const [task, setTask] = useState('');
  const [time, setTime] = useState('');
  const { addTodo } = useContext(TodoContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!task.trim()) return;
    
    // Send undefined if time is empty so it's not stored in the DB
    addTodo({ task, time: time || undefined });
    setTask('');
    setTime('');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-6">
      <div className="flex gap-3">
        <input
          type="text"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="What needs to be done?"
          className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-sm"
        >
          Add
        </button>
      </div>
    </form>
  );
};

export default TodoForm;
