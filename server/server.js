import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./src/routes/auth.js";
import messagesRoute from "./src/routes/messages.js";
import conversationsRoute from "./src/routes/conversations.js";
import contactsRoute from "./src/routes/contacts.js";
import usersRoutes from "./src/routes/users.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, ".env") });

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/messages", messagesRoute);
app.use("/api/conversations", conversationsRoute);
app.use("/api/contacts", contactsRoute);
app.use("/api/users", usersRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
