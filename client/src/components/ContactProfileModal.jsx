import React from "react";
import "../styles/ContactProfileModal.css";

export default function ContactProfileModal({
  contact,
  onClose,
  onMessage,
  onVisitProfile,
}) {
  if (!contact) return null;

  const avatar = contact.avatar_url || "./default-avatar.png";

  const effectiveStatus = contact.status || "Offline";
  const statusClass = effectiveStatus.toLowerCase();

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="contact-profile-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="close-btn" onClick={onClose}>
          &times;
        </button>

        <div className="profile-header">
          <img
            src={avatar}
            alt={`${contact.username}'s avatar`}
            className="modal-avatar"
          />
          <h2>{contact.username}</h2>
        </div>

        <div className="profile-details">
          <p className={`status-line ${statusClass}`}>
            <strong>Status:</strong> {effectiveStatus}
          </p>
        </div>

        <div className="profile-actions">
          <button className="message-btn" onClick={() => onMessage(contact)}>
            Message {contact.username}
          </button>

          <button className="profile-btn" onClick={onVisitProfile || onClose}>
            View Full Profile
          </button>
        </div>
      </div>
    </div>
  );
}
