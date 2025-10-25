// components/Quiz.jsx
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { updateProgress } from "../api/progressApi";

const Quiz = ({ courseId, score, progressPercent }) => {
  const { user } = useContext(AuthContext);

  const handleQuizComplete = async () => {
    if (!user?.token) return;
    await updateProgress(user.token, { courseId, progressPercent, quizScore: score });
  };

  return <button onClick={handleQuizComplete}>Complete Quiz</button>;
};

export default Quiz;
