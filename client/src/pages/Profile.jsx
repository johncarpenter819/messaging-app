import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { fetchUserDetails, updateProfile } from "../api/api";
import "../styles/Profile.css";

export default function Profile() {
  const { userId: currentUserId, token, isLoggedIn } = useAuth();
  const { userId: profileId } = useParams();
  const navigate = useNavigate();

  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editBio, setEditBio] = useState("");
  const [editAvatarUrl, setEditAvatarUrl] = useState("");

  const userToFetch = profileId || currentUserId;

  const loadProfile = async () => {
    if (!token || !userToFetch) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await fetchUserDetails(userToFetch, token);
      setProfileData(data);
      setEditBio(data.bio || "");
      setEditAvatarUrl(data.avatar_url || "");
    } catch (err) {
      console.error("Failed to load profile:", err);
      setError(err.message || "Failed to load profile data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    loadProfile();
  }, [userToFetch, token, isLoggedIn, navigate]);

  const handleSave = async () => {
    setError(null);
    try {
      const updatedData = {};
      if (editBio !== profileData.bio) {
        updatedData.bio = editBio;
      }
      if (editAvatarUrl !== profileData.avatar_url) {
        updatedData.avatar_url = editAvatarUrl;
      }
      if (Object.keys(updatedData).length === 0) {
        setIsEditing(false);
        return;
      }

      const data = await updateProfile(currentUserId, updatedData, token);
      setProfileData(data);
      setIsEditing(false);
    } catch (err) {
      console.error("Failed to save profile:", err);
      setError(err.message || "Failed to save profile changes.");
    }
  };

  const handleMessage = () => {
    navigate(`/chats?user=${profileData.id}`);
  };

  const handleBackToChats = () => {
    navigate("/chats");
  };

  if (loading) {
    return <div className="profile-page loading">Loading Profile...</div>;
  }

  if (error) {
    return <div className="profile-page err">Error: {error}</div>;
  }

  if (!profileData) {
    return <div className="profile-page not-found">Profile not found.</div>;
  }

  const isOwnProfile = profileData.id === currentUserId;

  const effectiveStatus = isOwnProfile
    ? "Online"
    : profileData.status || "Offline";

  const statusClass = effectiveStatus.toLowerCase();

  return (
    <div className="profile-wrapper">
      <div className="profile-page">
        <div className="profile-container">
          <button className="back-to-chats-btn" onClick={handleBackToChats}>
            &larr; Back to Messages
          </button>
          <header className="profile-header">
            <img
              src={profileData.avatar_url || "./default-avatar.png"}
              alt={`${profileData.username}'s avatar`}
              className="profile-avatar"
            />
            <h2>{profileData.username}</h2>
            <p className={`profile-status ${statusClass}`}>
              Status: {effectiveStatus}
            </p>
          </header>

          {error && <p className="app-error-message">{error}</p>}

          <section className="profile-details">
            <h3>Bio</h3>
            {isEditing && isOwnProfile ? (
              <>
                <textarea
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  placeholder="Tell everyone about you!"
                  maxLength={1000}
                />
                <h3>Avatar</h3>
                <input
                  type="url"
                  value={editAvatarUrl}
                  onChange={(e) => setEditAvatarUrl(e.target.value)}
                  placeholder="Enter new image URL"
                />
              </>
            ) : (
              <p className="profile-bio">
                {profileData.bio ||
                  (isOwnProfile
                    ? "Click 'Edit' to add a bio."
                    : "No bio provided.")}
              </p>
            )}

            <h3>Contact Details</h3>
            <p>
              <strong>Email:</strong>
              {profileData.email}
            </p>
            <p>
              <strong>Member Since:</strong>
              {profileData.created_at}
            </p>
          </section>

          <div className="profile-actions">
            {!isOwnProfile ? (
              <button onClick={handleMessage} className="message-btn">
                Send Message
              </button>
            ) : isEditing ? (
              <>
                <button onClick={handleSave} className="save-btn">
                  Save Changes
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="cancel-btn"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button onClick={() => setIsEditing(true)} className="edit-btn">
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
