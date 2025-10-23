import express from "express";
import { getAllCourses, getRecommendedCourses } from "../controllers/courseController.js";
import protect from "../middleware/authmiddleware.js";

const router = express.Router();

router.get("/", protect, getAllCourses);
router.get("/recommended", protect, getRecommendedCourses);

export default router;
