// backend/controllers/quizController.js
import { generateQuizFromTopic } from "../services/quizService.js";
import Quiz from "../models/Quiz.js";

export const createQuiz = async (req, res) => {
  try {
    const { courseId, topic, numQuestions } = req.body;
    const quiz = await generateQuizFromTopic({ userId: req.user.id, courseId, topic, numQuestions });
    res.status(201).json(quiz);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Quiz generation failed", error: err.message });
  }
};

export const getQuizzesForCourse = async (req, res) => {
  const { courseId } = req.query;
  const quizzes = await Quiz.find({ course: courseId }).limit(50);
  res.json(quizzes);
};
