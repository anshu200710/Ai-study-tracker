import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ProgressChart = ({ progress }) => {
  const data = {
    labels: progress.map(p => p.course),
    datasets: [
      {
        label: "Progress (%)",
        data: progress.map(p => p.progressPercent),
        backgroundColor: "rgba(59, 130, 246, 0.6)",
      },
    ],
  };

  return <Bar data={data} />;
};

export default ProgressChart;
