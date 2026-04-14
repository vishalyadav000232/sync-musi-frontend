import { Send } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import websocket from "../../services/websocket";
import { useAuth } from "../../context/AuthContext";

export const Chats = () => {

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const { user } = useAuth();

  const bottomRef = useRef(null);

  useEffect(() => {

    const handleIncomingMessage = (data) => {
      console.log(data)
      setMessages(prev => [...prev, data]);
    };

    websocket.subscribe("chat_message", handleIncomingMessage);

    return () => {
      websocket.unsubscribe("chat_message", handleIncomingMessage);
    };

  }, []);

 
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {

    if (!message.trim()) return;

    const newMessage = {
      type: "chat_message",
      id: Date.now(),
      user: user?.username,
      text: message
    };

    websocket.send(newMessage);

    setMessage("");

  };

  return (

    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 w-full max-w-md">

      <h3 className="text-amber-50 font-bold text-xl mb-4 border-b border-slate-400/10 p-2">
        Chat Box
      </h3>

      <div className="flex flex-col h-[400px]">

        <div className="flex flex-col flex-1 gap-2 overflow-y-auto mb-3">

          {messages.map((msg) => {
          

            const isCurrentUser = msg.user === user?.username;

            return (

              <div
                key={msg.id}
                className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}
              >

                <div
                  className={`px-3 py-2 rounded-lg max-w-[70%] text-white
                    ${isCurrentUser
                      ? "bg-purple-600/15"
                      : "bg-gray-700"
                    }`}
                >

                  {!isCurrentUser && (
                    <div className="text-xs text-gray-300 mb-1">
                      {msg.user}
                    </div>
                  )}

                  <div>{msg.text}</div>

                </div>

              </div>

            );

          })}

          <div ref={bottomRef} />

        </div>

        <div className="flex items-center gap-2">

          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSend();
            }}
            placeholder="Type something..."
            className="bg-white/10 w-full p-3 rounded-2xl outline-none text-white"
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