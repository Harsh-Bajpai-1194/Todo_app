import React, { useContext, useEffect } from 'react';
import { TodoContext } from '../context/TodoContext';
import { AuthContext } from '../context/AuthContext';
import TodoItem from './TodoItem';

const TodoList = () => {
  const { filteredTodos, getTodos } = useContext(TodoContext);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    // Fetch todos when the component mounts if a token is present
    if (token) {
      getTodos();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  if (!filteredTodos || filteredTodos.length === 0) {
    return <div className="bg-white p-6 rounded-lg shadow-md text-center text-gray-500">No tasks found. Add one above!</div>;
  }

  return (
    <div className="space-y-2">
      {filteredTodos.map((todo) => (
        <TodoItem key={todo._id} todo={todo} />
      ))}
    </div>
  );
};

export default TodoList;