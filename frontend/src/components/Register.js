import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/register', { username, email, password });
      setMessage('User created');
      setError('');
    } catch (err) {
      setError('User already exists');
      setMessage('');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-200">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-black mb-6 text-center">Register</h2>
        {message && <p className="text-green-500 mb-4">{message}</p>}
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-gray-700 mb-2">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 rounded bg-gray-50 text-gray-700 border border-gray-300 focus:outline-none"
              placeholder="Your username"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 mb-2">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded bg-gray-50 text-gray-700 border border-gray-300 focus:outline-none"
              placeholder="admin@newuser.com"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700 mb-2">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded bg-gray-50 text-gray-700 border border-gray-300 focus:outline-none"
              placeholder="••••••••"
              required
            />
          </div>
          <button type="submit" className="w-full p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-700">
          <FontAwesomeIcon icon={faUserPlus} className="mr-2" />
          Register</button>
        </form>
        <div className="text-center mt-6 text-gray-400">
          Already have an account? <Link to="/login" className="text-indigo-500 hover:text-indigo-400">Login</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
