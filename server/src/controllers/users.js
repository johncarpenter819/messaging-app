import pool from "../config/db.js";

export const getUserDetails = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `SELECT id, username, email, bio, avatar_url, status, created_at
            FROM users WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error fetching user details:", err);
    res.status(500).json({ error: "Failed to fetch user details" });
  }
};

export const updatedUserProfile = async (req, res) => {
  const { id } = req.params;
  const requestingUserId = req.user.id;
  const { bio, avatar_url } = req.body;

  if (id !== requestingUserId) {
    return res.status(403).json({ error: "Unauthorized access" });
  }

  const updates = [];
  const values = [];
  let paramIndex = 1;

  if (bio !== undefined) {
    updates.push(`bio = $${paramIndex++}`);
    values.push(bio);
  }
  if (avatar_url !== undefined) {
    updates.push(`avatar_url = $${paramIndex++}`);
    values.push(avatar_url);
  }

  if (updates.length === 0) {
    return res.status(400).json({ error: "No fields provided for update" });
  }

  const query = `
    UPDATE users SET ${updates.join(", ")}
    WHERE id = $${paramIndex}
    RETURNING id, username, email, bio, avatar_url, status, created_at
    `;
  values.push(id);

  try {
    const result = await pool.query(query, values);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error updating user profile:", err);
    res.status(500).json({ error: "Failed to update profile" });
  }
};
