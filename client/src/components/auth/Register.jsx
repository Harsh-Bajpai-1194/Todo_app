import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';

const Register = () => {
  const { register, error, clearErrors } = useContext(AuthContext);
  const [user, setUser] = useState({ name: '', email: '', password: '', password2: '' });
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    if (error) {
      setAlert(error);
      clearErrors();
      setTimeout(() => setAlert(null), 5000); // Clear alert after 5 seconds
    }
  }, [error, clearErrors]);

  const { name, email, password, password2 } = user;

  const onChange = e => setUser({ ...user, [e.target.name]: e.target.value });

  const onSubmit = e => {
    e.preventDefault();
    if (password !== password2) {
      return setAlert('Passwords do not match');
    }
    register({ name, email, password });
  };

  return (
    <div className="w-full max-w-md">
      {alert && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">{alert}</div>}
      <form onSubmit={onSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">Name</label>
          <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="name" type="text" name="name" value={name} onChange={onChange} required />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">Email</label>
          <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="email" type="email" name="email" value={email} onChange={onChange} required />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">Password</label>
          <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="password" type="password" name="password" value={password} onChange={onChange} required minLength="6" />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password2">Confirm Password</label>
          <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="password2" type="password" name="password2" value={password2} onChange={onChange} required minLength="6" />
        </div>
        <div className="flex items-center justify-between">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full" type="submit">
            Register
          </button>
        </div>
      </form>
    </div>
  );
};

export default Register;