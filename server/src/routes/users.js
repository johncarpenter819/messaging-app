import express from "express";
import { authenticateToken } from "../middleware/auth.js";
import { getUserDetails, updatedUserProfile } from "../controllers/users.js";

const router = express.Router();

router.get("/:id", authenticateToken, getUserDetails);

router.put("/:id", authenticateToken, updatedUserProfile);

export default router;
