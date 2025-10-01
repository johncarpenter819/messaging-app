import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../config/db.js";

export const signup = async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password)
    return res.status(400).json({ error: "All fields required" });

  try {
    const existingUser = await pool.query(
      "SELECT id FROM users WHERE email=$1",
      [email]
    );
    if (existingUser.rows.length > 0) {
      return res.status(409).json({ error: "User already exists" });
    }
    const hashed = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users (username, email, password_hash)
             VALUES ($1, $2, $3) RETURNING id, username, email`,
      [username, email, hashed]
    );

    res.json({ user: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: "Email and password required" });

  try {
    const result = await pool.query("SELECT * FROM users WHERE email=$1", [
      email,
    ]);
    const user = result.rows[0];
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(401).json({ error: "Invalid credentials" });

    if (!process.env.JWT_SECRET) {
      console.error("Fatal ERROR: JWT_SECRET envir var is missing.");
      return res
        .status(500)
        .json({ error: "Server config error: JWT missing" });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({ token, userId: user.id, username: user.username });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
};
