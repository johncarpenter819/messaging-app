import pool from "../config/db.js";

export const getConversations = async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await pool.query(
      `
     SELECT
     c.id,
     c.is_group,
     c.title,
     (
      SELECT cm2.user_id
      FROM conversation_members cm2
      WHERE cm2.conversation_id = c.id
      AND cm2.user_id != $1
      LIMIT 1
     ) AS other_user_id,
      (
      SELECT u.username
      FROM conversation_members cm2
      JOIN users u ON u.id = cm2.user_id
      WHERE cm2.conversation_id = c.id
      AND cm2.user_id != $1
      LIMIT 1
      ) AS name
       FROM conversations c
       JOIN conversation_members cm1 ON c.id = cm1.conversation_id
       WHERE cm1.user_id = $1
       ORDER BY c.created_at DESC
     `,
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching conversations:", err);
    res.status(500).json({ error: "Failed to fetch conversations" });
  }
};
