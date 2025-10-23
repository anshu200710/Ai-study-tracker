import Progress from "../models/Progress.js";
import Course from "../models/Course.js";

// Get progress of logged-in user
export const getProgress = async (req, res) => {
  try {
    const progress = await Progress.find({ user: req.user.id }).populate("course");
    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: "Error fetching progress", error: error.message });
  }
};

// Update progress after quiz or lesson
export const updateProgress = async (req, res) => {
  try {
    const { courseId, progressPercent, quizScore } = req.body;

    let progress = await Progress.findOne({ user: req.user.id, course: courseId });

    if (!progress) {
      progress = await Progress.create({
        user: req.user.id,
        course: courseId,
        progressPercent,
        quizScores: quizScore ? [{ date: new Date(), score: quizScore }] : [],
      });
    } else {
      progress.progressPercent = progressPercent || progress.progressPercent;
      if (quizScore) progress.quizScores.push({ date: new Date(), score: quizScore });
      await progress.save();
    }

    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: "Error updating progress", error: error.message });
  }
};
