import Course from "../models/Course.js";
import Progress from "../models/Progress.js";
import recommendationService from "../services/recommendationService.js";

// Get all courses
export const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find({});
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: "Error fetching courses", error: error.message });
  }
};

// Get recommended courses for a user
export const getRecommendedCourses = async (req, res) => {
  try {
    const userId = req.user.id;
    const recommended = await recommendationService(userId);
    res.json(recommended);
  } catch (error) {
    res.status(500).json({ message: "Error fetching recommendations", error: error.message });
  }
};
