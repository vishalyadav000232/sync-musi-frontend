// src/components/Auth/LoginForm.jsx
import { Music4 } from 'lucide-react';
import React, { useState } from 'react';
import { motion } from 'motion/react';
import MusicIcon from './ui/MusicIcon';

export default function LoginForm({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onLogin) onLogin({ email, password });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col justify-center items-center gap-5">

      <MusicIcon />
      <h2 className="text-center text-xl font-bold tracking-widest text-white mb-4">
        <span className="block">Welcome Back</span>
        <span className="block text-purple-400">to SyncMusic</span>
      </h2>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full px-4 py-2 rounded-lg bg-white/2 border backdrop-blur-3xl border-white/20  text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full px-4 py-2 rounded-lg bg-white/2 border backdrop-blur-3xl border-white/20  text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />

      <button
        type="submit"
        className="w-full py-2 mt-2 rounded-lg bg-gradient-to-r from-purple-500 to-indigo-600 hover:scale-105 transition-all duration-200 font-semibold text-white shadow-lg"
      >
        Login
      </button>

      <p className="text-sm text-center text-gray-400 mt-2">
        Forgot your password? <a href="#" className="text-blue-400 hover:underline">Reset</a>
      </p>
    </form>
  );
}