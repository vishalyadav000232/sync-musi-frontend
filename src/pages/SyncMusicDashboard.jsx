import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Blob } from "./ui/Blob";
import { RoomHeader } from "../components/Music/Header";
import { ParticipantsList } from "../components/Music/ParticipantsList";
import { MusicPlayer } from "../components/Music/MusicPlayer";
import { Chats } from "../components/Chats/Chats";

import { useRoom } from "../context/RoomContext";
import { useAuth } from "../context/AuthContext";
import websocket from "../services/websocket";

// ---------------- DEMO PLAYLIST ----------------
const DEMO_PLAYLIST = [
  {
    title: "SoundHelix Song 1",
    artist: "SoundHelix",
    album: "Demo",
    duration: 0,
    cover: "🎵",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  },
  {
    title: "SoundHelix Song 2",
    artist: "SoundHelix",
    album: "Demo",
    duration: 0,
    cover: "🎶",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
  },
  {
    title: "SoundHelix Song 3",
    artist: "SoundHelix",
    album: "Demo",
    duration: 0,
    cover: "🎧",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
  },
];

export const SyncMusicDashboard = () => {
  const navigate = useNavigate();

  const { participants, room, joinRoom, leaveRoom } = useRoom();
  const { user } = useAuth();

  // ---------------- STATE ----------------
  const [playlist] = useState(DEMO_PLAYLIST);
  const [song, setSong] = useState(DEMO_PLAYLIST[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [muted, setMuted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const seekTimeoutRef = useRef(null);
  const lastSyncRef = useRef(null);
  const joinAttemptRef = useRef(false);

  // ---------------- JOIN ROOM ----------------
  useEffect(() => {
    const roomCode = localStorage.getItem("room_code");
    if (!room && roomCode && !joinAttemptRef.current) {
      joinAttemptRef.current = true;
      joinRoom(roomCode).catch(() => {
        joinAttemptRef.current = false;
      });
    }
  }, [room, joinRoom]);

  // ---------------- WEBSOCKET EVENTS ----------------
  useEffect(() => {
    const parseServerTime = (value) => {
      if (!value) return Date.now();
      const num = Number(value);
      if (Number.isNaN(num)) return Date.now();
      return num < 1e12 ? num * 1000 : num;
    };

    const normalizeEvent = (payload) => payload?.event || payload;
    const normalizeState = (event) => event?.state ?? event;

    const unsubSync = websocket.subscribe("SYNC", (payload) => {
      const event = normalizeEvent(payload);
      const state = normalizeState(event);
      if (!state) return;

      const now = Date.now();
      const serverNow = parseServerTime(event.server_time ?? state.last_updated);
      const drift = now - serverNow;

      const correctedPosition =
        state.position + (state.is_playing ? drift / 1000 : 0);

      setSong(state.song || DEMO_PLAYLIST[0]);
      setCurrentIndex(state.index ?? 0);
      setIsPlaying(state.is_playing);
      setProgress(correctedPosition);

      lastSyncRef.current = Date.now();
    });

    const unsubError = websocket.subscribe("ERROR", (payload) => {
      const event = normalizeEvent(payload);
      alert(event.message || "Action not allowed");
    });

    const unsubPlay = websocket.subscribe("PLAY", (payload) => {
      const event = normalizeEvent(payload);
      const state = normalizeState(event);
      if (!state) return;

      if (event.source === user?.id) return;

      const now = Date.now();
      const serverNow = parseServerTime(event.server_time ?? state.last_updated);
      const drift = now - serverNow;

      const correctedPosition =
        state.position + (state.is_playing ? drift / 1000 : 0);

      setSong(state.song || DEMO_PLAYLIST[0]);
      setCurrentIndex(state.index ?? 0);
      setIsPlaying(state.is_playing);
      setProgress(correctedPosition);

      lastSyncRef.current = Date.now();
    });

    const unsubPause = websocket.subscribe("PAUSE", (payload) => {
      const event = payload?.event || payload;
      if (event.source === user?.id) return;

      setIsPlaying(false);
      setProgress(event.position ?? 0);
    });

    const unsubSeek = websocket.subscribe("SEEK", (payload) => {
      const event = payload?.event || payload;
      if (event.source === user?.id) return;

      setProgress((prev) => {
        const diff = Math.abs(prev - event.position);
        return diff > 0.5 ? event.position : prev;
      });
    });

    const unsubNext = websocket.subscribe("NEXT", (payload) => {
      const event = payload?.event || payload;
      if (event.source === user?.id) return;

      const nextSong = playlist[event.index] || playlist[0];

      setCurrentIndex(event.index);
      setSong(nextSong);
      setProgress(0);
      setIsPlaying(true);
    });

    const unsubPrev = websocket.subscribe("PREV", (payload) => {
      const event = payload?.event || payload;
      if (event.source === user?.id) return;

      const prevSong = playlist[event.index] || playlist[0];

      setCurrentIndex(event.index);
      setSong(prevSong);git 
      setProgress(0);
      setIsPlaying(true);
    });

    return () => {
      unsubSync();
      unsubError();
      unsubPlay();
      unsubPause();
      unsubSeek();
      unsubNext();
      unsubPrev();
    };
  }, [user, playlist]);

  // ---------------- CONTROLS ----------------
  const handlePlayToggle = (play) => {
    const selectedSong = playlist[currentIndex];

    setSong(selectedSong);
    setIsPlaying(play);

    websocket.send({
      type: play ? "PLAY" : "PAUSE",
      is_playing: play,
      position: progress,
      song: selectedSong,
      index: currentIndex,
      source: user?.id,
    });
  };

  const handleSeek = (pos) => {
    const nextPosition = typeof pos === "function" ? pos(progress) : pos;

    setProgress(nextPosition);

    if (seekTimeoutRef.current) clearTimeout(seekTimeoutRef.current);

    seekTimeoutRef.current = setTimeout(() => {
      websocket.send({
        type: "SEEK",
        position: nextPosition,
        song,
        index: currentIndex,
        source: user?.id,
      });
    }, 100);
  };

  const handleLocalProgress = (pos) => {
    setProgress(pos);
  };

  const handleNext = () => {
    const nextIndex = (currentIndex + 1) % playlist.length;
    const nextSong = playlist[nextIndex];

    setCurrentIndex(nextIndex);
    setSong(nextSong);
    setProgress(0);

    websocket.send({
      type: "NEXT",
      index: nextIndex,
      song: nextSong,
      source: user?.id,
    });
  };

  const handlePrev = () => {
    const prevIndex =
      currentIndex === 0 ? playlist.length - 1 : currentIndex - 1;

    const prevSong = playlist[prevIndex];

    setCurrentIndex(prevIndex);
    setSong(prevSong);
    setProgress(0);

    websocket.send({
      type: "PREV",
      index: prevIndex,
      song: prevSong,
      source: user?.id,
    });
  };

  // ---------------- LEAVE ROOM ----------------
  const handleLeave = async () => {
    if (!room) return;

    try {
      const res = await leaveRoom(room.id);
      if (res) {
        localStorage.removeItem("room_code");
        websocket.disconnect();
        navigate("/join-room");
      }
    } catch (err) {
      console.error("Leave room failed", err);
    }
  };

  // ---------------- UI SAFETY ----------------
  if (!song) {
    return <div className="text-white">Loading music...</div>;
  }

  // ---------------- UI ----------------
  return (
    <div className="relative min-h-screen bg-[#060610] text-[#e2e2f0] flex flex-col items-center px-4 md:px-8 py-10 gap-10">
      <Blob />

      <RoomHeader
        room={room}
        onLeave={handleLeave}
        user={user}
        participants={participants}
      />

      <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <ParticipantsList participants={participants} />

        <MusicPlayer
          song={song}
          isPlaying={isPlaying}
          onTogglePlay={handlePlayToggle}
          progress={progress}
          onSeek={handleSeek}
          onProgress={handleLocalProgress}
          volume={volume}
          setVolume={setVolume}
          muted={muted}
          setMuted={setMuted}
          onNext={handleNext}
          onPrev={handlePrev}
          isHost={user?.id === room?.host_id}
        />

        <Chats />
      </div>
    </div>
  );
};