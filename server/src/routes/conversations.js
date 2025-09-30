import express from "express";
import { getConversations } from "../controllers/conversations.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/", authenticateToken, getConversations);

export default router;
