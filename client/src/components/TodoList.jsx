import React, { useContext, useEffect } from 'react';
import TodoItem from './TodoItem';
import TodoContext from '../context/TodoContext';

const TodoList = () => {
  const todoContext = useContext(TodoContext);
  const { todos, getTodos, loading } = todoContext;

  useEffect(() => {
    getTodos();
    // eslint-disable-next-line
  }, []);

  if (todos.length === 0 && !loading) {
    return <h4 className="text-center text-gray-500 mt-4">No todos to show. Add one above!</h4>;
  }

  return (
    <div className="mt-4">
      {todos.map(todo => (
        <TodoItem key={todo._id} todo={todo} />
      ))}
    </div>
  );
};

export default TodoList;