import React, { createContext, useReducer } from 'react';
import axios from 'axios';

const TodoContext = createContext();

const todoReducer = (state, action) => {
  switch (action.type) {
    case 'GET_TODOS':
      return {
        ...state,
        todos: action.payload,
        loading: false
      };
    case 'ADD_TODO':
      return {
        ...state,
        todos: [action.payload, ...state.todos],
        loading: false
      };
    case 'DELETE_TODO':
      return {
        ...state,
        todos: state.todos.filter(todo => todo._id !== action.payload),
        loading: false
      };
    case 'UPDATE_TODO':
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo._id === action.payload._id ? action.payload : todo
        ),
        loading: false
      };
    case 'SET_CURRENT':
      return {
        ...state,
        current: action.payload
      };
    case 'CLEAR_CURRENT':
      return {
        ...state,
        current: null
      };
    case 'TODO_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    default:
      return state;
  }
};

export const TodoProvider = ({ children }) => {
  const initialState = {
    todos: [],
    current: null,
    loading: true,
    error: null
  };

  const [state, dispatch] = useReducer(todoReducer, initialState);

  // Get Todos
  const getTodos = async () => {
    try {
      const res = await axios.get('/api/todos');
      dispatch({ type: 'GET_TODOS', payload: res.data });
    } catch (err) {
      dispatch({ type: 'TODO_ERROR', payload: err.response.data.msg });
    }
  };

  // Add Todo
  const addTodo = async todo => {
    const config = { headers: { 'Content-Type': 'application/json' } };
    try {
      const res = await axios.post('/api/todos', todo, config);
      dispatch({ type: 'ADD_TODO', payload: res.data });
    } catch (err) {
      dispatch({ type: 'TODO_ERROR', payload: err.response.data.msg });
    }
  };

  // Delete Todo
  const deleteTodo = async id => {
    try {
      await axios.delete(`/api/todos/${id}`);
      dispatch({ type: 'DELETE_TODO', payload: id });
    } catch (err) {
      dispatch({ type: 'TODO_ERROR', payload: err.response.data.msg });
    }
  };

  // Update Todo
  const updateTodo = async todo => {
    const config = { headers: { 'Content-Type': 'application/json' } };
    try {
      const res = await axios.put(`/api/todos/${todo._id}`, todo, config);
      dispatch({ type: 'UPDATE_TODO', payload: res.data });
    } catch (err) {
      dispatch({ type: 'TODO_ERROR', payload: err.response.data.msg });
    }
  };

  // Set/Clear Current Todo
  const setCurrent = todo => dispatch({ type: 'SET_CURRENT', payload: todo });
  const clearCurrent = () => dispatch({ type: 'CLEAR_CURRENT' });

  return (
    <TodoContext.Provider
      value={{
        todos: state.todos,
        current: state.current,
        loading: state.loading,
        error: state.error,
        getTodos,
        addTodo,
        deleteTodo,
        updateTodo,
        setCurrent,
        clearCurrent
      }}
    >
      {children}
    </TodoContext.Provider>
  );
};

export default TodoContext;
