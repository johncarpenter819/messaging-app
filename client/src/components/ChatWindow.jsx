import MessageBubble from "./MessageBubble";
import ProfileForm from "./ProfileForm";
import "../styles/ChatWindow.css";

export default function ChatWindow({
  messages,
  input,
  setInput,
  onSend,
  otherUserId,
  userId,
  otherUserName,
}) {
  if (!otherUserId) {
    return (
      <div className="chat-window chat-placeholder">
        <p>Select a chat or contact to begin messaging</p>
      </div>
    );
  }

  const displayMessages = messages;
  const currentUserId = localStorage.getItem("userId");

  return (
    <div className="chat-window">
      <ProfileForm otherUserName={otherUserName} />
      <div className="messages">
        {displayMessages.length === 0 && (
          <div className="empty-chat-prompt">
            <p>Start a conversation! Type your first message below.</p>
          </div>
        )}

        {displayMessages.map((msg, i) => {
          const text = msg.content || msg.message || msg.text || msg;
          const bubbleSender = msg.sender_id === currentUserId ? "me" : "other";
          return (
            <MessageBubble
              key={msg.id || i}
              message={text}
              sender={bubbleSender}
            />
          );
        })}
      </div>

      <form className="chat-input" onSubmit={onSend}>
        <input
          type="text"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
