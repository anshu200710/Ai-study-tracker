// controllers/courseController.js
import Course from "../models/Course.js";
import OpenAI from "openai";



const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});



// ✅ Admin: create new course
export const createCourse = async (req, res) => {
  try {
    const { title, description, videoUrl, pdfUrl, difficulty } = req.body;

    if (!title || !videoUrl)
      return res.status(400).json({ message: "Title and Video URL are required" });

    // If admin, skip ObjectId requirement
    const createdBy =
      req.user.role === "admin" ? null : req.user._id; // optional: store null for admin

    const course = await Course.create({
      title,
      description,
      videoUrl,
      pdfUrl,
      difficulty,
      createdBy,
    });

    res.status(201).json(course);
  } catch (error) {
    console.error(error); // log full error
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

// Admin: delete course
export const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });

    await course.deleteOne();
    res.json({ message: "Course deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting course", error: error.message });
  }
};


// Admin: update course
export const updateCourse = async (req, res) => {
  try {
    const { title, description, videoUrl, pdfUrl, difficulty } = req.body;

    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });

    course.title = title || course.title;
    course.description = description || course.description;
    course.videoUrl = videoUrl || course.videoUrl;
    course.pdfUrl = pdfUrl || course.pdfUrl;
    course.difficulty = difficulty || course.difficulty;

    await course.save();
    res.json(course);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating course", error: error.message });
  }
};



// courseController.js

export const generateFlashcards = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });

    const prompt = `
Generate 5 study flashcards based on the following course:
Title: ${course.title}
Description: ${course.description}

Respond strictly as a JSON array like this:
[
  {"question": "Q1", "answer": "A1"},
  {"question": "Q2", "answer": "A2"}
]
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    let text = completion.choices[0].message.content;

    // Remove markdown code blocks if present
    text = text.replace(/```json|```/g, "").trim();

    // Parse JSON safely
    const flashcards = JSON.parse(text);

    // Append new flashcards
    course.flashcards = [...(course.flashcards || []), ...flashcards];
    await course.save();

    res.json({ flashcards }); // return only new flashcards
  } catch (error) {
    console.error("Flashcards generation error:", error);
    res.status(500).json({ message: "Error generating flashcards", error: error.message });
  }
};


export const generateMCQs = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });

    const prompt = `
Generate 5 multiple-choice questions (MCQs) from this course:
Title: ${course.title}
Description: ${course.description}

Each MCQ should have:
- "question"
- "options" (array of 4 choices)
- "correctAnswer"

Respond strictly as a JSON array like this:
[
  {
    "question": "Q1",
    "options": ["A", "B", "C", "D"],
    "correctAnswer": "A"
  }
]
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    let text = completion.choices[0].message.content;

    // Remove code blocks if present
    text = text.replace(/```json|```/g, "").trim();

    // Parse safely
    const mcqs = JSON.parse(text);

    // Append to existing MCQs
    course.mcqs = [...(course.mcqs || []), ...mcqs];
    await course.save();

    res.json({ mcqs }); // return only newly generated MCQs
  } catch (error) {
    console.error("MCQs generation error:", error);
    res.status(500).json({ message: "Error generating MCQs", error: error.message });
  }
};




