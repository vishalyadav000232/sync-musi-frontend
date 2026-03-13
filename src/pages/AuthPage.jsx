
import React, { useEffect, useState } from 'react';
import LoginForm from '../components/Auth/LoginForm';
import { SignupForm } from '../components/Auth/SignupForm';

import { useNavigate } from 'react-router-dom';
import { Blob } from './ui/Blob';
import { useAuth } from '../context/AuthContext';



export const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate()
  const {loading , login  , signup} = useAuth()

  useEffect(()=>{
    navigate(isLogin?"/login":"/signup")
  },[isLogin])

  const handleLogin = async (data) => {
    try {
      const res = await login(data);

      console.log(res.data);

      navigate("/join-room")



    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
    }
  };
  const handleSignup = async (data) => {
    try {
      const res = await signup(data);

      console.log(res);

      if (res) {
        await handleLogin({
          email: data.email,
          password: data.password
        });
      }

    } catch (error) {
      console.error(
        "Signup failed:",
        error.response?.data || error.message
      );
    }
  };
  return (
    <div className="relative min-h-screen overflow-hidden font-sans bg-[#060610] text-[#e2e2f0] flex items-center justify-center">


      <Blob />


      <div className="relative z-10 w-[400px] p-8 rounded-2xl
                  bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4">


        <div className="flex justify-around mb-6">
          <button
            className={`px-4 py-2 font-semibold transition-all duration-300
                    ${isLogin ? 'border-b-2 border-blue-500 text-white' : 'border-b-2 border-transparent text-gray-300'}`}
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>
          <button
            className={`px-4 py-2 font-semibold transition-all duration-300
                    ${!isLogin ? 'border-b-2 border-blue-500 text-white' : 'border-b-2 border-transparent text-gray-300'}`}
            onClick={() => setIsLogin(false)}
          >
            Signup
          </button>
        </div>

        {/* Forms */}
        {isLogin ? (
          <LoginForm onLogin={handleLogin} />
        ) : (
          <SignupForm onSignup={handleSignup} />
        )}
      </div>
    </div>
  );
};