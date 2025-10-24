import { NavLink, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Home, BookOpen, MessageCircle, Settings, LogOut } from "lucide-react";

const Sidebar = () => {
  const { user, logout } = useContext(AuthContext); // ✅ include user here
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const linkClasses = ({ isActive }) =>
    `flex items-center gap-3 p-3 rounded-lg hover:bg-blue-100 transition ${
      isActive ? "bg-blue-200 font-semibold" : "text-gray-700"
    }`;

  return (
    <aside className="w-64 h-screen bg-white shadow-md p-4 flex flex-col justify-between fixed">
      <div>
        <h1 className="text-2xl font-bold text-blue-600 mb-8">AI Learn</h1>

        <nav className="flex flex-col gap-2">
          <NavLink to="/dashboard" className={linkClasses}>
            <Home size={20} /> Dashboard
          </NavLink>

          <NavLink to="/courses" className={linkClasses}>
            <BookOpen size={20} /> Courses
          </NavLink>

          <NavLink to="/my-courses" className={linkClasses}>
            <BookOpen size={20} /> My Courses
          </NavLink>

          <NavLink to="/chatbot" className={linkClasses}>
            <MessageCircle size={20} /> Chatbot
          </NavLink>

          <NavLink to="/settings" className={linkClasses}>
            <Settings size={20} /> Settings
          </NavLink>

          {/* ✅ Show admin panel only if user.role === "admin" */}
          {user?.role === "admin" && (
            <NavLink to="/admin/courses" className={linkClasses}>
              <Settings size={20} /> Admin Panel
            </NavLink>
          )}
        </nav>
      </div>

      <button
        onClick={handleLogout}
        className="flex items-center gap-3 p-3 text-red-600 hover:bg-red-100 rounded-lg transition"
      >
        <LogOut size={20} /> Logout
      </button>
    </aside>
  );
};

export default Sidebar;
