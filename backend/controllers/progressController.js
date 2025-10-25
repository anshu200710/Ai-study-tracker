// controllers/progressController.js
import Progress from "../models/Progress.js";

export const updateProgress = async (req, res) => {
  try {
    const { courseId, progressPercent, quizScore } = req.body;
    if (!courseId) return res.status(400).json({ message: "courseId required" });
    if (!req.user?.id) return res.status(401).json({ message: "Unauthorized" });

    let progress = await Progress.findOne({ user: req.user.id, course: courseId });

    if (!progress) {
      progress = new Progress({
        user: req.user.id,
        course: courseId,
        progressPercent: progressPercent || 0,
        quizScores: quizScore ? [{ date: new Date(), score: Number(quizScore) }] : [],
      });
      await progress.save();
    } else {
      if (progressPercent !== undefined) progress.progressPercent = progressPercent;
      if (quizScore !== undefined) progress.quizScores.push({ date: new Date(), score: Number(quizScore) });
      await progress.save();
    }

    res.json(progress);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};




export const getProgress = async (req, res) => {
  try {
    const progressData = await Progress.find({ user: req.user.id }).populate("course", "title").lean();

    const totalCourses = progressData.length;
    const completedCourses = progressData.filter(p => p.progressPercent === 100).length;
    const runningCourses = totalCourses - completedCourses;
    const avgProgress = totalCourses
      ? Math.round(progressData.reduce((sum, p) => sum + p.progressPercent, 0) / totalCourses)
      : 0;

    // Daily quiz activity
    const dailyActivity = {};
    progressData.forEach(p => {
      p.quizScores.forEach(q => {
        const date = new Date(q.date).toISOString().split("T")[0];
        dailyActivity[date] = (dailyActivity[date] || 0) + 1;
      });
    });

    // Learning speed (% per day)
    const learningSpeed = progressData.map(p => {
      const days = Math.max((new Date() - new Date(p.createdAt)) / (1000*60*60*24), 1);
      return { course: p.course.title, speed: Math.round(p.progressPercent / days) };
    });

    res.json({ progressData, totalCourses, completedCourses, runningCourses, avgProgress, dailyActivity, learningSpeed });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

