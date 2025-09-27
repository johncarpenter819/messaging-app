import MessageBubble from "./MessageBubble";
import ProfileForm from "./ProfileForm";
import "../styles/ChatWindow.css";

export default function ChatWindow() {
  return (
    <div className="chat-window">
      <ProfileForm />
      <div className="messages">
        <MessageBubble message="Hello!" sender="other" />
        <MessageBubble message="Hi there!" sender="me" />
      </div>
    </div>
  );
}
