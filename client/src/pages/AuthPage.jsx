import React, { useState } from 'react';
import Login from '../components/auth/Login';
import Register from '../components/auth/Register';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
      <div className="mb-4">
        <h1 className="text-3xl font-bold text-gray-800">Welcome to Todo App</h1>
        <p className="text-gray-600 text-center">Please sign in to continue</p>
      </div>
      {isLogin ? <Login /> : <Register />}
      <button
        onClick={() => setIsLogin(!isLogin)}
        className="mt-4 text-blue-500 hover:text-blue-700"
      >
        {isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
      </button>
    </div>
  );
};

export default AuthPage;