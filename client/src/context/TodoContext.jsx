import { createContext, useState, useContext, useMemo } from "react";
import axios from 'axios';

export const TodoContext = createContext();

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export const TodoProvider = ({ children }) => {
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
      const res = await axios.get(`${API_BASE_URL}/api/todos`);
      setTodos(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const addTodo = async (todo) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/api/todos`, todo);
      setTodos((prev) => [res.data, ...prev]);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/todos/${id}`);
      setTodos((prev) => prev.filter((todo) => todo._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const updateTodo = async (id, updatedFields) => {
    try {
      const res = await axios.put(`${API_BASE_URL}/api/todos/${id}`, updatedFields);
      // Note: MongoDB uses _id
      setTodos((prev) => prev.map((todo) => (todo._id === id ? res.data : todo)));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <TodoContext.Provider value={{ 
      todos, filteredTodos, 
      addTodo, getTodos, deleteTodo, updateTodo,
      setSearchTerm, setFilterStatus
    }}>
      {children}
    </TodoContext.Provider>
  );
};
