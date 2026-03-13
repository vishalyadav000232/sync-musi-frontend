import React, { useEffect } from 'react'
import { Blob } from './ui/Blob'
import { RoomHeader } from '../components/Music/Header'
import { ParticipantsList } from '../components/Music/ParticipantsList'
import { useRoom } from '../context/RoomContext'
import { MusicPlayer } from '../components/Music/MusicPlayer'

export const SyncMusicDashboard = () => {

  const { participants, room, joinRoom } = useRoom()

  useEffect(() => {
    const roomCode = localStorage.getItem("room_code")

    if (roomCode && !room) {
      joinRoom(roomCode)
    }
  }, [])

 

  return (
    <div className='relative min-h-screen overflow-hidden font-sans bg-[#060610] text-[#e2e2f0] flex flex-col p-10 items-center gap-6'>

      <Blob/>

      {/* header */}
      <RoomHeader roomName={room?.name} />

      <div className='grid grid-cols-3 gap-3'>
        <ParticipantsList participants={participants} />
        {/* <MusicPlayer /> */}
      </div>
      

    </div>
  )
}