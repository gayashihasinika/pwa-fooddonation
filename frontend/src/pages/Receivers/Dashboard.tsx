import { useEffect, useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import axios from "axios";
import { Toaster, toast } from "react-hot-toast";
import { Package, ClipboardList, Users } from "lucide-react";

interface Donation {
  id: number;
  title: string;
  quantity: number;
  pickup_address: string;
  status: "pending" | "approved" | "completed";
  created_at: string;
}

export default function ReceiverDashboard() {
  const [loading, setLoading] = useState(true);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [stats, setStats] = useState({
    totalRequests: 0,
    approvedRequests: 0,
    pendingRequests: 0,
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("auth_token");
        if (!token) {
          toast.error("No logged-in user found");
          return;
        }

        const [donationsRes, statsRes] = await Promise.all([
          axios.get("http://127.0.0.1:8001/api/receiver-donations", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://127.0.0.1:8001/api/receiver-dashboard-stats", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setDonations(donationsRes.data);
        setStats(statsRes.data);
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <p className="p-6 text-center">Loading dashboard...</p>;
  }

  return (
    <AuthenticatedLayout>
      <Toaster position="top-center" />
      <div className="p-6 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-[#065F46] mb-6">
          Receiver Dashboard
        </h1>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <div className="bg-white rounded-lg shadow p-6 flex items-center justify-between hover:shadow-xl transition">
            <div>
              <p className="text-gray-500 text-sm">Total Requests</p>
              <p className="text-2xl font-bold">{stats.totalRequests}</p>
            </div>
            <Package className="text-rose-500 w-10 h-10" />
          </div>

          <div className="bg-white rounded-lg shadow p-6 flex items-center justify-between hover:shadow-xl transition">
            <div>
              <p className="text-gray-500 text-sm">Approved Requests</p>
              <p className="text-2xl font-bold">{stats.approvedRequests}</p>
            </div>
            <Users className="text-green-500 w-10 h-10" />
          </div>

          <div className="bg-white rounded-lg shadow p-6 flex items-center justify-between hover:shadow-xl transition">
            <div>
              <p className="text-gray-500 text-sm">Pending Requests</p>
              <p className="text-2xl font-bold">{stats.pendingRequests}</p>
            </div>
            <ClipboardList className="text-yellow-500 w-10 h-10" />
          </div>
        </div>

        {/* Recent Donation Requests */}
        <h2 className="text-xl font-semibold text-[#065F46] mb-4">
          Recent Donation Requests
        </h2>
        {donations.length === 0 ? (
          <p className="text-gray-500">No donation requests yet.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {donations.map((donation) => (
              <div
                key={donation.id}
                className="bg-white rounded-lg shadow-md p-4 hover:shadow-xl transition"
              >
                <h3 className="font-semibold text-lg">{donation.title}</h3>
                <p className="text-gray-500 text-sm mt-1">
                  Quantity: {donation.quantity}
                </p>
                <p className="text-gray-500 text-sm mt-1">
                  Pickup: {donation.pickup_address}
                </p>
                <p className="text-sm mt-2">
                  Status:{" "}
                  <span
                    className={`px-2 py-1 rounded-full text-white text-xs ${
                      donation.status === "pending"
                        ? "bg-yellow-500"
                        : donation.status === "approved"
                        ? "bg-green-500"
                        : "bg-blue-500"
                    }`}
                  >
                    {donation.status.toUpperCase()}
                  </span>
                </p>
                <p className="text-gray-400 text-xs mt-2">
                  {new Date(donation.created_at).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </AuthenticatedLayout>
  );
}
