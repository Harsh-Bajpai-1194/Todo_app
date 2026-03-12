import { createContext, useState, useContext, useMemo } from "react";
import axios from 'axios';

export const TodoContext = createContext();

export const TodoProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [todos, setTodos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'completed', 'pending'

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

  const getTodos = async () => {
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
  };

  const addTodo = async (todo) => {
    try {
      setLoading(true);
      const res = await axios.post('/api/todos', todo);
      setError(null);
      // Append the new todo instead of prepending.
      // The backend assigns a high `order` value (Date.now()), so in an ascending sort,
      // new items should appear at the end. This keeps client state consistent with the database.
      setTodos((prev) => [...prev, res.data]);
    } catch (err) {
      setError(err.response?.data?.msg || 'Could not add todo.');
    } finally {
      setLoading(false);
    }
  };

  const deleteTodo = async (id) => {
    try {
      setLoading(true);
      await axios.delete(`/api/todos/${id}`);
      setError(null);
      setTodos((prev) => prev.filter((todo) => todo._id !== id));
    } catch (err) {
      setError(err.response?.data?.msg || 'Could not delete todo.');
    } finally {
      setLoading(false);
    }
  };

  const updateTodo = async (id, updatedFields) => {
    try {
      setLoading(true);
      const res = await axios.put(`/api/todos/${id}`, updatedFields);
      setError(null);
      // Note: MongoDB uses _id
      setTodos((prev) => prev.map((todo) => (todo._id === id ? res.data : todo)));
    } catch (err) {
      setError(err.response?.data?.msg || 'Could not update todo.');
    } finally {
      setLoading(false);
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
      setSearchTerm, setFilterStatus,
      clearError: () => setError(null)
    }}>
      {children}
    </TodoContext.Provider>
  );
};
