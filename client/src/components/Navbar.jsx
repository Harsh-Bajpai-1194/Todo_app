import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useContext(AuthContext);

  const authLinks = (
    <>
      <li className="text-white">Hello, {user && user.name}</li>
      <li>
        <Link to="/dashboard" className="px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-blue-700">
          Dashboard
        </Link>
      </li>
      <li>
        <button onClick={logout} className="px-3 py-2 rounded-md text-sm font-medium text-white bg-red-500 hover:bg-red-600">
          Logout
        </button>
      </li>
    </>
  );

  const guestLinks = (
    <>
      <li><Link to="/register" className="px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-blue-700">Register</Link></li>
      <li><Link to="/login" className="px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-blue-700">Login</Link></li>
    </>
  );

  return (
    <nav className="bg-blue-600 shadow-md"><div className="container mx-auto px-4"><div className="flex items-center justify-between h-16">
          <Link to="/" className="text-xl font-bold text-white">Todo App</Link>
          <ul className="flex items-center gap-4">{isAuthenticated ? authLinks : guestLinks}</ul>
        </div></div></nav>
  );
};

export default Navbar;