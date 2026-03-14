import { Send } from "lucide-react";
import React, { useEffect, useState } from "react";
import websocket from "../../services/websocket";
import { useAuth } from "../../context/AuthContext";

export const Chats = () => {

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const { user } = useAuth();


  useEffect(() => {

    const handleIncomingMessage = (data) => {
      setMessages(prev => [...prev, data]);
    };

    websocket.subscribe("chat_message", handleIncomingMessage);

    return () => {
      websocket.unsubscribe("chat_message", handleIncomingMessage);
    };

  }, []);

  const handleSend = () => {

    if (!message.trim()) return;

    const newMessage = {
      type: "chat_message",
      id: Date.now(),
      user: user?.username,
      text: message
    };

    websocket.send(newMessage);

    setMessages(prev => [...prev, newMessage]);

    setMessage("");

  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 w-full max-w-md">

      <h3 className="text-amber-50 font-bold text-xl mb-4 border-b border-slate-400/10 p-2">
        Chat Box
      </h3>

      <div className="flex flex-col h-[400px]">

        <div className="flex flex-col flex-1 gap-2 overflow-y-auto mb-3">

          {messages.map((msg) => (
            <div
              key={msg.id}
              className="bg-purple-500/20 text-white px-3 py-2 rounded-lg w-fit"
            >
              <strong>{msg.user}:</strong> {msg.text}
            </div>
          ))}

        </div>

        <div className="flex items-center gap-2">

          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type something..."
            className="bg-white/10 w-full p-3 rounded-2xl outline-none"
          />

          <button
            onClick={handleSend}
            className="bg-purple-500 p-2 rounded-xl hover:bg-purple-400 transition"
          >
            <Send size={20} className="text-white" />
          </button>

        </div>

      </div>

    </div>
  );
};