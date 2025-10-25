import { useState } from "react";
import Sidebar from "../components/Sidebar";

const DashboardLayout = ({ children }) => {
  // State to control sidebar visibility on mobile
  const [isOpen, setIsOpen] = useState(false);

  // Calculate dynamic margin for main content
  // mobile: ml-0 (when sidebar closed), ml-56 (when open)
  // desktop (md+): ml-64 always
  const mainMargin = `${isOpen ? "ml-56" : "ml-0"} md:ml-64`;

  return (
    <div className="min-h-screen flex bg-gray-50 transition-all duration-300">
      {/* Sidebar */}
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

      {/* Main Content */}
      <main
        className={`flex-1 ${mainMargin} p-6 transition-all duration-300`}
      >
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
