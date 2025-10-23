import { useEffect, useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { ProgressContext } from "../context/ProgressContext";
import { getProgress } from "../api/progressApi";
import DashboardCard from "../components/DashboardCard";
import ProgressChart from "../components/ProgressChart";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const { progressData, updateProgressState } = useContext(ProgressContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      if (!user || !user.token) return;
      const data = await getProgress(user.token);
      updateProgressState(data);
      setLoading(false);
    };
    fetchProgress();
  }, [user]);

  if (loading) return <p>Loading...</p>;

  const pieData = {
    labels: ["Active", "Completed", "Pending"],
    datasets: [
      {
        data: [12, 19, 7],
        backgroundColor: ["#3B82F6", "#10B981", "#F59E0B"],
      },
    ],
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

      {/* Top Cards */}
      <div className="flex flex-wrap gap-4">
        <DashboardCard title="Accepted" value="2,340" />
        <DashboardCard title="In Contract" value="1,782" />
        <DashboardCard title="In Approval" value="1,596" />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <div className="col-span-2 bg-white shadow rounded-lg p-4">
          <h2 className="font-bold mb-2">Learning Progress</h2>
          <ProgressChart
            progress={progressData.map((p) => ({
              course: p.course.title,
              progressPercent: p.progressPercent,
            }))}
          />
        </div>
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="font-bold mb-2">Activity Breakdown</h2>
          <Pie data={pieData} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
