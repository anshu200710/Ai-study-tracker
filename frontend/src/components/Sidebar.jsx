// src/components/Sidebar.jsx
import React, { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Home,
  BookOpen,
  MessageCircle,
  Settings,
  LogOut,
  Menu,
  X,
  Shield,
} from "lucide-react";
import { AuthContext } from "../context/AuthContext";

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
    setIsOpen(false); // close on mobile after logout
  };

  // Handles click on any NavLink — closes sidebar only on mobile
  const handleNavClick = () => {
    if (window.innerWidth < 768) {
      setIsOpen(false);
    }
  };

  const linkClasses = ({ isActive }) =>
    `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors duration-150 ${
      isActive
        ? "bg-blue-100 text-blue-700 font-medium"
        : "text-gray-700 hover:bg-gray-100"
    }`;

  const sidebarWidthClasses = isOpen ? "w-56" : "w-16";
  const mobileTranslate = isOpen
    ? "translate-x-0"
    : "-translate-x-full md:translate-x-0";

  return (
    <>
      {/* Mobile toggle button (visible on small screens) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-50 bg-white p-2 rounded-lg shadow-sm hover:bg-gray-100 transition"
        aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
      >
        {isOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-white shadow-md flex flex-col justify-between z-40 transition-all duration-300 overflow-hidden
        ${sidebarWidthClasses} md:w-64 ${mobileTranslate}`}
      >
        {/* Top */}
        <div className="p-4 flex flex-col gap-6">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-blue-50">
              <span className="text-blue-600 font-bold">AI</span>
            </div>
            <span
              className={`text-lg font-semibold text-blue-600 truncate transition-all duration-200
              ${isOpen ? "opacity-100 max-w-[200px]" : "opacity-0 max-w-0 md:opacity-100 md:max-w-full"}`}
            >
              AI Learn
            </span>
          </div>

          {/* Nav */}
          <nav className="flex flex-col gap-2">
            <NavLink to="/dashboard" className={linkClasses} onClick={handleNavClick}>
              <Home size={18} />
              <span
                className={`text-sm transition-opacity duration-200 ${
                  isOpen ? "opacity-100" : "opacity-0 md:opacity-100"
                }`}
              >
                Dashboard
              </span>
            </NavLink>

            <NavLink to="/courses" className={linkClasses} onClick={handleNavClick}>
              <BookOpen size={18} />
              <span
                className={`text-sm transition-opacity duration-200 ${
                  isOpen ? "opacity-100" : "opacity-0 md:opacity-100"
                }`}
              >
                Courses
              </span>
            </NavLink>

            <NavLink to="/my-courses" className={linkClasses} onClick={handleNavClick}>
              <BookOpen size={18} />
              <span
                className={`text-sm transition-opacity duration-200 ${
                  isOpen ? "opacity-100" : "opacity-0 md:opacity-100"
                }`}
              >
                My Courses
              </span>
            </NavLink>

            <NavLink to="/chatbot" className={linkClasses} onClick={handleNavClick}>
              <MessageCircle size={18} />
              <span
                className={`text-sm transition-opacity duration-200 ${
                  isOpen ? "opacity-100" : "opacity-0 md:opacity-100"
                }`}
              >
                Chatbot
              </span>
            </NavLink>

            <NavLink to="/settings" className={linkClasses} onClick={handleNavClick}>
              <Settings size={18} />
              <span
                className={`text-sm transition-opacity duration-200 ${
                  isOpen ? "opacity-100" : "opacity-0 md:opacity-100"
                }`}
              >
                Settings
              </span>
            </NavLink>

            {user?.role === "admin" && (
              <NavLink to="/admin/courses" className={linkClasses} onClick={handleNavClick}>
                <Shield size={18} />
                <span
                  className={`text-sm transition-opacity duration-200 ${
                    isOpen ? "opacity-100" : "opacity-0 md:opacity-100"
                  }`}
                >
                  Admin Panel
                </span>
              </NavLink>
            )}
          </nav>
        </div>

        {/* Bottom: logout */}
        <div className="p-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 transition"
          >
            <LogOut size={18} />
            <span
              className={`text-sm transition-opacity duration-200 ${
                isOpen ? "opacity-100" : "opacity-0 md:opacity-100"
              }`}
            >
              Logout
            </span>
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-30 z-30 md:hidden"
          aria-hidden="true"
        />
      )}
    </>
  );
};

export default Sidebar;
