import React from "react";

export default function UsernameBadge({ username }) {

  const initial = username?.charAt(0).toUpperCase();

  return (
    <div className="flex items-center gap-3 px-3 py-2 rounded-full
       border-white/10 backdrop-blur-lg
      text-white w-full">

      {/* Avatar Initial */}
      <div className="w-8 h-8 flex items-center justify-center
        rounded-full bg-gradient-to-r from-purple-500 to-pink-500
        font-bold text-sm">
        {initial}
      </div>

      {/* Username */}
      <span className="font-semibold">{username}</span>

    
    </div>
  );
}