import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String },
  difficulty: { type: String, enum: ["beginner", "intermediate", "advanced"], default: "beginner" },
}, { timestamps: true });

const Course = mongoose.model("Course", courseSchema);
export default Course;
