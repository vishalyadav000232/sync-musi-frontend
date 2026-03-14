import { PauseIcon, PlayIcon, RepeatIcon, ShuffleIcon, SkipBackIcon, SkipForwardIcon, VolumeIcon } from "lucide-react";
import { useRef } from "react";

export function MusicPlayer({
  song,
  isPlaying,
  setIsPlaying,
  progress,
  setProgress,
  volume,
  setVolume,
  muted,
  setMuted
}) {

  const barRef = useRef();

  const handleBarClick = (e) => {
    const rect = barRef.current.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    setProgress(Math.max(0, Math.min(1, pct)) * song.duration);
  };

  const fmtTime = (sec) => {
    if (!sec) return "0:00";
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const elapsed = fmtTime(progress);
  const total = fmtTime(song.duration);
  const pct = (progress / song.duration) * 100;

  return (
    <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex flex-col items-center gap-4 shadow-xl">

      {/* Cover Art */}
      <div className="relative">
        <div className="absolute inset-0 blur-2xl bg-purple-500/40 rounded-full"></div>

        <div className="relative w-40 h-40 flex items-center justify-center rounded-xl bg-white/10 text-4xl">
          {song.cover}
        </div>
      </div>

      {/* Song Info */}
      <div className="text-center">
        <div className="text-lg font-semibold text-white">
          {song.title}
        </div>

        <div className="text-sm text-gray-400">
          {song.artist} · {song.album}
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4">

        <button className="p-2 hover:bg-white/10 rounded-lg transition">
          <ShuffleIcon />
        </button>

        <button className="p-2 hover:bg-white/10 rounded-lg transition">
          <SkipForwardIcon flip />
        </button>

        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="w-12 h-12 flex items-center justify-center rounded-full bg-purple-600 hover:bg-purple-500 transition"
        >
          {isPlaying ? <PauseIcon /> : <PlayIcon />}
        </button>

        <button className="p-2 hover:bg-white/10 rounded-lg transition">
          <SkipBackIcon />
        </button>

        <button className="p-2 hover:bg-white/10 rounded-lg transition">
          <RepeatIcon />
        </button>

      </div>

      {/* Progress */}
      <div className="flex items-center gap-3 w-full">

        <span className="text-xs text-gray-400 w-10">
          {elapsed}
        </span>

        <div
          ref={barRef}
          onClick={handleBarClick}
          className="flex-1 h-2 bg-white/10 rounded-full relative cursor-pointer"
        >

          <div
            className="h-full bg-purple-500 rounded-full relative"
            style={{ width: `${pct}%` }}
          >

            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full"></div>

          </div>

        </div>

        <span className="text-xs text-gray-400 w-10 text-right">
          {total}
        </span>

      </div>

      {/* Volume */}
      <div className="flex items-center gap-3 w-full">

        <button
          className="p-2 hover:bg-white/10 rounded-lg"
          onClick={() => setMuted(!muted)}
        >
          <VolumeIcon muted={muted} />
        </button>

        <div className="relative flex-1 h-2 bg-white/10 rounded-full">

          <div
            className="absolute left-0 top-0 h-full bg-purple-500 rounded-full"
            style={{ width: `${muted ? 0 : volume * 100}%` }}
          />

          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={muted ? 0 : volume}
            onChange={(e) => {
              setVolume(+e.target.value);
              setMuted(false);
            }}
            className="absolute inset-0 w-full opacity-0 cursor-pointer"
          />

        </div>

      </div>

    </div>
  );
}