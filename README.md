# 🎵 Sync Music — Real-Time Music Listening Rooms

A **real-time collaborative music listening platform** where users can create or join rooms and listen to music **synchronized with other participants**, similar to Spotify Jam or Watch Party experiences.

This project uses **FastAPI + WebSockets** for real-time backend communication and **React.js** for the frontend interface.

---

# 🚀 Features

* 🎧 **Create or Join Music Rooms**
* 👥 **Real-time Participants List**
* ⏯ **Synchronized Music Playback**
* ⚡ **Low-latency WebSocket Communication**
* 🔄 **Live Events (Play / Pause / Seek)**
* 🧠 **Room State Management**
* 🌐 **Modern React UI**
* 🔌 **WebSocket Event Handling**

---

# 🏗 System Architecture

```
Client (React)
      │
      │ WebSocket + REST API
      ▼
FastAPI Backend
      │
      │ Pub/Sub Messaging
      ▼
Redis (Event Broadcasting)
```

### Communication Flow

```
User Action
   ↓
React Frontend
   ↓
WebSocket Event
   ↓
FastAPI WebSocket Server
   ↓
Redis Pub/Sub
   ↓
Broadcast to All Participants
```

This ensures **all users stay in sync while listening to music together**.

---

# 🛠 Tech Stack

### Frontend

* React.js
* Context API (State Management)
* Tailwind CSS
* WebSocket Client

### Backend

* FastAPI
* WebSockets
* Redis Pub/Sub
* Python

### Other Tools

* Docker 
* REST APIs
* LocalStorage (session persistence)

---




---

# ⚙️ Installation

## 1️⃣ Clone the Repository

```bash
git clone https://github.com/vishalyadav/sync-music.git
cd sync-music
```

---

# 🖥 Backend Setup (FastAPI)

## Install dependencies

```bash
cd backend
pip install -r requirements.txt
```

## Run server

```bash
uvicorn app.main:app --reload
```


---

# 🌐 Frontend Setup (React)

```
cd frontend
npm install
npm run dev
```



---

# 🔌 WebSocket Events

### Client → Server

```
JOIN_ROOM
LEAVE_ROOM
PLAY_SONG
PAUSE_SONG
SEEK_SONG
```

### Server → Client

```
USER_JOINED
USER_LEFT
PLAYBACK_UPDATE
ROOM_STATE_UPDATE
```

---

# 🎧 Room Workflow

```
Create Room
     ↓
Join Room
     ↓
Connect WebSocket
     ↓
Participants Sync
     ↓
Music Playback Events
     ↓
Broadcast to All Users
```

---

# 📸 Example UI

Features inside a room:

* Room Header
* Participants List
* Music Player
* Real-time Playback Sync

---

# 🔒 Environment Variables

Backend `.env`

```
REDIS_URL=redis://localhost:6379
SECRET_KEY=your_secret_key
```

---

# 📌 Future Improvements

* Spotify API Integration
* Queue Management
* Room Host Controls
* Playback History
* Voice Chat
* Mobile Responsive UI
* Real time chat with live music 

---



---

# 📄 License

MIT License

---

# 👨‍💻 Author

**Vishal Yadav**

Backend & Full-Stack Developer
Interested in **Real-Time Systems, Backend Architecture, and Distributed Applications**

---
