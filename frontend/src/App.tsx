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

//Donors
// PostDonation components
import PostDonationList from "./pages/Donors/PostDonation/PostDonationList";
import PostDonationAdd from "./pages/Donors/PostDonation/PostDonationAdd";
import PostDonationEdit from "./pages/Donors/PostDonation/PostDonationEdit";
// MyDonation page
import MyDonation from "./pages/Donors/Mydonation";
// Leaderboard page
import Leaderboard from "./pages/Donors/Leaderboard";

//Admin
//User Management components
import UserList from "./pages/Admin/Users/UserList";
import CreateUser from "./pages/Admin/Users/CreateUser";
import EditUser from "./pages/Admin/Users/EditUser";
//Donation Management components
import DonationList from "./pages/Admin/Donations/DonationList";
import DonationDetails from "./pages/Admin/Donations/DonationDetails";





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

        {/**Donors */}
        {/* PostDonation routes */}
        <Route path="/donors/post-donation/post-donation-list" element={<PostDonationList />} />
        <Route path="/donors/post-donation/post-donation-add" element={<PostDonationAdd />} />
        <Route path="/donors/post-donation/post-donation-edit/:id" element={<PostDonationEdit />} />
        {/* MyDonation route */}
        <Route path="/donor/my-donation" element={<MyDonation />} />
        {/* Leaderboard route */}
        <Route path="/donor/leaderboard" element={<Leaderboard />} />


        {/**Admin */}
        {/* User Management Routes */}
        <Route path="/admin/users" element={<UserList />} />
        <Route path="/admin/users/create" element={<CreateUser />} />
        <Route path="/admin/users/:id/edit" element={<EditUser />} />
        {/* Donation Management Routes */}
        <Route path="/admin/donations" element={<DonationList />} />
        <Route path="/admin/donations/:id" element={<DonationDetails />} />
      </Routes>
    </Router>
  );
}
