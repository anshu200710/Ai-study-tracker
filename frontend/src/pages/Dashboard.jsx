// pages/Dashboard.jsx
import { useEffect, useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { ProgressContext } from "../context/ProgressContext";
import { getProgress } from "../api/progressApi";
import { Pie, Line, Bar } from "react-chartjs-2";

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const { progressInfo, updateProgressState } = useContext(ProgressContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      if (!user?.token) return;
      const data = await getProgress(user.token);
      updateProgressState(data);
      setLoading(false);
    };
    fetchProgress();
  }, [user]);

  if (loading) return <p>Loading...</p>;

  const { totalCourses, completedCourses, runningCourses, avgProgress, dailyActivity, learningSpeed, progressData } = progressInfo;

  const pieData = {
    labels: ["Completed", "Running"],
    datasets: [{ data: [completedCourses, runningCourses], backgroundColor: ["#10B981", "#3B82F6"] }],
  };

  const lineData = {
    labels: Object.keys(dailyActivity),
    datasets: [{ label: "Daily Quiz Attempts", data: Object.values(dailyActivity), borderColor: "#F59E0B", backgroundColor: "rgba(245,158,11,0.2)", tension: 0.3 }],
  };

  const barData = {
    labels: learningSpeed.map(l => l.course),
    datasets: [{ label: "% Progress per Day", data: learningSpeed.map(l => l.speed), backgroundColor: "#3B82F6" }],
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <Pie data={pieData} />
      <Line data={lineData} />
      <Bar data={barData} />
      <div>
        {progressData.map(p => (
          <div key={p._id}>
            <p>{p.course.title}</p>
            <div style={{ width: "100%", background: "#eee" }}>
              <div style={{ width: `${p.progressPercent}%`, background: "#3B82F6", height: 20 }} />
            </div>
            <p>{p.progressPercent}% completed</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
