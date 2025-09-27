import { useState, useEffect } from "react";
import { fetchMessages, sendMessage } from "../api/api";
import ChatWindow from "../components/ChatWindow";
import MessageBubble from "../components/MessageBubble";
import "../styles/Chats.css";

export default function Chats() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [activeTab, setActiveTag] = useState("conversations");
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!token || !userId) return;

    const getMessages = async () => {
      try {
        const data = await fetchMessages(userId, token);
        setMessages(data);
      } catch (err) {
        setError("Failed to load messages");
      }
    };

    getMessages();
  }, [token, userId]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    try {
      const newMessage = await sendMessage({ userId, content: input }, token);
      setMessages([...messages, newMessage]);
      setInput("");
    } catch (err) {
      setError("Failed to send message");
    }
  };

  return (
    <ChatWindow>
      {messages.map((msg) => (
        <MessageBubble key={msg.id} message={msg} />
      ))}
      {error && <p className="error">{error}</p>}
      <form className="chat-form" onSubmit={handleSend}>
        <input
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </ChatWindow>
  );
}
