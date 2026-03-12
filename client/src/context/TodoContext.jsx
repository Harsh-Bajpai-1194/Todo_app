import { createContext, useState, useContext, useMemo, useEffect, useRef, useCallback } from "react";
import axios from 'axios';
import { io } from 'socket.io-client';
import { AuthContext } from "./AuthContext";

export const TodoContext = createContext();

export const TodoProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [todos, setTodos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'completed', 'pending'
  const { token } = useContext(AuthContext);
  const socketRef = useRef(null);

  const getTodos = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/todos');
      setError(null);
      setTodos(res.data);
    } catch (err) {
      setError(err.response?.data?.msg || 'Could not fetch todos.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Effect for managing Socket.io connection
  useEffect(() => {
    if (token) {
      // Connect to the socket server only if we have a token
      const socket = io('http://localhost:5000', {
        auth: { token }
      });
      socketRef.current = socket;

      // Listen for real-time updates
      socket.on('todo:created', (newTodo) => {
        // Add the new todo, but check to prevent duplicates if this client initiated the action
        setTodos((prev) => prev.find(t => t._id === newTodo._id) ? prev : [...prev, newTodo]);
      });

      socket.on('todo:deleted', (deletedId) => {
        setTodos((prev) => prev.filter((todo) => todo._id !== deletedId));
      });

      socket.on('todo:updated', (updatedTodo) => {
        setTodos((prev) =>
          prev.map((todo) =>
            todo._id === updatedTodo._id ? updatedTodo : todo
          )
        );
      });

      // For reordering, the simplest approach is to refetch all todos
      // to ensure the order is correct across all clients.
      socket.on('todos:reordered', () => {
        getTodos();
      });

      // Clean up on unmount or token change
      return () => {
        socket.disconnect();
      };
    }
  }, [token, getTodos]); // Rerun effect if the token changes (login/logout)

  // Memoize the derived state to prevent re-computation on every render
  const filteredTodos = useMemo(() => {
    return todos
      .filter(todo => {
        if (filterStatus === 'completed') return todo.completed;
        if (filterStatus === 'pending') return !todo.completed;
        return true; // 'all'
      })
      .filter(todo => 
        todo.task.toLowerCase().includes(searchTerm.toLowerCase())
      );
  }, [todos, searchTerm, filterStatus]);

  const addTodo = async (todo) => {
    try {
      setLoading(true);
      // State is updated via socket event, no need to manually update here.
      await axios.post('/api/todos', todo);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.msg || 'Could not add todo.');
    } finally {
      setLoading(false);
    }
  };

  const deleteTodo = async (id) => {
    try {
      // State is updated via socket event.
      await axios.delete(`/api/todos/${id}`);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.msg || 'Could not delete todo.');
    } 
  };

  const updateTodo = async (id, updatedFields) => {
    try {
      // State is updated via socket event.
      await axios.put(`/api/todos/${id}`, updatedFields);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.msg || 'Could not update todo.');
    }
  };

  const onDragEnd = async (result) => {
    if (!result.destination) {
      return;
    }

    if (filterStatus !== 'all' || searchTerm !== '') {
      console.warn("Reordering is disabled when filters or search are active.");
      return;
    }

    const originalTodos = [...todos];
    // Reorder the `filteredTodos` array because its indices match the drag-and-drop result.
    // The guard clause above ensures that no items are missing from the filtered list during the operation.
    const items = Array.from(filteredTodos);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Optimistic UI update
    setTodos(items);

    try {
      const orderedIds = items.map(item => item._id);
      await axios.put('/api/todos/reorder', { orderedIds });
    } catch (err) {
      setError(err.response?.data?.msg || 'Could not reorder tasks.');
      setTodos(originalTodos); // Revert on error
    }
  };

  return (
    <TodoContext.Provider value={{ 
      todos, filteredTodos, loading, error,
      addTodo, getTodos, deleteTodo, updateTodo, onDragEnd,
      filterStatus, searchTerm,
      setFilterStatus, setSearchTerm,
      clearError: () => setError(null)
    }}>
      {children}
    </TodoContext.Provider>
  );
};
