// src/pages/Admin/Donations/DonationList.tsx
import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { format } from "date-fns";
import {
  Package,
  AlertTriangle,
  Eye,
  Search,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

interface Donation {
  id: number;
  user_id: number;
  title: string;
  quantity: number;
  pickup_address: string;
  expiry_date: string;
  status: "pending" | "approved" | "completed" | "rejected";
  created_at: string;
  user: { name: string; email: string };
  images: { image_path: string }[];
}

export default function DonationList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showExpiredOnly, setShowExpiredOnly] = useState(false);

  const { data: donations, isLoading } = useQuery<Donation[]>({
    queryKey: ["admin-donations"],
    queryFn: async () => {
      const { data } = await api.get("/admin/donations");
      return data.donations || data;
    },
  });

  // Filter Logic
  const filteredDonations = useMemo(() => {
    if (!donations) return [];

    return donations.filter((donation) => {
      const matchesSearch =
        donation.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        donation.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        donation.pickup_address.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === "all" || donation.status === statusFilter;

      const isExpired = new Date(donation.expiry_date) < new Date();
      const matchesExpiry = !showExpiredOnly || isExpired;

      return matchesSearch && matchesStatus && matchesExpiry;
    });
  }, [donations, searchTerm, statusFilter, showExpiredOnly]);

  const isExpired = (date: string) => new Date(date) < new Date();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-amber-100 text-amber-800 border-amber-300";
      case "approved": return "bg-blue-100 text-blue-800 border-blue-300";
      case "completed": return "bg-emerald-100 text-emerald-800 border-emerald-300";
      case "rejected": return "bg-red-100 text-red-800 border-red-300";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return (
      <AuthenticatedLayout>
        <div className="p-8 text-center text-xl text-gray-600">Loading donations...</div>
      </AuthenticatedLayout>
    );
  }

  return (
    <AuthenticatedLayout>
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 flex items-center gap-3">
            <Package className="text-rose-600" />
            Donation Management
          </h1>
          <p className="text-gray-600 mt-2">
            Review, approve, or remove food donations ({filteredDonations.length} found)
          </p>
        </div>

        {/* Filters Bar */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="grid md:grid-cols-3 gap-6">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by title, donor, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="completed">Completed</option>
              <option value="rejected">Rejected</option>
            </select>

            {/* Expired Toggle */}
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={showExpiredOnly}
                onChange={(e) => setShowExpiredOnly(e.target.checked)}
                className="w-5 h-5 text-rose-600 rounded focus:ring-rose-500"
              />
              <span className="text-gray-700 font-medium flex items-center gap-2">
                <AlertTriangle size={18} className="text-red-600" />
                Show Expired Only
              </span>
            </label>
          </div>

          {/* Clear Filters Button */}
          {(searchTerm || statusFilter !== "all" || showExpiredOnly) && (
            <button
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("all");
                setShowExpiredOnly(false);
              }}
              className="flex items-center gap-2 text-rose-600 hover:text-rose-700 font-medium"
            >
              <X size={18} />
              Clear Filters
            </button>
          )}
        </div>

        {/* Donation Cards */}
        <div className="grid gap-6">
          {filteredDonations.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              <Package size={64} className="mx-auto mb-4 text-gray-300" />
              <p className="text-xl">No donations found matching your filters</p>
            </div>
          ) : (
            filteredDonations.map((donation) => (
              <div
                key={donation.id}
                className={`bg-white rounded-2xl shadow-lg p-6 border-2 transition-all hover:shadow-xl ${
                  isExpired(donation.expiry_date)
                    ? "border-red-300 bg-red-50"
                    : "border-gray-200"
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800">{donation.title}</h3>
                    <p className="text-gray-600">
                      by <strong>{donation.user.name}</strong> • {donation.user.email}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-4 py-2 rounded-full text-sm font-bold border-2 ${getStatusColor(
                        donation.status
                      )}`}
                    >
                      {donation.status.charAt(0).toUpperCase() + donation.status.slice(1)}
                    </span>
                    {isExpired(donation.expiry_date) && (
                      <span className="px-4 py-2 bg-red-100 text-red-800 rounded-full font-bold flex items-center gap-2">
                        <AlertTriangle size={16} />
                        Expired
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6 mb-6">
                  <div>
                    <p className="text-sm text-gray-500">Quantity</p>
                    <p className="text-lg font-semibold">{donation.quantity} servings</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Pickup Location</p>
                    <p className="text-lg font-semibold">{donation.pickup_address}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Expiry Date</p>
                    <p className={`text-lg font-semibold ${isExpired(donation.expiry_date) ? "text-red-600" : ""}`}>
                      {format(new Date(donation.expiry_date), "dd MMM yyyy")}
                    </p>
                  </div>
                </div>

                {donation.images.length > 0 && (
                  <div className="flex gap-3 mb-6">
                    {donation.images.slice(0, 3).map((img, i) => (
                      <img
                        key={i}
                        src={`/storage/${img.image_path}`}
                        alt="Donation"
                        className="w-24 h-24 object-cover rounded-lg shadow-md"
                      />
                    ))}
                    {donation.images.length > 3 && (
                      <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center text-gray-600 font-bold">
                        +{donation.images.length - 3}
                      </div>
                    )}
                  </div>
                )}

                <div className="flex justify-end">
                  <Link
                    to={`/admin/donations/${donation.id}`}
                    className="bg-rose-600 hover:bg-rose-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-3 transition"
                  >
                    <Eye size={20} />
                    Manage Donation
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </AuthenticatedLayout>
  );
}