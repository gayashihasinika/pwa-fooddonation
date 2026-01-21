import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Search, Package, MapPin } from "lucide-react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import api from "@/lib/api";

interface DonationImage {
  id: number;
  image_path: string;
}

interface Donation {
  id: number;
  title: string;
  quantity: number;
  pickup_address: string;
  expiry_date: string | null;
  food_category: string;
  images: DonationImage[];
}

export default function AvailableDonations() {
  const [loading, setLoading] = useState(true);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [filters, setFilters] = useState({
    search: "",
    category: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchDonations();
  }, [filters]);

  const fetchDonations = async () => {
    try {
      const res = await api.get("/receivers/donations", {
        params: filters,
      });
      setDonations(res.data.data || []);
    } catch {
      toast.error("Failed to load donations");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthenticatedLayout>
      <div className="min-h-screen bg-orange-50 p-4 sm:p-6">
        <div className="max-w-7xl mx-auto bg-white rounded-3xl shadow-xl p-4 sm:p-6">

          {/* HEADER */}
          <h1 className="text-2xl sm:text-3xl font-bold text-orange-800 mb-6 text-center">
            🍽️ Available Food Donations
          </h1>

          {/* ACTION BUTTON */}
          <div className="flex justify-end mb-4">
            <button
              onClick={() => navigate("/receivers/accepted-donations")}
              className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-xl font-semibold shadow"
            >
              ✅ My Accepted Donations
            </button>
          </div>


          {/* FILTERS */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search food or location..."
                value={filters.search}
                onChange={(e) =>
                  setFilters({ ...filters, search: e.target.value })
                }
                className="w-full pl-12 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-400 outline-none"
              />
            </div>

            <select
              value={filters.category}
              onChange={(e) =>
                setFilters({ ...filters, category: e.target.value })
              }
              className="px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-400"
            >
              <option value="">All Categories</option>
              <option value="rice">Rice & Curry</option>
              <option value="bread">Bread & Bakery</option>
              <option value="packaged">Packaged Food</option>
              <option value="event_food">Event Food</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* LOADING / EMPTY */}
          {loading ? (
            <div className="text-center py-12 text-orange-700">
              Loading donations...
            </div>
          ) : donations.length === 0 ? (
            <div className="text-center py-16 text-gray-600">
              No food donations available right now.
            </div>
          ) : (
            <>
              {/* ================= MOBILE VIEW ================= */}
              <div className="grid gap-4 md:hidden">
                {donations.map((donation) => (
                  <div
                    key={donation.id}
                    className="border rounded-2xl p-4 shadow-sm bg-orange-50"
                  >
                    <div className="flex gap-4">
                      {donation.images.length > 0 ? (
                        <img
                          src={`http://127.0.0.1:8001/storage/${donation.images[0].image_path}`}
                          className="w-20 h-20 rounded-xl object-cover"
                        />
                      ) : (
                        <div className="w-20 h-20 bg-orange-100 rounded-xl flex items-center justify-center">
                          <Package className="text-orange-400" />
                        </div>
                      )}

                      <div className="flex-1">
                        <h3 className="font-bold text-orange-800">
                          {donation.title}
                        </h3>
                        <p className="text-sm capitalize">
                          {donation.food_category}
                        </p>
                        <p className="text-sm">
                          {donation.quantity} servings
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2 mt-3 text-sm">
                      <MapPin className="w-4 h-4 text-orange-600 mt-0.5" />
                      <span>{donation.pickup_address}</span>
                    </div>

                    <button
                      onClick={() =>
                        navigate(`/receivers/donations/${donation.id}`)
                      }
                      className="mt-4 w-full bg-orange-600 hover:bg-orange-700 text-white py-2 rounded-xl font-semibold"
                    >
                      View Details
                    </button>
                  </div>
                ))}
              </div>

              {/* ================= DESKTOP TABLE ================= */}
              <div className="hidden md:block overflow-x-auto">
                <table className="min-w-full border rounded-xl overflow-hidden">
                  <thead className="bg-orange-100">
                    <tr>
                      <th className="p-4 text-left">Image</th>
                      <th className="p-4 text-left">Title</th>
                      <th className="p-4 text-left">Category</th>
                      <th className="p-4 text-left">Quantity</th>
                      <th className="p-4 text-left">Pickup Address</th>
                      <th className="p-4 text-left">Expiry</th>
                      <th className="p-4 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {donations.map((donation) => (
                      <tr
                        key={donation.id}
                        className="border-t hover:bg-orange-50"
                      >
                        <td className="p-4">
                          {donation.images.length > 0 ? (
                            <img
                              src={`http://127.0.0.1:8001/storage/${donation.images[0].image_path}`}
                              className="w-16 h-16 rounded-xl object-cover"
                            />
                          ) : (
                            <div className="w-16 h-16 bg-orange-100 rounded-xl flex items-center justify-center">
                              <Package className="text-orange-400" />
                            </div>
                          )}
                        </td>

                        <td className="p-4 font-semibold text-orange-800">
                          {donation.title}
                        </td>

                        <td className="p-4 capitalize">
                          {donation.food_category}
                        </td>

                        <td className="p-4">
                          {donation.quantity} servings
                        </td>

                        <td className="p-4">{donation.pickup_address}</td>

                        <td className="p-4">
                          {donation.expiry_date ?? "N/A"}
                        </td>

                        <td className="p-4 text-center">
                          <button
                            onClick={() =>
                              navigate(`/receivers/donations/${donation.id}`)
                            }
                            className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-xl font-semibold"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
