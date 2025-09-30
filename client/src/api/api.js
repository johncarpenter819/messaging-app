const API_URL = import.meta.env.VITE_API_URL;

export async function loginUser(credentials) {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });
  return res.json();
}

export async function signupUser(credentials) {
  const res = await fetch(`${API_URL}/api/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });
  return res.json();
}

export async function fetchMessages(conversationId, token) {
  const res = await fetch(`${API_URL}/api/messages/${conversationId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}

export async function sendMessage(
  { conversation_id, sender_id, receiver_id, content },
  token
) {
  const res = await fetch(`${API_URL}/api/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ conversation_id, sender_id, receiver_id, content }),
  });
  return res.json();
}

export const fetchConversations = async (token) => {
  const res = await fetch(`${API_URL}/api/conversations`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    throw new Error(`HTTP error! Status: ${res.status}`);
  }
  return res.json();
};

export const fetchContacts = async (token) => {
  const res = await fetch(`${API_URL}/api/contacts`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    throw new Error(`HTTP error! Status: ${res.status}`);
  }
  return res.json();
};
