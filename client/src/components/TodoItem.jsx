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
        <div className="flex-1">
          <span className={`${todo.completed ? 'line-through' : ''}`}>
            {todo.task}
          </span>
          {todo.time && (
            <span className="ml-3 px-2 py-1 text-xs font-medium text-gray-600 bg-gray-200 rounded-full">
              {todo.time}
            </span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-3 ml-4 flex-shrink-0">
        <button
          onClick={() => deleteTodo(todo._id)}
          className="text-red-500 hover:text-red-700 font-semibold px-3 py-1"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default TodoItem;