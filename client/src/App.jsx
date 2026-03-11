import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { TodoProvider } from './context/TodoContext';
import Navbar from './components/Navbar';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';
import TodoFilter from './components/TodoFilter';
import Login from './pages/Login';
import Register from './pages/Register';
import PrivateRoute from './routing/PrivateRoute';

const TodoHome = () => (
  <>
    <TodoForm />
    <TodoFilter />
    <TodoList />
  </>
);

const App = () => {
  return (
    <AuthProvider>
      <TodoProvider>
        <Router>
          <div className="min-h-screen bg-gray-100 text-gray-900 font-sans">
            <Navbar />
            <main className="p-4">
              <div className="container mx-auto max-w-2xl">
                <Routes>
                  <Route path="/" element={<PrivateRoute><TodoHome /></PrivateRoute>} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                </Routes>
              </div>
            </main>
          </div>
        </Router>
      </TodoProvider>
    </AuthProvider>
  );
};

export default App;