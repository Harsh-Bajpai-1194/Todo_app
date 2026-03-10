import React, { useState, useContext, useEffect } from 'react';
import TodoContext from '../context/TodoContext';

const TodoForm = () => {
  const todoContext = useContext(TodoContext);
  const { addTodo, updateTodo, current, clearCurrent } = todoContext;

  const [todo, setTodo] = useState({
    task: '',
    time: ''
  });

  const { task, time } = todo;

  useEffect(() => {
    if (current !== null) {
      setTodo(current);
    } else {
      setTodo({
        task: '',
        time: ''
      });
    }
  }, [current]);

  const onChange = e => setTodo({ ...todo, [e.target.name]: e.target.value });

  const onSubmit = e => {
    e.preventDefault();
    if (current === null) {
      addTodo(todo);
    } else {
      updateTodo(todo);
      clearCurrent();
    }
    setTodo({
      task: '',
      time: ''
    });
  };

  const clearAll = () => {
    clearCurrent();
  };

  return (
    <form onSubmit={onSubmit} className="mb-6 bg-white p-4 rounded shadow-md">
      <h2 className="text-xl font-bold mb-4 text-gray-700">
        {current ? 'Edit Todo' : 'Add Todo'}
      </h2>
      <input
        type="text"
        placeholder="Task Description"
        name="task"
        value={task}
        onChange={onChange}
        className="border p-2 w-full mb-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />
      <input
        type="text"
        placeholder="Time (e.g., 2pm)"
        name="time"
        value={time}
        onChange={onChange}
        className="border p-2 w-full mb-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <div className="flex gap-2">
        <input
          type="submit"
          value={current ? 'Update Todo' : 'Add Todo'}
          className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-700 transition"
        />
        {current && (
          <button
            className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition"
            onClick={clearAll}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default TodoForm;