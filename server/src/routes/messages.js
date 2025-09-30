import express from "express";
import {
  getMessagesByConversation,
  createMessage,
} from "../controllers/messages.js";

const router = express.Router();

router.get("/:conversationId", getMessagesByConversation);
router.post("/", createMessage);

export default router;
