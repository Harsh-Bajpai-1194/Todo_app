import React, { useContext } from 'react';
import { TodoContext } from '../context/TodoContext';

const TodoItem = ({ todo }) => {
  const { deleteTodo, updateTodo } = useContext(TodoContext);

  const handleToggleComplete = () => {
    updateTodo(todo._id, { completed: !todo.completed });
  };

  return (
    <div className={`flex items-center justify-between p-4 mb-2 rounded-lg shadow-sm ${todo.completed ? 'bg-green-100 text-gray-500' : 'bg-white'}`}>
      <div className="flex items-center gap-4 flex-1">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={handleToggleComplete}
          className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
        />
        <span className={`flex-1 ${todo.completed ? 'line-through' : ''}`}>
          {todo.task}
        </span>
      </div>
      <button
        onClick={() => deleteTodo(todo._id)}
        className="text-red-500 hover:text-red-700 font-semibold px-3 py-1"
      >
        Delete
      </button>
    </div>
  );
};

export default TodoItem;