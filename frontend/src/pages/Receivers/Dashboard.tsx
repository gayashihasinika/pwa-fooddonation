// src/pages/Receiver/ReceiverDashboard.tsx — FINAL & FIXED
import React, { useEffect, useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import api from "@/lib/api"; // ← USE YOUR GLOBAL API HELPER!
import { toast } from "react-hot-toast";
import { Package, ClipboardList, Users } from "lucide-react";

interface Donation {
  id: number;
  title: string;
  quantity: number;
  pickup_address: string;
  status: string;
  created_at: string;
}

interface Stats {
  totalRequests: number;
  approvedRequests: number;
  pendingRequests: number;
}

export default function ReceiverDashboard() {
  const [loading, setLoading] = useState(true);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalRequests: 0,
    approvedRequests: 0,
    pendingRequests: 0,
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [donationsRes, statsRes] = await Promise.all([
          api.get("/receivers/donations"),
          api.get("/receivers/dashboard-stats"),
        ]);

        // FIXED: Always ensure donations is an array
        const donationsData = donationsRes.data.donations || donationsRes.data.data || [];
        setDonations(Array.isArray(donationsData) ? donationsData : []);

        setStats(statsRes.data);
      } catch (err: any) {
        console.error("Failed to fetch dashboard data:", err);
        toast.error("Failed to load dashboard");
        setDonations([]); // Safety fallback
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <AuthenticatedLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-2xl text-gray-600">Loading your dashboard...</div>
        </div>
      </AuthenticatedLayout>
    );
  }

  return (
    <AuthenticatedLayout>
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-orange-50 to-amber-100 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-5xl font-bold text-center bg-gradient-to-r from-rose-600 to-orange-600 bg-clip-text text-transparent mb-12">
            Receiver Dashboard
          </h1>

          {/* Stats Cards */}
          <div className="grid gap-8 md:grid-cols-3 mb-12">
            <div className="bg-white/80 backdrop-blur rounded-3xl shadow-2xl p-8 text-center hover:shadow-3xl transition">
              <Package className="w-16 h-16 text-rose-600 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">Total Requests</p>
              <p className="text-5xl font-bold text-gray-800">{stats.totalRequests}</p>
            </div>

            <div className="bg-white/80 backdrop-blur rounded-3xl shadow-2xl p-8 text-center hover:shadow-3xl transition">
              <Users className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">Approved</p>
              <p className="text-5xl font-bold text-gray-800">{stats.approvedRequests}</p>
            </div>

            <div className="bg-white/80 backdrop-blur rounded-3xl shadow-2xl p-8 text-center hover:shadow-3xl transition">
              <ClipboardList className="w-16 h-16 text-yellow-600 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">Pending</p>
              <p className="text-5xl font-bold text-gray-800">{stats.pendingRequests}</p>
            </div>
          </div>

          {/* Recent Requests */}
          <div className="bg-white/80 backdrop-blur rounded-3xl shadow-2xl p-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-8">Your Recent Requests</h2>

            {donations.length === 0 ? (
              <div className="text-center py-16">
                <ClipboardList className="w-24 h-24 text-gray-300 mx-auto mb-6" />
                <p className="text-2xl text-gray-600">No requests yet</p>
                <p className="text-gray-500 mt-4">Browse available donations and make your first request!</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr className="bg-gradient-to-r from-rose-100 to-orange-100">
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Donation</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Quantity</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Location</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Status</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Requested</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {donations.map((donation) => (
                      <tr key={donation.id} className="hover:bg-rose-50 transition">
                        <td className="px-6 py-4 font-medium text-gray-900">{donation.title}</td>
                        <td className="px-6 py-4 text-gray-700">{donation.quantity}</td>
                        <td className="px-6 py-4 text-gray-700">{donation.pickup_address}</td>
                        <td className="px-6 py-4">
                          <span className={`px-4 py-2 rounded-full text-sm font-bold ${
                            donation.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                            donation.status === "approved" ? "bg-green-100 text-green-800" :
                            "bg-blue-100 text-blue-800"
                          }`}>
                            {donation.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {new Date(donation.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}