// backend/services/recommendationService.js (enhanced)
import Course from "../models/Course.js";
import Progress from "../models/Progress.js";
import openai from "../config/openai.js";

const getCourseEmbeddings = async (text) => {
  const r = await openai.embeddings.create({ model: "text-embedding-3-small", input: text });
  return r.data[0].embedding;
};

const cosine = (a, b) => {
  const dot = a.reduce((s, v, i) => s + v * b[i], 0);
  const magA = Math.sqrt(a.reduce((s, v) => s + v * v, 0));
  const magB = Math.sqrt(b.reduce((s, v) => s + v * v, 0));
  return dot / (magA * magB);
};

const recommendationService = async (userId) => {
  const progress = await Progress.find({ user: userId }).populate("course");
  const completedIds = progress.filter(p => p.progressPercent >= 80).map(p => p.course._id.toString());
  const userText = progress.map(p => `${p.course.title} ${p.progressPercent}%`).join(" ; ");

  // simple: embed userText
  const userEmb = await getCourseEmbeddings(userText || "no history");

  // get all courses
  const courses = await Course.find({});
  // compute embeddings for each course (caching recommended)
  // NOTE: expensive: cache embeddings in Course model (course.embedding)
  const scored = [];
  for (const c of courses) {
    if (completedIds.includes(c._id.toString())) continue;
    if (!c.embedding) {
      const emb = await getCourseEmbeddings(`${c.title}. ${c.content || ""}`);
      // optionally save embedding to Course document
      c.embedding = emb;
      await c.save();
    }
    const score = cosine(userEmb, c.embedding);
    scored.push({ course: c, score });
  }
  scored.sort((a,b) => b.score - a.score);
  return scored.slice(0,5).map(s => s.course);
};

export default recommendationService;
