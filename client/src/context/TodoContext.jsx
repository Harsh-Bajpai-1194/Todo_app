import { createContext, useState, useContext } from "react";
import axios from 'axios';
// Assuming AuthContext provides the auth token
// import { AuthContext } from './AuthContext'; 

export const TodoContext = createContext();

export const TodoProvider = ({ children }) => {
  const [todos, setTodos] = useState([]);
  // const { token } = useContext(AuthContext); // Example of getting token

  // In a full-stack integration, this would fetch from your API.
  const getTodos = async () => {
    try {
      // const res = await axios.get('/api/todos', { headers: { 'x-auth-token': token } });
      // setTodos(res.data);
      console.log("Fetching todos from API...");
    } catch (err) {
      console.error(err);
    }
  };

  const addTodo = async (todo) => {
    try {
      // const res = await axios.post('/api/todos', todo, { headers: { 'x-auth-token': token } });
      // setTodos((prev) => [res.data, ...prev]);
      console.log("Adding todo via API...");
      // For now, simulate with local state
      setTodos((prev) => [{ id: Date.now(), ...todo }, ...prev]);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteTodo = async (id) => {
    try {
      // await axios.delete(`/api/todos/${id}`, { headers: { 'x-auth-token': token } });
      setTodos((prev) => prev.filter((todo) => todo.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const updateTodo = async (id, updatedFields) => {
    try {
      // const res = await axios.put(`/api/todos/${id}`, updatedFields, { headers: { 'x-auth-token': token } });
      setTodos((prev) => prev.map((todo) => (todo.id === id ? { ...todo, ...updatedFields } : todo)));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <TodoContext.Provider value={{ todos, addTodo, getTodos, deleteTodo, updateTodo }}>
      {children}
    </TodoContext.Provider>
  );
};

// This allows 'import TodoContext' in other files
export default TodoContext;
