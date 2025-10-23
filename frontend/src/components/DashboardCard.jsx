const DashboardCard = ({ title, value }) => {
  return (
    <div className="bg-white shadow rounded p-4 m-2 w-60">
      <h3 className="font-bold text-lg">{title}</h3>
      <p className="text-2xl mt-2">{value}</p>
    </div>
  );
};

export default DashboardCard;
