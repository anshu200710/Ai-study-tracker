import express from "express";
import { askQuestion } from "../controllers/chatController.js";
import protect from "../middleware/authmiddleware.js";

const router = express.Router();

router.post("/ask", protect, askQuestion);

export default router;
