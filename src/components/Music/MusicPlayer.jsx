import {
  PauseIcon,
  PlayIcon,
  RepeatIcon,
  ShuffleIcon,
  SkipBackIcon,
  SkipForwardIcon,
  VolumeIcon,
} from "lucide-react";
import { useRef, useEffect, useState } from "react";

export function MusicPlayer({
  song,
  isPlaying,
  onTogglePlay,
  progress,
  onSeek,
  onProgress,
  volume,
  setVolume,
  muted,
  setMuted,
  onNext,
  onPrev,
}) {
  const audioRef = useRef(null);
  const syncLock = useRef(false);

  // store duration safely (IMPORTANT FIX)
  const [duration, setDuration] = useState(0);

  // =========================
  // PLAY / PAUSE (server driven)
  // =========================
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }, [isPlaying, song]);

  // =========================
  // VOLUME
  // =========================
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = muted ? 0 : volume;
  }, [volume, muted]);

  // =========================
  // CAPTURE DURATION (FIX #1)
  // =========================
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoaded = () => {
      setDuration(audio.duration || 0);
    };

    audio.addEventListener("loadedmetadata", handleLoaded);

    return () => audio.removeEventListener("loadedmetadata", handleLoaded);
  }, [song]);

  // =========================
  // SERVER → AUDIO SYNC
  // =========================
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (syncLock.current) return;

    const diff = Math.abs(audio.currentTime - progress);

    if (diff > 0.5) {
      audio.currentTime = progress;
    }
  }, [progress]);

  // =========================
  // AUDIO → UI (SOFT SYNC ONLY)
  // =========================
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const update = () => {
      if (syncLock.current) return;

      const currentTime = audio.currentTime;
      if (typeof onProgress === "function") {
        onProgress(currentTime);
      }
    };

    audio.addEventListener("timeupdate", update);

    return () => audio.removeEventListener("timeupdate", update);
  }, [onProgress]);

  // =========================
  // SONG CHANGE RESET
  // =========================
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    syncLock.current = true;

    audio.currentTime = 0;
    if (typeof onProgress === "function") {
      onProgress(0);
    }

    setTimeout(() => {
      syncLock.current = false;
    }, 400);
  }, [song, onProgress]);

  // =========================
  // SEEK
  // =========================
  const handleSeek = (e) => {
    const audio = audioRef.current;
    if (!audio) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;

    const newTime = pct * (duration || 0);

    syncLock.current = true;
    audio.currentTime = newTime;

    if (typeof onSeek === "function") {
      onSeek(newTime);
    }

    setTimeout(() => {
      syncLock.current = false;
    }, 250);
  };

  // =========================
  // FORMAT TIME
  // =========================
  const fmt = (s) => {
    if (!s || isNaN(s)) return "0:00";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
  };

  // =========================
  // SAFE VALUES (FIX #2)
  // =========================
  const safeProgress = Math.min(progress || 0, duration || progress || 0);

  const elapsed = fmt(safeProgress);
  const total = fmt(duration || song?.duration || 0);

  const pct =
    duration > 0 ? Math.min(100, (safeProgress / duration) * 100) : 0;

  return (
    <div className="w-full max-w-md bg-white/5 rounded-2xl p-6 flex flex-col items-center gap-4">

      {/* AUDIO */}
      <audio
        ref={audioRef}
        src={song?.url}
        key={song?.url}
        loop="false"
        onEnded={onNext}
        onError={(e) => console.error("Audio load error:", e)}
      />

      {/* COVER */}
      <div className="w-40 h-40 flex items-center justify-center bg-white/10 text-4xl rounded-xl">
        {song?.cover}
      </div>

      {/* INFO */}
      <div className="text-center">
        <div className="text-lg font-semibold">{song?.title}</div>
        <div className="text-sm text-gray-400">{song?.artist}</div>
      </div>

      {/* CONTROLS */}
      <div className="flex items-center gap-4">
        <button><ShuffleIcon /></button>

        <button onClick={onPrev}>
          <SkipBackIcon />
        </button>

        <button
          onClick={() => onTogglePlay(!isPlaying)}
          className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center"
        >
          {isPlaying ? <PauseIcon /> : <PlayIcon />}
        </button>

        <button onClick={onNext}>
          <SkipForwardIcon />
        </button>

        <button><RepeatIcon /></button>
      </div>

      {/* PROGRESS */}
      <div className="flex items-center gap-3 w-full">
        <span>{elapsed}</span>

        <div
          onClick={handleSeek}
          className="flex-1 h-2 bg-white/10 rounded-full cursor-pointer"
        >
          <div className="h-full bg-purple-500" style={{ width: `${pct}%` }} />
        </div>

        <span>{total}</span>
      </div>

      {/* VOLUME */}
      <div className="flex items-center gap-3 w-full">
        <button onClick={() => setMuted(!muted)}>
          <VolumeIcon />
        </button>

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
        />
      </div>
    </div>
  );
}