import { createContext, useState } from "react";

export const TodoContext = createContext();

export const TodoProvider = ({ children }) => {
  const [todos, setTodos] = useState([]);

  // Placeholder for fetching todos. 
  // In a full-stack integration, this would fetch from your API.
  const getTodos = () => {
    console.log("Fetching todos...");
  };

  const addTodo = (todo) => {
    // Adding a new todo with a unique ID and default completed state
    setTodos((prev) => [
      { id: Date.now(), task: todo.task, completed: false, ...todo }, 
      ...prev
    ]);
  };

  const deleteTodo = (id) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  const updateTodo = (id, updatedFields) => {
    setTodos((prev) => 
      prev.map((todo) => (todo.id === id ? { ...todo, ...updatedFields } : todo))
    );
  };

  return (
    <TodoContext.Provider value={{ todos, addTodo, getTodos, deleteTodo, updateTodo }}>
      {children}
    </TodoContext.Provider>
  );
};

// This allows 'import TodoContext' in other files
export default TodoContext;
