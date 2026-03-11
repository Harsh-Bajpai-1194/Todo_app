import React, { useContext } from 'react';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { TodoProvider } from './context/TodoContext';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';
import AuthPage from './pages/AuthPage';

// This component will render the main UI, but only after authentication is loaded.
const MainApp = () => {
  const { loading, isAuthenticated, logout } = useContext(AuthContext);

  // While the AuthProvider is checking for a token, show a loading indicator.
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <AuthPage />;
  }

  // The TodoProvider is now wrapping this component from App.jsx
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 font-sans">
      <header className="bg-blue-600 text-white p-4 shadow-md flex justify-between items-center">
        <h1 className="text-xl font-bold">Todo App</h1>
        <button
          onClick={logout}
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
        >
          Logout
        </button>
      </header>
      <main className="p-4">
        <div className="container mx-auto max-w-2xl">
          <TodoForm />
          <TodoList />
        </div>
      </main>
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <TodoProvider>
        <MainApp />
      </TodoProvider>
    </AuthProvider>
  );
};

export default App;