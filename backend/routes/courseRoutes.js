// routes/courseRoutes.js
import express from "express";
import protect from "../middleware/authMiddleware.js";
import adminOnly from "../middleware/adminMiddleware.js";
import {
  createCourse,
  getAllCourses,
  getCourseById,
  enrollCourse,
  getEnrolledCourses,
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

export default router;
