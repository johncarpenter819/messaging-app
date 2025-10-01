import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  fetchMessages,
  sendMessage,
  fetchConversations,
  fetchContacts,
} from "../api/api";
import ChatWindow from "../components/ChatWindow";
// import MessageBubble from "../components/MessageBubble";
import ContactProfileModal from "../components/ContactProfileModal";
import "../styles/Chats.css";
import { useAuth } from "../context/AuthContext.jsx";

export default function Chats() {
  const navigate = useNavigate();
  const { token, userId, username, logout, isLoggedIn } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("conversations");
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [otherUserId, setOtherUserId] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [otherUserName, setOtherUserName] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    const getConversations = async () => {
      try {
        const data = await fetchConversations(token);
        setConversations(data);
      } catch (err) {
        console.error(err);
      }
    };

    const getContacts = async () => {
      try {
        const data = await fetchContacts(token);
        setContacts(data);
      } catch (err) {
        console.error(err);
      }
    };

    getConversations();
    getContacts();
  }, [token, isLoggedIn, navigate]);

  useEffect(() => {
    if (!token || !activeConversationId) return;

    const getMessages = async () => {
      try {
        const data = await fetchMessages(activeConversationId, token);
        console.log("Fetched messages", data);
        setMessages(data);
      } catch (err) {
        setError("Failed to load messages");
      }
    };

    getMessages();
  }, [token, activeConversationId]);

  const handleSelectConversation = (conv) => {
    setActiveConversationId(conv.id);

    setOtherUserName(conv.name || `Conversation ${conv.id}`);

    const currentUserIdStr = String(userId);
    const participant1IdStr = String(conv.participant1_id);
    const participant2IdStr = String(conv.participant2_id);

    if (participant1IdStr === currentUserIdStr) {
      setOtherUserId(participant2IdStr);
    } else {
      setOtherUserId(participant1IdStr);
    }
  };

  const handleStartConversation = (contact) => {
    setIsModalOpen(false);
    setActiveConversationId(null);
    setOtherUserId(contact.id);
    setOtherUserName(contact.username);
    setActiveTab("conversations");
    setMessages([]);
  };

  const handleContactClick = (contact) => {
    setSelectedContact(contact);
    setIsModalOpen(true);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    if (!otherUserId) {
      setError("Please select a chat or contact to send a message.");
      return;
    }

    if (!userId || String(userId).toLowerCase() === "undefined") {
      setError("Error: sender id not found please log out and back in.");
      return;
    }

    try {
      const newMessage = await sendMessage(
        {
          conversation_id: activeConversationId,
          sender_id: userId,
          receiver_id: otherUserId,
          content: input,
        },
        token
      );

      if (newMessage && newMessage.error) {
        setError(`Error: ${newMessage.error}`);
        return;
      }

      if (newMessage.conversation_id && !activeConversationId) {
        setActiveConversationId(newMessage.conversation_id);
      }

      setMessages([...messages, newMessage]);
      setInput("");
    } catch (err) {
      console.error(err);
      setError("Failed to send message");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="chats-page">
      <header className="chats-header">
        <div className="user-info">
          <img src="./default-avatar.png" alt="avatar" className="avatar" />
          <div>
            <p className="username">{username}</p>
            <p className="status online">Online</p>
          </div>
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </header>
      {error && (
        <div className="app-error-message">
          <p>{error}</p>
        </div>
      )}

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
              Array.isArray(conversations) && conversations.length > 0 ? (
                <ul>
                  {conversations.map((conv) => (
                    <li
                      key={conv.id}
                      onClick={() => handleSelectConversation(conv)}
                    >
                      {conv.name || `Conversation ${conv.id}`}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="list-status">No active chats found.</p>
              )
            ) : Array.isArray(contacts) && contacts.length > 0 ? (
              <ul>
                {contacts.map((contact) => (
                  <li
                    key={contact.id}
                    onClick={() => {
                      handleContactClick(contact);
                    }}
                  >
                    {contact.username}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="list-status">No contacts found.</p>
            )}
          </div>
        </aside>
        <ChatWindow
          messages={messages}
          input={input}
          setInput={setInput}
          onSend={handleSend}
          otherUserId={otherUserId}
          userId={userId}
          otherUserName={otherUserName}
        />
      </div>
      {isModalOpen && selectedContact && (
        <ContactProfileModal
          contact={selectedContact}
          onClose={() => setIsModalOpen(false)}
          onMessage={() => handleStartConversation(selectedContact)}
          onVisitProfile={() => navigate(`/profile/${selectedContact.id}`)}
        />
      )}
    </div>
  );
}
