// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

// Public pages
import LandingPage from "./pages/LandingPage";
import PublicDonationDetails from "@/pages/PublicDonationDetails";
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
import ViewDonation from "./pages/Donors/ViewDonation";
// Leaderboard page
import Leaderboard from "./pages/Donors/Leaderboard";
// Gamification components
import BadgeDashboard from "./pages/Donors/Gamification/BadgeDashboard";
import ChallengeDashboard from "./pages/Donors/Gamification/ChallengeDashboard";
import DonorStreak from "./pages/Donors/Gamification/DonorStreak";
// Claim Management components
import DonorClaimList from "./pages/Donors/Claims/ClaimList";
import DonorClaimDetails from "./pages/Donors/Claims/ClaimDetails";

//Admin
//User Management components
import UserList from "./pages/Admin/Users/UserList";
import CreateUser from "./pages/Admin/Users/CreateUser";
import EditUser from "./pages/Admin/Users/EditUser";
//Donation Management components
import DonationList from "./pages/Admin/Donations/DonationList";
import DonationDetails from "./pages/Admin/Donations/DonationDetails";
// Claim Delivery Management components 
import ClaimDeliveryList from "./pages/Admin/Claims/ClaimDeliveryList";
import ClaimDeliveryDetails from "./pages/Admin/Claims/ClaimDeliveryDetails";
// Gamification Management components
import BadgeManager from "./pages/Admin/Gamification/BadgeManager";
import DonorsEarned from "./pages/Admin/Gamification/DonorsEarned";
import ChallengeManager from "./pages/Admin/Gamification/ChallengeManager";
import CompletedChallenges from "./pages/Admin/Gamification/CompletedChallenges";
import PointsConfig from "./pages/Admin/Gamification/PointsConfig";
import AdminStreaks from "./pages/Admin/Gamification/AdminStreaks";


//Receivers
// Available Donations page
import ReceiversDonations from "./pages/Receivers/Donations/AvailableDonations";
// View Available Donation page
import ViewAvailableDonation from "./pages/Receivers/Donations/ViewAvailableDonation";
// Approved Donations page
import ApprovedDonations from "./pages/Receivers/RequestDonations/ApprovedDonations";
import ApprovedDonationDetails from "./pages/Receivers/RequestDonations/ApprovedDonationDetails";


// Volunteers
// Volunteer Delivery Tasks page
import VolunteerDeliveryTasks from "./pages/Volunteers/DeliveryTasks";
import DeliveryTaskDetails from "./pages/Volunteers/DeliveryTaskDetails";
// Accepted Tasks page
import AcceptedTasks from "./pages/Volunteers/AcceptedTasks";
import AcceptedTasksDetails from "./pages/Volunteers/AcceptedTasksDetails";




export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/donations/:id" element={<PublicDonationDetails />} />
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
        <Route path="/donors/view-donation/:id" element={<ViewDonation />} />
        {/* Leaderboard route */}
        <Route path="/donor/leaderboard" element={<Leaderboard />} />
        {/* Gamification routes */}
        <Route path="/donor/gamification/badges" element={<BadgeDashboard />} />
        <Route path="/donor/gamification/challenges" element={<ChallengeDashboard />} />
        <Route path="/donor/gamification/streak" element={<DonorStreak />} />
        {/* Claim Management routes */}
        <Route path="/donor/claims" element={<DonorClaimList />} />
        <Route path="/donor/claims/:id" element={<DonorClaimDetails />} />


        {/**Admin */}
        {/* User Management Routes */}
        <Route path="/admin/users" element={<UserList />} />
        <Route path="/admin/users/create" element={<CreateUser />} />
        <Route path="/admin/users/:id/edit" element={<EditUser />} />
        {/* Donation Management Routes */}
        <Route path="/admin/donations" element={<DonationList />} />
        <Route path="/admin/donations/:id" element={<DonationDetails />} />
        {/* Claim Delivery Management Routes */}
        <Route path="/admin/claims" element={<ClaimDeliveryList />} />
        <Route path="/admin/claims/:id" element={<ClaimDeliveryDetails />} />
        {/* Gamification Management*/}
        <Route path="/admin/gamification/badge-manager" element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <BadgeManager />
          </ProtectedRoute>
        }
        />
        <Route path="/admin/gamification/points-config" element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <PointsConfig />
          </ProtectedRoute>
        }
        />
        <Route path="/admin/gamification/challenge-manager" element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <ChallengeManager />
          </ProtectedRoute>
        }
        />
        <Route path="/admin/gamification/earned" element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <DonorsEarned />
          </ProtectedRoute>
        }
        />
        <Route path="/admin/gamification/challenges/completed" element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <CompletedChallenges />
          </ProtectedRoute>
        }
        />
        <Route path="/admin/gamification/streaks" element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminStreaks />
          </ProtectedRoute>
        }
        />


        {/**Receivers */}
        {/* Available Donations route */}
        <Route path="/receivers/donations" element={<ReceiversDonations />} />
        <Route path="/receivers/donations/:id" element={<ViewAvailableDonation />} />
        {/* Approved Donations route */}
        <Route path="/receivers/request-donations" element={<ApprovedDonations />} />
        <Route path="/receivers/claimed-donations/:id" element={<ApprovedDonationDetails />} />


        {/* Volunteer Delivery Tasks */}
        <Route
          path="/volunteers/delivery-tasks"
          element={
            <ProtectedRoute allowedRoles={["volunteer"]}>
              <VolunteerDeliveryTasks />
            </ProtectedRoute>
          }
        />
        <Route
          path="/volunteers/delivery-tasks/:id"
          element={
            <ProtectedRoute allowedRoles={["volunteer"]}>
              <DeliveryTaskDetails />
            </ProtectedRoute>
          }
        />
        {/* Accepted Tasks */}
        <Route
          path="/volunteers/accepted-tasks"
          element={
            <ProtectedRoute allowedRoles={["volunteer"]}>
              <AcceptedTasks />
            </ProtectedRoute>
          }
        />
        <Route
          path="/volunteers/accepted-tasks/:id"
          element={
            <ProtectedRoute allowedRoles={["volunteer"]}>
              <AcceptedTasksDetails />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}
