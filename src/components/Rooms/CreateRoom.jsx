import React, { useState } from "react";
import UsernameBadge from "../Auth/ui/UsernameBaged";
import MusicIcon from "../Auth/ui/MusicIcon";
import { useAuth } from "../../context/AuthContext";
import { useRoom } from "../../context/RoomContext";
import { useNavigate } from "react-router-dom";

export const CreateRoom = () => {

  const { loading, user } = useAuth();
  const { createRoom } = useRoom();

  const [roomName, setRoomName] = useState("");
const navigate = useNavigate()
  const handleCreate = async () => {
    if (!roomName.trim()) return;

    try {

      const res = await createRoom(roomName);
      if(res){
        navigate("/sync-music")
      }

    } catch (err) {
      console.error(err.message);
    }
  };
 const handleLogout = ()=>{
logout()
navigate("/")
    }
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleCreate();
    }
  };

  return (
    <div className="w-full max-w-md flex flex-col gap-5">

      
      <div className="flex justify-end">
        <UsernameBadge 
        onlogout={handleLogout}
        username={user?.full_name || "user"} role="Host" />
      </div>

      
      <div className="flex flex-col gap-6 p-5">

        <h1 className="text-4xl font-bold text-white text-center">
          Create Room
        </h1>

        <div className="flex justify-center">
          <MusicIcon size={70} />
        </div>

        <h2 className="text-sm font-semibold text-pink-300 text-center">
          Start a new music session
        </h2>

        {/* Room Name */}
        <div className="flex flex-col gap-2">

          <label className="text-sm text-gray-300">
            Room Name
          </label>

          <input
            type="text"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter Room Name"
            className="w-full px-4 py-2 rounded-lg
            bg-white/10 border border-white/20
            text-white placeholder-gray-400
            focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

        </div>

        {/* Button */}
        <button
          onClick={handleCreate}
          disabled={loading}
          className="w-full py-2 rounded-lg
          bg-gradient-to-r from-purple-500 to-pink-500
          hover:opacity-90 transition
          font-semibold text-white
          disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Room"}
        </button>

      </div>

    </div>
  );
};