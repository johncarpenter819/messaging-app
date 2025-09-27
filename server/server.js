import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, ".env") });

import authRoutes from "./src/routes/auth.js";

console.log(
  "DB_PASSWORD Check:",
  process.env.DB_PASSWORD ? "Loaded (String" : "NOT Loaded (Error"
);

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
