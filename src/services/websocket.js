class WebSocketService {

  constructor() {
    this.socket = null;
    this.listeners = {};
  }

  connect(roomCode, userId) {

    if (this.socket) return;

    const url = `${import.meta.env.VITE_WS_URL}/ws/join/${roomCode}/${userId}`;

    this.socket = new WebSocket(url);

    this.socket.onopen = (e) => {
      console.log("WebSocket connected");
    };

    this.socket.onmessage = (e) => {
      const data = JSON.parse(e.data);

      const handler = this.listeners[data.type];
      if (handler) handler(data);
    };

    this.socket.onclose = () => {
      console.log("WebSocket Closed");
      this.socket = null;
    };

    this.socket.onerror = (err) => {
      console.error("WebSocket error:", err);
    };
  }

  send(event) {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) return;

    this.socket.send(JSON.stringify(event));
  }

  subscribe(eventType, callback) {
    this.listeners[eventType] = callback;
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }
}

export default new WebSocketService();