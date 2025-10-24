// controllers/courseController.js
import Course from "../models/Course.js";

// ✅ Admin: create new course
export const createCourse = async (req, res) => {
  try {
    const { title, description, videoUrl, pdfUrl, difficulty } = req.body;

    if (!title || !videoUrl)
      return res.status(400).json({ message: "Title and Video URL are required" });

    const course = await Course.create({
      title,
      description,
      videoUrl,
      pdfUrl,
      difficulty,
      createdBy: req.user._id,
    });

    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ message: "Error creating course", error: error.message });
  }
};

// ✅ All users: get all courses
export const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find().populate("createdBy", "name email");
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: "Error fetching courses", error: error.message });
  }
};

// ✅ Student: enroll in a course
export const enrollCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });

    if (!course.enrolledUsers.includes(req.user._id)) {
      course.enrolledUsers.push(req.user._id);
      await course.save();
    }

    res.json({ message: "Enrolled successfully", course });
  } catch (error) {
    res.status(500).json({ message: "Error enrolling in course", error: error.message });
  }
};

// ✅ Student: get enrolled courses
export const getEnrolledCourses = async (req, res) => {
  try {
    const courses = await Course.find({ enrolledUsers: req.user._id });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: "Error fetching enrolled courses", error: error.message });
  }
};

// Get a single course by ID
export const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch course", error: error.message });
  }
};

