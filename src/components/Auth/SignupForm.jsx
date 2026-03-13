// src/components/Auth/SignupForm.jsx
import React, { useState } from 'react';
import MusicIcon from './ui/MusicIcon';

export function SignupForm({ onSignup }) {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSignup) onSignup({ name, username, email, password });
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="flex flex-col justify-center items-center gap-5  p-2 "
    >
      <MusicIcon />
      <h2 className="text-2xl font-bold text-center text-white mb-4">Create an account</h2>

      <input
        type="text"
        placeholder="Full Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        required
      />

      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        required
      />

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        required
      />

      <input
        type="password"
        placeholder=" Create Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        required
      />

       <button
        type="submit"
        className="w-full py-2 mt-2 rounded-lg bg-gradient-to-r from-purple-500 to-indigo-600 hover:scale-105 transition-all duration-200 font-semibold text-white shadow-lg"
      >
        Login
      </button>

      <p className="text-sm text-center text-gray-400 mt-2">
        Already have an account? <a href="#" className="text-blue-400 hover:underline">Login</a>
      </p>
    </form>
  );
}