import mongoose from "mongoose";

const flashcardSchema = new mongoose.Schema({
  question: String,
  answer: String,
});

const mcqSchema = new mongoose.Schema({
  question: String,
  options: [String],
  correctAnswer: String,
});

const courseSchema = new mongoose.Schema({
  title: String,
  description: String,
  videoUrl: String,
  pdfUrl: String,
  difficulty: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  enrolledUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

  // AI-generated content
  flashcards: [flashcardSchema],
  mcqs: [mcqSchema],
});

const Course = mongoose.model("Course", courseSchema);
export default Course;
