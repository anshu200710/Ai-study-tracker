import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthContext } from "./context/AuthContext.jsx";
import Login from "./pages/Login.jsx";
import DashboardLayout from "./layouts/DashboardLayout.jsx";
import Courses from "./pages/Courses.jsx";
import ChatbotPage from "./pages/ChatbotPage.jsx";
import Settings from "./pages/Settings.jsx";

const Dashboard = () => <h1 className="text-center mt-10">Welcome to Dashboard 🎉</h1>;

const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  return user ? children : <Navigate to="/login" />;
};

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <DashboardLayout><Dashboard /></DashboardLayout>
    </ProtectedRoute>
  }
/>
<Route
  path="/courses"
  element={
    <ProtectedRoute>
      <DashboardLayout><Courses/></DashboardLayout>
    </ProtectedRoute>
  }
/>
<Route
  path="/chatbot"
  element={
    <ProtectedRoute>
      <DashboardLayout> <ChatbotPage/> </DashboardLayout>
    </ProtectedRoute>
  }
/>
<Route
  path="/settings"
  element={
    <ProtectedRoute>
      <DashboardLayout><Settings/></DashboardLayout>
    </ProtectedRoute>
  }
/>
      <Route path="*" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
};

export default App;
