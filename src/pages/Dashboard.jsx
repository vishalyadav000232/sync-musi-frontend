import React, { useEffect, useState } from 'react'
import { Blob } from './ui/Blob'
import { JoinRoom } from '../components/Rooms/JoinRoom'
import { CreateRoom } from '../components/Rooms/CreateRoom'
import { useNavigate } from 'react-router-dom'

export const Dashboard = () => {
  const [isJoin, setJoin] = useState(true)
  const navigate = useNavigate()
  useEffect(() => {
    navigate(isJoin ? "/join-room" : "/create-room");
  }, [isJoin, navigate]);
  return (
    <div className=' relative min-h-screen overflow-hidden font-sans bg-[#060610] text-[#e2e2f0] flex items-center justify-center'>
      <Blob />
      <div className="relative z-10 w-[400px] p-8 rounded-2xl
                  bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4">
        <div className="flex justify-around mb-6">
          <button
            className={`px-4 py-2 font-semibold transition-all duration-300
                    ${isJoin ? 'border-b-2 border-blue-500 text-white' : 'border-b-2 border-transparent text-gray-300'}`}
            onClick={() => setJoin(true)}
          >
            Join Room
          </button>
          <button
            className={`px-4 py-2 font-semibold transition-all duration-300
                    ${!isJoin ? 'border-b-2 border-blue-500 text-white' : 'border-b-2 border-transparent text-gray-300'}`}
            onClick={() => setJoin(false)}
          >
            Create Room
          </button>
        </div>

        {isJoin ? (
          <JoinRoom />

        ) :
          (
            <CreateRoom />
          )}

      </div>
    </div>
  )
}
