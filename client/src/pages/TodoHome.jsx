import React from 'react';
import TodoForm from '../components/TodoForm';
import TodoFilter from '../components/TodoFilter';
import TodoList from '../components/TodoList';

const TodoHome = () => (
  <>
    <TodoForm />
    <TodoFilter />
    <TodoList />
  </>
);

export default TodoHome;