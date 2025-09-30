import "../styles/ProfileForm.css";

export default function ProfileForm({ otherUserName }) {
  const title = otherUserName
    ? `Chatting with ${otherUserName}`
    : "Select a Chat";

  return (
    <div className="profile-form">
      <h1>{title}</h1>
    </div>
  );
}
