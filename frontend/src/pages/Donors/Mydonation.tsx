import { useState, useEffect } from "react";
import axios from "axios";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Toaster, toast } from "react-hot-toast";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // import carousel styles

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

export default function MyDonation() {
  const [loading, setLoading] = useState(true);
  const [donations, setDonations] = useState<Donation[]>([]);

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const token = localStorage.getItem("auth_token");
        if (!token) {
          toast.error("No logged-in user found");
          return;
        }

        const res = await axios.get("http://127.0.0.1:8001/api/donors/my-donations", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setDonations(res.data);
      } catch (err) {
        console.error("Failed to fetch donations:", err);
        toast.error("Failed to fetch donations");
      } finally {
        setLoading(false);
      }
    };

    fetchDonations();
  }, []);

  if (loading)
    return <p className="p-6 text-center text-gray-500">Loading donations...</p>;

  if (donations.length === 0)
    return (
      <div className="p-6 text-center">
        <p className="text-gray-500 text-lg font-medium">No donations found.</p>
        <p className="mt-2 text-gray-400">Start posting donations to see them here.</p>
      </div>
    );

  return (
    <AuthenticatedLayout>
      <Toaster position="top-center" />
      <div className="p-6 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-rose-600">My Donations</h2>
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {donations.map((donation) => (
            <div
              key={donation.id}
              className="bg-white shadow-lg rounded-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300 flex flex-col"
            >
              {/* Images Carousel */}
              {donation.images.length > 0 ? (
                <Carousel
                  showThumbs={false}
                  showStatus={false}
                  infiniteLoop
                  className="h-64"
                >
                  {donation.images.map((img) => (
                    <img
                      key={img.id}
                      src={`http://127.0.0.1:8001/storage/${img.image_path}`}
                      alt={donation.title}
                      className="object-cover w-full h-64 rounded-t-xl"
                    />
                  ))}
                </Carousel>
              ) : (
                <div className="w-full h-64 bg-gray-200 flex items-center justify-center text-gray-500 text-lg">
                  No Image
                </div>
              )}

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-rose-600">{donation.title}</h3>
                  <p className="text-gray-600 text-sm mt-1 line-clamp-3">
                    {donation.description || "No description provided"}
                  </p>

                  <div className="mt-3 text-sm text-gray-700 space-y-1">
                    <p>
                      <span className="font-medium">Quantity:</span> {donation.quantity}
                    </p>
                    <p>
                      <span className="font-medium">Pickup:</span> {donation.pickup_address}
                    </p>
                    {donation.expiry_date && (
                      <p>
                        <span className="font-medium">Expiry:</span>{" "}
                        {new Date(donation.expiry_date).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-4 flex justify-between items-center">
                  <span
                    className={`px-3 py-1 text-xs font-semibold rounded-full text-white ${
                      donation.status === "pending"
                        ? "bg-gradient-to-r from-yellow-400 to-yellow-600"
                        : donation.status === "approved"
                        ? "bg-gradient-to-r from-green-400 to-green-600"
                        : "bg-gradient-to-r from-blue-400 to-blue-600"
                    }`}
                  >
                    {donation.status.toUpperCase()}
                  </span>
                  <button
                    onClick={() => toast("Feature coming soon!")}
                    className="text-rose-600 font-semibold text-sm hover:underline"
                  >
                    View
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
