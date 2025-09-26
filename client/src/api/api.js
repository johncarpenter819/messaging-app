const API_URL = import.meta.env.VITE_API_URL;

export const ping = async () => {
  try {
    const res = await fetch(`${API_URL}/api/ping`);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error("Ping failed:", err);
    return { message: "error fetching server" };
  }
};
