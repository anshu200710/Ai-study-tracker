// routes/courseRoutes.js
import express from "express";
import protect from "../middleware/authmiddleware.js";
import adminOnly from "../middleware/adminMiddleware.js";
// import { generateFlashcards, generateMCQs } from "../controllers/aiContentController.js";
import {
  createCourse,
  getAllCourses,
  getCourseById,
  enrollCourse,
  getEnrolledCourses,
  updateCourse, deleteCourse,
  generateFlashcards, generateMCQs
} from "../controllers/courseController.js";


const router = express.Router();

// Student operations first (specific routes first!)
router.get("/enrolled/me", protect, getEnrolledCourses); // ✅ specific route before :id
router.post("/enroll/:id", protect, enrollCourse);

// Course routes
router.get("/", protect, getAllCourses);
router.get("/:id", protect, getCourseById);

// Admin-only
router.post("/", protect, adminOnly, createCourse);
router.put("/:id", protect, adminOnly, updateCourse);
router.delete("/:id", protect, adminOnly, deleteCourse);


router.post("/:id/generate-flashcards", protect, generateFlashcards);
router.post("/:id/generate-mcqs", protect, generateMCQs);

export default router;
