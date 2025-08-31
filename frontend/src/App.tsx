// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

// Public pages
import LandingPage from "./pages/LandingPage";
import Signup from "./pages/Signup";
import Login from "./pages/Login";

// Dashboards (role-based)
import DonorDashboard from "./pages/Donors/Dashboard";
import VolunteerDashboard from "./pages/Volunteers/Dashboard";
import ReceiverDashboard from "./pages/Receivers/Dashboard";
import AdminDashboard from "./pages/Admin/Dashboard";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        {/* Role-based protected dashboards */}
        <Route
          path="/Donors/dashboard"
          element={
            <ProtectedRoute allowedRoles={["donor"]}>
              <DonorDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Volunteers/dashboard"
          element={
            <ProtectedRoute allowedRoles={["volunteer"]}>
              <VolunteerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Receivers/dashboard"
          element={
            <ProtectedRoute allowedRoles={["receiver"]}>
              <ReceiverDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}
