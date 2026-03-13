import { useEffect, useState } from "react";
import { randomHexColor } from "../../utils/randomColor";

export function ParticipantsList({ participants }) {
    

    return (
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-5 w-100">

            {/* Card Title */}
            <div className="flex items-center justify-between mb-4 w-full">
                <span className="text-white font-semibold text-lg">Listeners</span>

                <span className="px-2 py-1 text-sm rounded-md bg-blue-500/20 text-blue-400">
                    {participants?.length || 0}
                </span>
            </div>

            {/* Participants Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-5">

                {participants?.map((p) => {

                    const name = p?.user?.full_name || p?.user?.username || "unknown";
                    const avatar = p?.avatar || name?.charAt(0)?.toUpperCase();
                    const color = randomHexColor(p.user.id);

                    return (
                        <div
                            key={p.id}
                            className="h-30 w-28 flex flex-col items-center justify-center bg-white/1 backdrop-blur-md border border-white/10 rounded-2xl p-2 hover:scale-105 transition"
                            title={name}
                        >

                            {/* Avatar */}
                            <div
                                className="relative w-10 h-10 flex items-center justify-center rounded-full font-semibold text-white"
                                style={{
                                    background: color + "33",
                                    border: `2px solid ${color}`,
                                    color: color
                                }}
                            >
                                {avatar}

                                <span
                                    className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-black"
                                    style={{
                                        background: p?.is_connected ? "#10b981" : "#4b5563"
                                    }}
                                />
                            </div>
                            {/* Name */}
                            <div className="mt-2 text-[10px] text-gray-300 truncate w-full text-center">
                                {name}
                            </div>

                            {/* Host Tag */}
                            {p.role === "host" && (
                <div className="mt-1 text-xs px-2 py-0.5 rounded bg-yellow-500/20 text-yellow-400">
                  host
                </div>
              )}

                        </div>
                    );
                })}

            </div>
        </div>
    );
}