import { LensConcaveIcon, LogOut } from "lucide-react";

export function RoomHeader({ roomName, onLeave }) {
  return (
    <header className="flex items-center justify-between px-6 py-3 bg-white/2 backdrop-blur-md border border-white/10 w-full h-20 rounded-2xl">
      
      {/* Left Section */}
      <div className="flex items-center gap-3">
        
        {/* Live Dot */}
        <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>

        <div>
          <div className="text-white font-semibold text-lg">
            #{roomName}
          </div>

          <div className="text-sm text-gray-400">
            5 listeners • live
          </div>
        </div>

      </div>

      {/* Leave Button */}
      <button
        onClick={onLeave}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 transition"
      >
        <LogOut /> 
        <span>Leave</span>
      </button>

    </header>
  );
}