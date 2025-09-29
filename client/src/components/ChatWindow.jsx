import MessageBubble from "./MessageBubble";
import ProfileForm from "./ProfileForm";
import "../styles/ChatWindow.css";

export default function ChatWindow({ messages, input, setInput, onSend }) {
  const testMessages = [
    { id: 1, text: "Hello there", sender: "other" },
    { id: 2, text: "General Kenobi", sender: "me" },
    { id: 3, text: "SW reference", sender: "other" },
  ];

  const displayMessages = messages.length ? messages : testMessages;

  return (
    <div className="chat-window">
      <ProfileForm />
      <div className="messages">
        {displayMessages.map((msg, i) => {
          const text = msg.text || msg.message || msg;
          const sender = msg.sender || msg.from || "other";
          return (
            <MessageBubble key={msg.id || i} message={text} sender={sender} />
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
