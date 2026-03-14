import React, { useEffect, useState } from 'react'
import { Blob } from './ui/Blob'
import { RoomHeader } from '../components/Music/Header'
import { ParticipantsList } from '../components/Music/ParticipantsList'
import { useRoom } from '../context/RoomContext'
import { MusicPlayer } from '../components/Music/MusicPlayer'
import { useAuth } from '../context/AuthContext'
import { Chats } from '../components/Chats/Chats'
import { useNavigate } from 'react-router-dom'
import websocket from '../services/websocket'

export const SyncMusicDashboard = () => {

  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(30);
  const [volume, setVolume] = useState(0.7);
  const [muted, setMuted] = useState(false);

  const navigate = useNavigate()

  const mockSong = {
    title: "Blinding Lights",
    artist: "The Weeknd",
    album: "After Hours",
    duration: 200,
    cover: "🎵"
  };

  const { participants, room, joinRoom, leaveRoom } = useRoom()
  const { user } = useAuth()

  const handleLeave = async () => {

    if (!room) return;

    try {

      const res = await leaveRoom(room.id);

      if (res) {

        localStorage.removeItem("room_code");
        websocket.disconnect();

        navigate("/join-room");

      }

    } catch (error) {

      console.error("Leave room failed", error);

    }

  };

  useEffect(() => {

    const roomCode = localStorage.getItem("room_code")

    if (roomCode && !room) {
      joinRoom(roomCode)
    }

  }, [room])

  return (

    <div className="relative min-h-screen bg-[#060610] text-[#e2e2f0] flex flex-col items-center px-4 md:px-8 py-10 gap-10">

      <Blob />

      {/* Header */}
      <RoomHeader room={room} onLeave={handleLeave} user={user} participants={participants} />

      
      <div className="
        w-full 
        max-w-7xl 
        grid 
        grid-cols-1 
        md:grid-cols-2 
        xl:grid-cols-3 
        gap-6
      ">

        <ParticipantsList participants={participants} />

        <MusicPlayer
          song={mockSong}
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
          progress={progress}
          setProgress={setProgress}
          volume={volume}
          setVolume={setVolume}
          muted={muted}
          setMuted={setMuted}
        />

        <Chats />

      </div>

    </div>
  )
}