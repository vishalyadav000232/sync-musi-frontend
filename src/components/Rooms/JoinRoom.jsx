import React, { useState } from "react";
import MusicIcon from "../Auth/ui/MusicIcon";
import UsernameBadge from "../Auth/ui/UsernameBaged";
import { useAuth } from "../../context/AuthContext";
import { useRoom } from "../../context/RoomContext";
import { useNavigate } from "react-router-dom";

export const JoinRoom = () => {

    const [roomCode, setRoomCode] = useState("");
    const [loading, setLoading] = useState(false);
    const { joinRoom } = useRoom()
    const { user, logout } = useAuth();
    const navigate = useNavigate()

    const handleJoin = async () => {

        const code = roomCode.trim().toUpperCase();

        if (!code || loading) return;

        try {
            setLoading(true);

            console.log("Joining room:", code);

            const res = await joinRoom(code)
            if (res) {
                navigate("/sync-music")
            }


        } catch (err) {
            console.error("Failed to join room", err);
        } finally {
            setLoading(false);
        }
    };


    const handleLogout = () => {
        logout()
        navigate("/")
    }

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            handleJoin();
        }
    };

    return (
        <div className="w-full max-w-md flex flex-col gap-5">

            {/* Header */}
            <div className="flex justify-end">
                <UsernameBadge
                    username={user?.full_name || "user"} role="Host"
                    onlogout={handleLogout}
                />
            </div>

            {/* Main Card */}
            <div
                className="flex flex-col gap-6 p-3"
            >

                <h1 className="text-4xl font-bold text-white text-center">
                    Join Room
                </h1>

                <div className="flex justify-center">
                    <MusicIcon size={70} />
                </div>

                <h2 className="text-sm font-semibold text-pink-300 text-center">
                    Plug Into the Rhythm
                </h2>

                {/* Room Code Input */}
                <div className="w-full flex flex-col gap-2">

                    <label htmlFor="roomCode" className="text-sm text-gray-300">
                        Room Code
                    </label>

                    <input
                        id="roomCode"
                        type="text"
                        value={roomCode}
                        onChange={(e) => setRoomCode(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Enter Room Code"
                        className="w-full px-4 py-2 rounded-lg
            bg-white/10 border border-white/20
            text-white placeholder-gray-400
            focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />

                </div>

                {/* Join Button */}
                <button
                    onClick={handleJoin}
                    disabled={loading}
                    className="w-full py-2 rounded-lg
          bg-gradient-to-r from-purple-500 to-pink-500
          hover:opacity-90 transition
          font-semibold text-white
          disabled:opacity-50"
                >
                    {loading ? "Joining..." : "Join Room"}
                </button>

            </div>

        </div>
    );
};