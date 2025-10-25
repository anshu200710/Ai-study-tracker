// models/Progress.js
import mongoose from "mongoose";

const progressSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  progressPercent: { type: Number, default: 0 },
  quizScores: [{ date: Date, score: Number }],
  recommendations: [String],
}, { timestamps: true });

const Progress = mongoose.model("Progress", progressSchema);
export default Progress;
