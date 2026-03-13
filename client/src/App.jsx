import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { TodoProvider } from './context/TodoContext';
import Navbar from './components/Navbar';
import PrivateRoute from './routing/PrivateRoute';

// Lazy load page components
const TodoHome = lazy(() => import('./pages/TodoHome'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));

// A simple loading fallback component
const PageLoader = () => (
  <div className="text-center p-8">
    <p className="text-gray-500">Loading...</p>
  </div>
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
                <Suspense fallback={<PageLoader />}>
                  <Routes>
                    <Route path="/" element={<PrivateRoute><TodoHome /></PrivateRoute>} />
                    <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                  </Routes>
                </Suspense>
              </div>
            </main>
          </div>
        </Router>
      </TodoProvider>
    </AuthProvider>
  );
};

export default App;