import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import axios from "axios";
import "./LiveChat.css";

const socket = io("http://localhost:3000");

const LiveChat = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [user, setUser] = useState({ firstName: "Guest" });


  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/user/fetchuser", {
          withCredentials: true, 
        });
        if (res.data.success) {
          setUser(res.data.user);
        }
      } catch (error) {
        console.log("User fetch error:", error.message);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    socket.on("chatMessage", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.off("chatMessage");
    };
  }, []);

  const handleSend = (e) => {
    e.preventDefault();
    if (message.trim()) {
      socket.emit("chatMessage", {
        user: user.firstName, 
        text: message,
      });
      setMessage("");
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-box">
        <h2>💬 Chat Room</h2>
        <div className="messages">
          {messages.map((msg, i) => (
            <p key={i}>
              <strong>{msg.user}:</strong> {msg.text} <span>({msg.time})</span>
            </p>
          ))}
        </div>
        <form onSubmit={handleSend} className="chat-form">
          <input
            type="text"
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button type="submit" className="chat-button">Send</button>
        </form>
      </div>
    </div>
  );
};

export default LiveChat;
