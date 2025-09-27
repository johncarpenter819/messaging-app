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

export async function fetchMessages(userId, token) {
  const res = await fetch(`${API_URL}/api/messages/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}

export async function sendMessage(data, token) {
  const res = await fetch(`${API_URL}/api/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
}
