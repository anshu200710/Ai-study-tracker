import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthContext } from "./context/AuthContext.jsx";

// Pages
import Login from "./pages/Login.jsx";
import DashboardLayout from "./layouts/DashboardLayout.jsx";
import Courses from "./pages/Courses.jsx";
import CourseDetail from "./pages/CourseDetail.jsx";
import MyCourses from "./pages/MyCourses.jsx";
import AdminCourses from "./pages/AdminCourses.jsx";
import ChatbotPage from "./pages/ChatbotPage.jsx";
import Settings from "./pages/Settings.jsx";
import AdminCreateCourse from "./components/AdminCreateCourse.jsx";
import CourseContentPage from "./pages/CourseContentPage.jsx";

// Dashboard placeholder
const Dashboard = () => (
  <h1 className="text-center mt-10 text-2xl font-semibold">
    Welcome to Dashboard 🎉
  </h1>
);

// ✅ Extended ProtectedRoute
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <Navigate to="/login" />;
  }

  // If adminOnly and user is not admin
  if (adminOnly && user.role !== "admin") {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

const App = () => {
  return (
    <Routes>
      {/* Auth */}
      <Route path="/login" element={<Login />} />

      {/* Dashboard */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Dashboard />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* All Courses */}
      <Route
        path="/courses"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Courses />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/courses/:id"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <CourseDetail />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* My Enrolled Courses */}
      <Route
        path="/my-courses"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <MyCourses />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* 🔒 Admin Only Routes */}
      <Route
        path="/admin/courses"
        element={
          <ProtectedRoute adminOnly={true}>
            <DashboardLayout>
              <AdminCourses />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/courses/create"
        element={
          <ProtectedRoute adminOnly={true}>
            <DashboardLayout>
              <AdminCreateCourse />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* Chatbot */}
      <Route
        path="/chatbot"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <ChatbotPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* Settings */}
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Settings />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route path="/courses/:id/content" element={
        <ProtectedRoute>
            <DashboardLayout>
              <CourseContentPage/>
            </DashboardLayout>
          </ProtectedRoute>} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
};

export default App;
