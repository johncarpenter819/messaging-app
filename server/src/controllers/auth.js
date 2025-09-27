import pkg from "pg";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const { Pool } = pkg;

let pool;

const initializePool = () => {
  if (pool) return pool;

  if (
    !process.env.DB_HOST ||
    !process.env.DB_PASSWORD ||
    !process.env.DB_USER
  ) {
    console.error(
      "FATAL ERROR: One or more critical database envir vars (HOST, USER, PASSWORD are missing or undefinded"
    );
    console.error(`DB_HOST value is: [${process.env.DB_HOST}]`);

    throw new Error("Missing critical db envir varbs. Check server logs");
  }

  pool = new Pool({
    user: String(process.env.DB_USER).trim(),
    password: String(process.env.DB_PASSWORD || "").trim(),
    host: String(process.env.DB_HOST).trim(),
    database: String(process.env.DB_NAME).trim(),
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    ssl: { rejectUnauthorized: false },
  });

  return pool;
};

export const signup = async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password)
    return res.status(400).json({ error: "All fields required" });

  try {
    const db = initializePool();

    const existingUser = await db.query("SELECT id FROM users WHERE email=$1", [
      email,
    ]);
    if (existingUser.rows.length > 0) {
      return res.status(409).json({ error: "User already exists" });
    }
    const hashed = await bcrypt.hash(password, 10);

    const result = await db.query(
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
    const db = initializePool();

    const result = await db.query("SELECT * FROM users WHERE email=$1", [
      email,
    ]);
    const user = result.rows[0];
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({ token, user: { id: user.id, username: user.username } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
};
