// backend/models/Quiz.js
import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  type: { type: String, enum: ["mcq","tf","short"], default: "mcq" },
  question: String,
  options: [String], // for mcq
  answer: mongoose.Schema.Types.Mixed, // number for mcq (index), boolean for tf, string for short
  explanation: String,
});

const quizSchema = new mongoose.Schema({
  title: String,
  course: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
  generatedByAI: { type: Boolean, default: true },
  questions: [questionSchema],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });

export default mongoose.model("Quiz", quizSchema);
