// backend/routes/quizRoutes.js
import express from "express";
import { createQuiz, getQuizzesForCourse } from "../controllers/quizController.js";
import protect from "../middleware/authmiddleware.js";
const router = express.Router();

router.post("/generate", protect, createQuiz);
router.get("/", protect, getQuizzesForCourse);

export default router;
