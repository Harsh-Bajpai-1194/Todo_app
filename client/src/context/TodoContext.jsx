import { createContext, useState, useContext, useEffect } from "react";
import axios from 'axios';
import { AuthContext } from './AuthContext'; 

export const TodoContext = createContext();

export const TodoProvider = ({ children }) => {
  const [todos, setTodos] = useState([]);
  const { isAuthenticated } = useContext(AuthContext);

  // Fetch todos when the user is authenticated, and clear them on logout.
  useEffect(() => {
    if (isAuthenticated) {
      getTodos();
    } else {
      setTodos([]);
    }
  }, [isAuthenticated]);

  const getTodos = async () => {
    try {
      const res = await axios.get('/api/todos');
      setTodos(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const addTodo = async (todo) => {
    try {
      const res = await axios.post('/api/todos', todo);
      setTodos((prev) => [res.data, ...prev]);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`/api/todos/${id}`);
      setTodos((prev) => prev.filter((todo) => todo._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const updateTodo = async (id, updatedFields) => {
    try {
      const res = await axios.put(`/api/todos/${id}`, updatedFields);
      setTodos((prev) => prev.map((todo) => (todo._id === id ? res.data : todo)));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <TodoContext.Provider value={{ todos, addTodo, deleteTodo, updateTodo }}>
      {children}
    </TodoContext.Provider>
  );
};
