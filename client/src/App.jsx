import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { TodoProvider } from './context/TodoContext';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';
// We will create components for Login, Register, and Todos later
// For now, this structure sets up the context and basic layout.

const App = () => {
  console.log('App is rendering...');
  return (
    <AuthProvider>
      <TodoProvider>
        <div className="min-h-screen bg-gray-100 text-gray-900 font-sans">
          <header className="bg-blue-600 text-white p-4 shadow-md">
            <h1 className="text-xl font-bold">Todo App</h1>
          </header>
          <main className="p-4">
            <div className="container mx-auto max-w-2xl">
              <TodoForm />
              <TodoList />
            </div>
          </main>
        </div>
      </TodoProvider>
    </AuthProvider>
  );
};

export default App;