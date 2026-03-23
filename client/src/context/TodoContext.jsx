import React, { createContext, useContext, useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { io } from 'socket.io-client';
import axios from '../api';
import { AuthContext } from './AuthContext';

export const TodoContext = createContext();

export const TodoProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [todos, setTodos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const { token } = useContext(AuthContext);
  const socketRef = useRef(null);

  // Refs for notification logic
  const todosRef = useRef(todos);
  const notifiedMinuteRef = useRef(-1);
  const notifiedTodosRef = useRef(new Set());

  const getTodos = useCallback(async () => {
    if (!token) return;
    try {
      setLoading(true);
      const res = await axios.get('/todos');
      setTodos(res.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.msg || 'Could not fetch todos.');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    getTodos();
  }, [getTodos]);

  // Keep the todosRef in sync with the todos state for the notification interval
  useEffect(() => {
    todosRef.current = todos;
  }, [todos]);

  // Effect for requesting notification permission on component mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // Effect for checking todos and sending notifications
  useEffect(() => {
    const checkTodosForNotification = () => {
      if (Notification.permission !== 'granted') {
        return;
      }

      const now = new Date();
      const currentMinute = now.getMinutes();

      // Reset the set of notified todos every new minute to avoid duplicate notifications for the same task
      if (currentMinute !== notifiedMinuteRef.current) {
        notifiedTodosRef.current.clear();
        notifiedMinuteRef.current = currentMinute;
      }

      const currentTime = now.toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
      });

      todosRef.current.forEach((todo) => {
        if (todo.time === currentTime && !todo.completed && !notifiedTodosRef.current.has(todo._id)) {
          new Notification('Todo App: Task Due!', {
            body: `Your task "${todo.task}" is due now.`,
            icon: '/vite.svg', // Ensure this icon is in your `public` folder
          });
          notifiedTodosRef.current.add(todo._id);
        }
      });
    };

    const intervalId = setInterval(checkTodosForNotification, 30000); // Check every 30 seconds

    // Cleanup on component unmount
    return () => clearInterval(intervalId);
  }, [getTodos]);

  useEffect(() => {
    if (token) {
      // This is the correct place for the socket connection logic.
      // It's a side-effect that runs when the `token` changes.

      // Use the Vite environment variable for the production URL,
      // otherwise, it will connect to the origin (which is correct for dev with proxy).
      const socket = io(import.meta.env.VITE_API_URL, {
        auth: { token }
      });
      socketRef.current = socket;

      socket.on('todo:created', (newTodo) => {
        setTodos((prevTodos) =>
          prevTodos.some((todo) => todo._id === newTodo._id)
            ? prevTodos
            : [...prevTodos, newTodo]
        );
      });

      socket.on('todo:deleted', (deletedTodoId) => {
        setTodos((prevTodos) =>
          prevTodos.filter((todo) => todo._id !== deletedTodoId)
        );
      });

      socket.on('todo:updated', (updatedTodo) => {
        setTodos((prevTodos) =>
          prevTodos.map((todo) =>
            todo._id === updatedTodo._id ? updatedTodo : todo
          )
        );
      });

      socket.on('todos:reordered', () => {
        getTodos();
      });

      // Cleanup on component unmount
      return () => {
        socket.disconnect();
      };
    }
  }, [token, getTodos]);

  const addTodo = async (todoData) => {
    try {
      // The UI might update optimistically via socket, but we still call the API.
      await axios.post('/todos', todoData);
    } catch (err) {
      setError(err.response?.data?.msg || 'Could not add todo.');
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`/todos/${id}`);
    } catch (err) {
      setError(err.response?.data?.msg || 'Could not delete todo.');
      // You might want to re-fetch or revert state here on failure.
    }
  };

  const updateTodo = async (id, updates) => {
    try {
      await axios.put(`/todos/${id}`, updates);
    } catch (err) {
      setError(err.response?.data?.msg || 'Could not update todo.');
    }
  };

  const onDragEnd = async (result) => {
    const { source, destination } = result;
    if (!destination) {
      return;
    }

    // This check is belt-and-suspenders, as the UI should disable drag-and-drop
    // when filtering is active.
    if (searchTerm || filterStatus !== 'all') {
      console.warn('Reordering is disabled when search or filters are active.');
      return;
    }

    const reorderedTodos = Array.from(todos);
    const [movedTodo] = reorderedTodos.splice(source.index, 1);
    reorderedTodos.splice(destination.index, 0, movedTodo);

    // Optimistically update UI. The socket event will trigger a refetch to ensure consistency.
    setTodos(reorderedTodos);

    try {
      const orderedIds = reorderedTodos.map((todo) => todo._id);
      await axios.put('/todos/reorder', { orderedIds });
    } catch (err) {
      setError(err.response?.data?.msg || 'Could not reorder tasks.');
      // Revert on failure by refetching from the server.
      getTodos();
    }
  };

  const filteredTodos = useMemo(() => {
    return todos
      .filter((todo) => {
        if (filterStatus === 'completed') return todo.completed;
        if (filterStatus === 'pending') return !todo.completed;
        return true;
      })
      .filter((todo) =>
        todo.task.toLowerCase().includes(searchTerm.toLowerCase())
      );
  }, [todos, searchTerm, filterStatus]);

  const clearError = () => setError(null);

  const value = {
    todos, filteredTodos, loading, error, addTodo, getTodos, deleteTodo, updateTodo, onDragEnd,
    filterStatus, searchTerm, setFilterStatus, setSearchTerm, clearError,
  };

  return (
    <TodoContext.Provider value={value}>
      {children}
    </TodoContext.Provider>
  );
};