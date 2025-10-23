import Progress from "../models/Progress.js";

const analyticsService = async (userId) => {
  const progress = await Progress.find({ user: userId }).populate("course");
  
  const summary = progress.map((p) => ({
    course: p.course.title,
    progressPercent: p.progressPercent,
    averageQuizScore: p.quizScores.length
      ? p.quizScores.reduce((a, b) => a + b.score, 0) / p.quizScores.length
      : 0,
  }));

  return summary;
};

export default analyticsService;
