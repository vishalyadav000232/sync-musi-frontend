class WebSocketService {
  constructor() {
    this.socket = null;

    this.listeners = new Map();

    this.roomCode = null;
    this.userId = null;
    this.token = null;

    // reconnect
    this.reconnectDelay = 2000;
    this.maxReconnectDelay = 30000;
    this.reconnectTimeout = null;
    this.manualClose = false;
    this.retryCount = 0;
    this.maxRetries = 10;

    
    this.pingInterval = null;
    this.lastPong = Date.now();

    
    this.lastEventTs = 0;

    this.connecting = false;
  }

 
  connect(roomCode, userId, token) {
    if (!token) {
      console.error("❌ Missing token in WebSocket connect");
      return;
    }

    if (this.connecting) return;

    if (this.socket?.readyState === WebSocket.OPEN) return;

    this.connecting = true;
    this.manualClose = false;

   
    if (this.socket) {
      this._destroySocket();
    }

    this.roomCode = roomCode;
    this.userId = userId;
    this.token = token;

    const url = `${import.meta.env.VITE_WS_URL}/ws/join/${roomCode}/${userId}?token=${token}`;

    this.socket = new WebSocket(url);

    console.log(this.socket)

    this.socket.onopen = () => {
      console.log("✅ WebSocket Connected");

      this.connecting = false;

      this.reconnectDelay = 2000;
      this.retryCount = 0;
      this.lastPong = Date.now();

      this._startHeartbeat();
    };

    this.socket.onmessage = (e) => this._handleMessage(e);

    this.socket.onerror = (err) => {
      console.error("❌ WebSocket Error:", err);
    };

    this.socket.onclose = () => {
      console.log("❌ WebSocket Disconnected");

      this.connecting = false;

      this._stopHeartbeat();
      this.socket = null;

      if (!this.manualClose) {
        this._scheduleReconnect();
      }
    };
  }

  // =========================
  // MESSAGE HANDLER
  // =========================
  _handleMessage(e) {
    let data;

    try {
      data = JSON.parse(e.data);
    } catch {
      return;
    }

    if (!data?.type) return;

    if (data.type === "PONG") {
      this.lastPong = Date.now();
      return;
    }

    if (data.type === "PING") {
      this.lastPong = Date.now();
      return;
    }

    if (data.ts) {
      if (data.ts < this.lastEventTs) return;
      this.lastEventTs = data.ts;
    }

    const handlers = this.listeners.get(data.type);
    if (!handlers) return;

    for (const cb of [...handlers]) {
      try {
        cb(data);
      } catch (err) {
        console.error("❌ Handler error:", err);
      }
    }
  }

  // =========================
  // HEARTBEAT
  // =========================
  _startHeartbeat() {
    this._stopHeartbeat();

    this.pingInterval = setInterval(() => {
      if (!this.socket || this.socket.readyState !== WebSocket.OPEN) return;

      this.send({ type: "PING" });

      if (Date.now() - this.lastPong > 60000) {
        console.warn("⚠️ WebSocket dead → reconnecting...");
        this.socket.close();
      }
    }, 30000);
  }

  _stopHeartbeat() {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
  }

  // =========================
  // SEND
  // =========================
  send(event) {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) return;

    this.socket.send(
      JSON.stringify({
        ...event,
        ts: event.ts ?? Date.now(),
      })
    );
  }

  // =========================
  // SUBSCRIBE
  // =========================
  subscribe(type, cb) {

    if (!this.listeners.has(type)) {
      this.listeners.set(type, new Set());
    }

    this.listeners.get(type).add(cb);

    return () => this.unsubscribe(type, cb);
  }

  unsubscribe(type, cb) {
    const set = this.listeners.get(type);
    if (!set) return;

    set.delete(cb);
    if (set.size === 0) this.listeners.delete(type);
  }

  // =========================
  // RECONNECT
  // =========================
  _scheduleReconnect() {
    if (this.reconnectTimeout) return;

    if (this.retryCount >= this.maxRetries) {
      console.error("❌ Max reconnect attempts reached");
      return;
    }

    this.retryCount++;

    this.reconnectTimeout = setTimeout(() => {
      this.reconnectTimeout = null;

      this.connect(this.roomCode, this.userId, this.token);
    }, this.reconnectDelay);

    this.reconnectDelay = Math.min(
      this.reconnectDelay * 2,
      this.maxReconnectDelay
    );
  }

  // =========================
  // CLEANUP
  // =========================
  _destroySocket() {
    if (!this.socket) return;

    this.socket.onopen = null;
    this.socket.onmessage = null;
    this.socket.onclose = null;
    this.socket.onerror = null;

    try {
      this.socket.close();
    } catch {
      // Ignore close errors
    }

    this.socket = null;
  }

  // =========================
  // DISCONNECT
  // =========================
  disconnect() {
    this.manualClose = true;

    this.retryCount = 0;

    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }

    this._stopHeartbeat();
    this._destroySocket();
  }
}

export default new WebSocketService();