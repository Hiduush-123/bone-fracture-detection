import React, { useState } from 'react';
import axios from 'axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/forgot-password', { email });
      setMessage('Reset code sent to your email');
    } catch (err) {
      setMessage('Error sending reset code');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-200">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-black mb-6 text-center">Forgot Password</h2>
        {message && <p className="text-green-500 mb-4">{message}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 mb-2">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded bg-gray-50 text-gray-700 border border-gray-300 focus:outline-none"
              placeholder="Enter your email"
              required
            />
          </div>
          <button type="submit" className="w-full p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-700">Send Reset Code</button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
