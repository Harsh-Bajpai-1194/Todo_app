import { createContext, useState, useContext, useMemo, useEffect, useRef, useCallback } from "react";
import { io } from 'socket.io-client';
import api from "../api";
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
  const todosRef = useRef(todos);
  const lastCheckedMinuteRef = useRef(-1);
  const notifiedTasksRef = useRef(new Set());

  const getTodos = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get('/todos');
      setError(null);
      setTodos(res.data);
    } catch (err) {
      setError(err.response?.data?.msg || 'Could not fetch todos.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Keep the todosRef updated with the latest todos
  useEffect(() => {
    todosRef.current = todos;
  }, [todos]);

  // Effect for managing Socket.io connection
  useEffect(() => {
    if (token) {
      // Connect to the socket server only if we have a token
      // Connect to the origin. The request will be proxied by the Vite dev server.
      const socket = io({
        auth: { token }
      });
      socketRef.current = socket;

      // Listen for real-time updates
      socket.on('todo:created', (newTodo) => {
        // Add the new todo, but only if it doesn't already exist in the state.
        // This prevents duplicates on the client that initiated the action,
        // as that client adds the todo via the HTTP response.
        setTodos((prev) => {
          const exists = prev.some(t => t._id === newTodo._id);
          return exists ? prev : [...prev, newTodo];
        });
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

  // Effect for requesting notification permission on load
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  // Effect for checking for due tasks and sending notifications
  useEffect(() => {
    const time12to24 = (time12h) => {
      // Return early if the format is unexpected (e.g., already 24h or null)
      if (!time12h || typeof time12h !== 'string' || !time12h.includes(' ')) {
        return time12h;
      }
      const match = time12h.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
      if (!match) return time12h;

      let [, hours, minutes, modifier] = match;
      hours = parseInt(hours, 10);

      if (modifier.toUpperCase() === 'PM' && hours < 12) {
        hours += 12;
      }
      if (modifier.toUpperCase() === 'AM' && hours === 12) {
        hours = 0; // Midnight case
      }
      return `${hours.toString().padStart(2, '0')}:${minutes}`;
    };

    const checkDueTasks = () => {
      if (Notification.permission !== "granted") return;

      const now = new Date();
      const currentMinute = now.getMinutes();

      // Reset the set of notified tasks every new minute to prevent spam
      if (currentMinute !== lastCheckedMinuteRef.current) {
        notifiedTasksRef.current.clear();
        lastCheckedMinuteRef.current = currentMinute;
      }

      const currentTime = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

      // Use the ref to access the latest todos without re-running the effect
      todosRef.current.forEach(todo => {
        const todoTime24 = time12to24(todo.time);
        if (todoTime24 === currentTime && !todo.completed && !notifiedTasksRef.current.has(todo._id)) {
          new Notification('Todo App: Task Due!', {
            body: `Your task "${todo.task}" is due now.`,
            icon: '/vite.svg' // Using the default Vite logo from the public folder
          });
          notifiedTasksRef.current.add(todo._id); // Mark as notified for this minute
        }
      });
    };

    const intervalId = setInterval(checkDueTasks, 30000); // Check every 30 seconds
    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []); // Empty dependency array ensures this runs only once

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

  const addTodo = async (todoData) => {
    try {
      setLoading(true);
      // Get the full todo object back from the API response.
      const res = await api.post('/todos', todoData);
      // Update state immediately with the response. This is more reliable
      // than waiting for the socket event and ensures the notification
      // checker has the most up-to-date data instantly.
      setTodos(prev => [...prev, res.data]);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.msg || 'Could not add todo.');
    } finally {
      setLoading(false);
    }
  };

  const deleteTodo = async (id) => {
    const originalTodos = [...todos];
    // Optimistic UI Update: Remove the todo from the UI immediately.
    setTodos(prev => prev.filter(todo => todo._id !== id));

    try {
      // The socket event will update other clients.
      await api.delete(`/todos/${id}`);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.msg || 'Could not delete todo.');
      // If the API call fails, revert the UI to its original state.
      setTodos(originalTodos);
    } 
  };

  const updateTodo = async (id, updatedFields) => {
    const originalTodos = [...todos];
    // Optimistic UI Update: Apply changes immediately.
    setTodos(prev =>
      prev.map(todo =>
        todo._id === id ? { ...todo, ...updatedFields } : todo
      )
    );

    try {
      // The socket event will update other clients.
      await api.put(`/todos/${id}`, updatedFields);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.msg || 'Could not update todo.');
      // If the API call fails, revert the UI to its original state.
      setTodos(originalTodos);
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
      await api.put('/todos/reorder', { orderedIds });
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
