import express from "express";
import { getContacts } from "../controllers/contacts.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/", authenticateToken, getContacts);

export default router;
