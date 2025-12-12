import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Toaster, toast } from "react-hot-toast";
import { ArrowLeft } from "lucide-react";

interface DonationImage {
  id: number;
  image_path: string;
}

interface Donation {
  id: number;
  title: string;
  description: string;
  quantity: number;
  pickup_address: string;
  expiry_date: string | null;
  status: "pending" | "approved" | "completed";
  images: DonationImage[];
}

export default function ViewDonation() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [donation, setDonation] = useState<Donation | null>(null);

  useEffect(() => {
    const fetchDonation = async () => {
      try {
        const token = localStorage.getItem("auth_token");
        if (!token) {
          toast.error("No logged-in user found");
          return;
        }

        const res = await axios.get(
          `http://127.0.0.1:8001/api/donors/donations/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setDonation(res.data);
      } catch (err: any) {
        console.error("Failed to fetch donation:", err.response || err);
        toast.error(err.response?.data?.message || "Failed to fetch donation");
        navigate(-1);
      } finally {
        setLoading(false);
      }
    };

    fetchDonation();
  }, [id]);

  if (loading) return <p className="p-6 text-center text-gray-500">Loading donation...</p>;
  if (!donation) return null;

  const statusColors = {
    pending: "bg-yellow-500",
    approved: "bg-green-500",
    completed: "bg-blue-500",
  };

  return (
    <AuthenticatedLayout>
      <Toaster position="top-center" />
      <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 mb-4 text-rose-600 hover:underline font-medium"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-bold text-rose-600 mb-6">{donation.title}</h1>

        {/* Modern Image Grid */}
        {donation.images.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            {donation.images.map((img) => (
              <div key={img.id} className="relative group overflow-hidden rounded-xl shadow-lg">
                <img
                  src={`http://127.0.0.1:8001/storage/${img.image_path}`}
                  alt={donation.title}
                  className="object-cover w-full h-64 sm:h-52 md:h-64 lg:h-72 transform transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-sm font-medium">
                  View Image
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="w-full h-64 sm:h-80 lg:h-96 bg-gray-100 rounded-xl flex flex-col items-center justify-center text-gray-500 text-lg shadow-inner mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 mb-2 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v4m0 0v4m0-4h4m10 0h4m-4 0v4m0-4v-4" />
            </svg>
            <span>No images available</span>
          </div>
        )}

        {/* Description */}
        <p className="text-gray-700 mb-6">{donation.description || "No description provided."}</p>

        {/* Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="bg-white shadow rounded-xl p-4 flex flex-col">
            <span className="text-gray-400 text-sm">Quantity</span>
            <span className="text-gray-800 font-semibold text-lg">{donation.quantity}</span>
          </div>
          <div className="bg-white shadow rounded-xl p-4 flex flex-col">
            <span className="text-gray-400 text-sm">Pickup Address</span>
            <span className="text-gray-800 font-semibold text-lg">{donation.pickup_address}</span>
          </div>
          {donation.expiry_date && (
            <div className="bg-white shadow rounded-xl p-4 flex flex-col">
              <span className="text-gray-400 text-sm">Expiry Date</span>
              <span className="text-gray-800 font-semibold text-lg">
                {new Date(donation.expiry_date).toLocaleDateString()}
              </span>
            </div>
          )}
          <div className="bg-white shadow rounded-xl p-4 flex flex-col">
            <span className="text-gray-400 text-sm">Status</span>
            <span
              className={`text-white font-semibold text-sm px-3 py-1 rounded-full w-max mt-1 ${statusColors[donation.status]}`}
            >
              {donation.status.toUpperCase()}
            </span>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
