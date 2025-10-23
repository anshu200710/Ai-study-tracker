import Sidebar from "../components/Sidebar";

const DashboardLayout = ({ children }) => {
  return (
    <div className="flex">
      <Sidebar />
      <main className="ml-64 bg-gray-50 min-h-screen w-full p-6">{children}</main>
    </div>
  );
};

export default DashboardLayout;
