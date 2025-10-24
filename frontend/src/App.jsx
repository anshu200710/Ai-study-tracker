import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthContext } from "./context/AuthContext.jsx";
import Login from "./pages/Login.jsx";
import DashboardLayout from "./layouts/DashboardLayout.jsx";
import Courses from "./pages/Courses.jsx";
import CourseDetail from "./pages/CourseDetail.jsx";
import MyCourses from "./pages/MyCourses.jsx";
import AdminCourses from "./pages/AdminCourses.jsx";
import ChatbotPage from "./pages/ChatbotPage.jsx";
import Settings from "./pages/Settings.jsx";
import AdminCreateCourse from "./components/AdminCreateCourse.jsx";

const Dashboard = () => <h1 className="text-center mt-10">Welcome to Dashboard 🎉</h1>;

const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  return user ? children : <Navigate to="/login" />;
};

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      {/* Dashboard */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout><Dashboard /></DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* Courses */}
      <Route
        path="/courses"
        element={
          <ProtectedRoute>
            <DashboardLayout><Courses /></DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/courses/:id"
        element={
          <ProtectedRoute>
            <DashboardLayout><CourseDetail /></DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* Enrolled Courses */}
      <Route
        path="/my-courses"
        element={
          <ProtectedRoute>
            <DashboardLayout><MyCourses /></DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* Admin Only */}
      <Route
  path="/admin/courses/create"
  element={
    <ProtectedRoute adminOnly={true}>
      <DashboardLayout><AdminCreateCourse/></DashboardLayout>
    </ProtectedRoute>
  }
/>

      {/* Chatbot & Settings */}
      <Route
        path="/chatbot"
        element={
          <ProtectedRoute>
            <DashboardLayout><ChatbotPage /></DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <DashboardLayout><Settings /></DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
};

export default App;
