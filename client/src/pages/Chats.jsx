import { useState, useEffect } from "react";
import { fetchMessages, sendMessage } from "../api/api";
import ChatWindow from "../components/ChatWindow";
import MessageBubble from "../components/MessageBubble";
import "../styles/Chats.css";

export default function Chats() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("conversations");
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!token || !userId) return;

    const getMessages = async () => {
      try {
        const data = await fetchMessages(userId, token);
        console.log("Fetched messages", data);
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
    <div className="chats-page">
      <header className="chats-header">
        <div className="user-info">
          <img src="./default-avatar.png" alt="avatar" className="avatar" />
          <div>
            <p className="username">John Doe</p>
            <p className="status online">Online</p>
          </div>
        </div>
        <button className="logout-btn">Logout</button>
      </header>

      <div className="chats-body">
        <aside className="sidebar">
          <div className="tabs">
            <button
              className={activeTab === "conversations" ? "active" : ""}
              onClick={() => setActiveTab("conversations")}
            >
              Chats
            </button>
            <button
              className={activeTab === "contacts" ? "active" : ""}
              onClick={() => setActiveTab("contacts")}
            >
              Contacts
            </button>
          </div>

          <div className="list">
            {activeTab === "conversations" ? (
              <ul>
                <li>Alice</li>
                <li>Bob</li>
                <li>Charlie</li>
              </ul>
            ) : (
              <ul>
                <li>User1</li>
                <li>User2</li>
                <li>User3</li>
              </ul>
            )}
          </div>
        </aside>
        <ChatWindow
          messages={messages}
          input={input}
          setInput={setInput}
          onSend={handleSend}
        />
      </div>
    </div>
  );
}
