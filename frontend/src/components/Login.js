import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faSignInAlt } from '@fortawesome/free-solid-svg-icons';

const Login = () => {
  const [username, setUsername] = useState('');
  // const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', { username, password });
      localStorage.setItem('token', response.data.token);
      if (rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      } else {
        localStorage.removeItem('rememberMe');
      }
      navigate('/dashboard/home');
    } catch (error) {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-200">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md my-15">
        <h2 className="text-2xl font-bold text-black mb-6 text-center">Login</h2>
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
         
          <div className="mb-4 relative">
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
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400">
              {/* Eye icon can be added here for password visibility toggle */}
            </div>
          </div>
          <div className="flex items-center justify-between mb-6">
            <label className="flex items-center text-gray-300">
              <input
                type="checkbox"
                className="form-checkbox text-indigo-500 bg-gray-700 border-gray-600"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span className="ml-2">Remember Me</span>
            </label>
            <Link to="/forgot-password" className="text-indigo-500 hover:text-indigo-400">Forgot Password?</Link>
          </div>
          <button type="submit" className="w-full p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-700 text-md">
          <FontAwesomeIcon icon={faSignInAlt} className="mr-2" />
          Login</button>
        </form>
        <div className="text-center mt-6 text-gray-400">
          New on our platform? <Link to="/register" className="text-indigo-500 hover:text-indigo-400">Create an account</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
