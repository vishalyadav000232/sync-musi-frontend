import { LogOut } from "lucide-react";
import { randomHexColor } from "../../utils/randomColor";

export function RoomHeader({ room, onLeave, participants, user }) {

  const totalActive =
    participants?.filter((p) => p.is_connected)?.length || 0;

  const isHost = user?.id === room?.host_id;

  const avatar = user?.full_name?.charAt(0)?.toUpperCase() || "U";
  const color = randomHexColor(user?.id || 1);
  const username = user?.full_name || "user"

  return (
    <header className="flex flex-wrap md:flex-nowrap items-center justify-between gap-4 px-4 md:px-6 py-3 bg-white/5 backdrop-blur-md border border-white/10 w-full rounded-2xl">

      {/* Left Side - Room Info */}
      <div className="flex items-center gap-3">

        <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>

        <div>
          <div className="text-white font-semibold text-lg">
            #{room?.name || "room"}
          </div>

          <div className="text-sm text-gray-400">
            {totalActive} listeners • live
          </div>
        </div>

      </div>

      {/* Right Side */}
      <div className="flex items-center gap-4">

      
        <div
          className="relative w-10 h-10 flex items-center justify-center rounded-full font-semibold"
          style={{
            background: color + "33",
            border: `2px solid ${color}`,
            color: color
          }}
        >
          {avatar}

          {isHost && (
            <span className="absolute -top-1 -right-1 text-[9px] px-1 rounded bg-yellow-400 text-black">
              host
            </span>
          )}
        </div>
          
          <p className="text-white font-bold text-lg">{username}</p>

      
        <button
          onClick={onLeave}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 transition"
        >
          <LogOut size={18} />
          <span className="hidden sm:inline">Leave</span>
        </button>

      </div>

    </header>
  );
}