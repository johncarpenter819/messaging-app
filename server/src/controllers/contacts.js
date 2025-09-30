import pool from "../config/db.js";

export const getContacts = async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await pool.query(
      `SELECT id, username FROM users WHERE id != $1 ORDER BY username ASC`,
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching contacts:", err);
    res.status(500).json({ error: "Failed to fetch contacts" });
  }
};
