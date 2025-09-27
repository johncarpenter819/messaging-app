import "../styles/MessageBubble.css";

export default function MessageBubble({ message, sender }) {
  return (
    <div className={`message-bubble ${sender === "me" ? "me" : "other"}`}>
      {message}
    </div>
  );
}
