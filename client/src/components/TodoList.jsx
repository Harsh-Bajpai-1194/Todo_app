import React, { useContext, useEffect } from 'react';
import { TodoContext } from '../context/TodoContext';

const TodoList = () => {
  const { todos, getTodos, deleteTodo, updateTodo } = useContext(TodoContext);

  useEffect(() => {
    getTodos();
  }, []);

  if (!todos || todos.length === 0) {
    return <div className="text-center text-gray-500 mt-8">No tasks yet. Add one above!</div>;
  }

  return (
    <div className="mt-6 space-y-3">
      {todos.map((todo) => (
        <div key={todo.id} className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => updateTodo(todo.id, { completed: !todo.completed })}
              className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
            />
            <span className={`text-lg ${todo.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>
              {todo.task}
            </span>
          </div>
          <button
            onClick={() => deleteTodo(todo.id)}
            className="text-red-500 hover:text-red-700 font-medium text-sm px-3 py-1 rounded hover:bg-red-50 transition-colors"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
};

export default TodoList;
