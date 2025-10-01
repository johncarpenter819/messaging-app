import express from "express";
import pool from "../config/db.js";

export const getMessagesByConversation = async (req, res) => {
  const { conversationId } = req.params;

  try {
    const result = await pool.query(
      `SELECT m.*, u.username AS sender_name
            FROM messages m
            JOIN users u ON m.sender_id = u.id
            WHERE m.conversation_id = $1
            ORDER BY created_at ASC`,
      [conversationId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching messages by conversation:", err);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
};

export const createMessage = async (req, res) => {
  let { conversation_id, sender_id, receiver_id, content } = req.body;

  if (
    !sender_id ||
    !receiver_id ||
    !content ||
    typeof sender_id !== "string" ||
    typeof receiver_id !== "string"
  ) {
    return res.status(400).json({
      error:
        " conversation_id, sender_id, receiver_id, and content are required",
    });
  }

  if (conversation_id === undefined || conversation_id === "") {
    conversation_id = null;
  }

  try {
    if (!conversation_id) {
      const findConvResult = await pool.query(
        `SELECT cm1.conversation_id
        FROM conversation_members cm1
        JOIN conversation_members cm2 ON cm1.conversation_id = cm2.conversation_id
        JOIN conversations c ON cm1.conversation_id = c.id
        WHERE c.is_group = FALSE
        AND cm1.user_id = $1
        AND cm2.user_id = $2
        AND (
        SELECT COUNT(*) FROM conversation_members cm_count
        WHERE cm_count.conversation_id = cm1.conversation_id
        ) = 2`,
        [sender_id, receiver_id]
      );

      if (findConvResult.rows.length > 0) {
        conversation_id = findConvResult.rows[0].conversation_id;
      } else {
        const createConvResult = await pool.query(
          `INSERT INTO conversations (title, is_group)
          VALUES (NULL, FALSE)
          RETURNING id`
        );
        conversation_id = createConvResult.rows[0].id;

        await pool.query(
          `INSERT INTO conversation_members (conversation_id, user_id)
          VALUES ($1, $2)`,
          [conversation_id, sender_id]
        );

        await pool.query(
          `INSERT INTO conversation_members (conversation_id, user_id)
          VALUES ($1, $2)`,
          [conversation_id, receiver_id]
        );
      }
    }

    const result = await pool.query(
      `INSERT INTO messages (conversation_id, sender_id, content)
            VALUES ($1, $2, $3)
            RETURNING *`,
      [conversation_id, sender_id, content]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error creating message:", err);
    res.status(500).json({ error: "Failed to send message" });
  }
};
