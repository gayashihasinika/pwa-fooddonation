// src/pages/Receivers/Donations/AvailableDonations.tsx — FULLY RESPONSIVE & HOPEFUL
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { Package, MapPin, Search, Heart } from "lucide-react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import api from "@/lib/api";

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
  preferred_pickup_time?: string;
  food_category: string;
  status: "pending" | "approved" | "completed" | "claimed";
  images: DonationImage[];
}

export default function AvailableDonations() {
  const [loading, setLoading] = useState(true);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    sort: "newest",
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const res = await api.get("/receivers/donations", { params: filters });
        setDonations(res.data.data || []);
      } catch (err: any) {
        toast.error("Failed to load available food");
      } finally {
        setLoading(false);
      }
    };

    fetchDonations();
  }, [filters]);

  if (loading) {
    return (
      <AuthenticatedLayout>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-orange-50 to-amber-50">
          <p className="text-2xl text-orange-700">Searching for food shared with love...</p>
        </div>
      </AuthenticatedLayout>
    );
  }

  return (
    <AuthenticatedLayout>
      <div className="min-h-screen bg-gradient-to-b from-orange-50 via-amber-50 to-yellow-50 py-6 px-4 sm:py-8 lg:py-12">
        <div className="max-w-7xl mx-auto">
          {/* Hero Images — Responsive Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 rounded-3xl overflow-hidden shadow-3xl mb-12 lg:mb-16 border-8 border-white"
          >
            <img
              src="https://www.globalgiving.org/pfil/56139/Sri_Lanka_food_Large.jpeg"
              alt="Happy Sri Lankan family receiving food donation"
              className="w-full h-64 sm:h-80 lg:h-96 object-cover"
            />
            <img
              src="https://jtsamerica.org/wp-content/uploads/2023/11/0d5b6714-eb7d-41bd-a5ed-8ff3b057669c-1-scaled.jpg"
              alt="Community sharing food packages with smiles"
              className="w-full h-64 sm:h-80 lg:h-96 object-cover"
            />
            <img
              src="https://thumbs.dreamstime.com/b/delicious-sri-lankan-rice-curry-spread-lanka-food-photography-vibrant-kitchen-close-up-culinary-experience-explore-flavors-367829555.jpg"
              alt="Beautiful traditional Sri Lankan rice and curry spread"
              className="w-full h-64 sm:h-80 lg:h-96 object-cover hidden sm:block"
            />
            <img
              src="https://d27735ao2xxhhe.cloudfront.net/blog/pro/rice-and-curry-exploring-sri-lankas-iconic-national-dish-1000x700679231d73fe971737634263.jpg"
              alt="Warm inviting Sri Lankan home cooked meal"
              className="w-full h-64 sm:h-80 lg:h-96 object-cover hidden lg:block"
            />
          </motion.div>

          <div className="relative text-center -mt-32 lg:-mt-48 mb-20 lg:mb-32 px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-block bg-white/90 backdrop-blur rounded-3xl shadow-3xl p-8 lg:p-12 border-8 border-white"
            >
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-orange-800 mb-4">
                Food Shared with Love ❤️
              </h1>
              <p className="text-xl sm:text-2xl lg:text-3xl text-orange-700">
                Waiting for you and your family
              </p>
            </motion.div>
          </div>

          {/* Filters — Responsive */}
          <motion.div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl p-6 lg:p-8 mb-12">
            <div className="flex flex-col lg:flex-row gap-6 items-stretch lg:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-6 h-6" />
                <input
                  type="text"
                  placeholder="Search food or location..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="w-full pl-14 pr-6 py-5 bg-white border-2 border-gray-200 rounded-2xl focus:border-orange-500 focus:outline-none text-base lg:text-lg"
                />
              </div>

              <select
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                className="w-full lg:w-64 px-6 py-5 bg-white border-2 border-gray-200 rounded-2xl focus:border-orange-500 text-base lg:text-lg"
              >
                <option value="">All Categories</option>
                <option value="rice">Rice & Curry</option>
                <option value="bread">Bread & Bakery</option>
                <option value="packaged">Packaged Food</option>
                <option value="event_food">Event Food</option>
                <option value="other">Other</option>
              </select>
            </div>
          </motion.div>

          {/* Donations Grid — Fully Responsive */}
          {donations.length === 0 ? (
            <motion.div className="text-center py-16 lg:py-24 bg-white/90 backdrop-blur rounded-3xl shadow-2xl">
              <img
                src="https://thumbs.dreamstime.com/b/delicious-sri-lankan-rice-curry-spread-lanka-food-photography-vibrant-kitchen-close-up-culinary-experience-explore-flavors-367829555.jpg"
                alt="Warm Sri Lankan meal waiting to be shared"
                className="w-full max-w-xl lg:max-w-3xl mx-auto rounded-3xl shadow-2xl mb-10"
              />
              <p className="text-3xl lg:text-4xl font-bold text-orange-800 mb-6 px-4">
                No Food Available Right Now
              </p>
              <p className="text-lg lg:text-2xl text-gray-700 max-w-2xl mx-auto px-8">
                New donations arrive daily. Check back soon — a warm meal might be waiting for you ❤️
              </p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
              {donations.map((donation, index) => (
                <motion.div
                  key={donation.id}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="group relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-300/40 to-amber-300/40 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <div className="relative bg-white rounded-3xl shadow-3xl overflow-hidden border-8 border-white">
                    <div className="h-56 sm:h-64 lg:h-72 relative">
                      {donation.images.length > 0 ? (
                        <img
                          src={`http://127.0.0.1:8001/storage/${donation.images[0].image_path}`}
                          alt={donation.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center">
                          <Package className="w-20 h-20 lg:w-28 lg:h-28 text-orange-400" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition" />
                      <motion.div
                        whileHover={{ scale: 1.2 }}
                        className="absolute bottom-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition"
                      >
                        <Heart className="w-10 h-10 lg:w-14 lg:h-14 text-white drop-shadow-2xl" />
                      </motion.div>
                    </div>

                    <div className="p-6 sm:p-8">
                      <h3 className="text-2xl sm:text-3xl font-bold text-orange-800 mb-4 text-center">
                        {donation.title}
                      </h3>

                      <div className="space-y-4 text-gray-700 mb-8">
                        <div className="flex items-center justify-center gap-3">
                          <Heart className="w-7 h-7 sm:w-8 sm:h-8 text-red-500" />
                          <span className="text-lg sm:text-xl font-medium">{donation.quantity} servings</span>
                        </div>
                        <div className="flex items-center justify-center gap-3">
                          <MapPin className="w-7 h-7 sm:w-8 sm:h-8 text-orange-600" />
                          <span className="text-center text-base sm:text-lg">{donation.pickup_address}</span>
                        </div>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate(`/receivers/donations/${donation.id}`)}
                        className="w-full bg-gradient-to-r from-orange-600 to-amber-500 text-white py-5 sm:py-6 rounded-3xl text-xl sm:text-2xl font-bold shadow-2xl hover:shadow-3xl transition"
                      >
                        Request This Food
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Footer */}
          <motion.div className="mt-20 bg-orange-800 text-white rounded-3xl p-10 lg:p-16 text-center shadow-2xl">
            <img
              src="https://d27735ao2xxhhe.cloudfront.net/blog/pro/rice-and-curry-exploring-sri-lankas-iconic-national-dish-1000x700679231d73fe971737634263.jpg"
              alt="Beautiful Sri Lankan rice and curry — shared with love"
              className="w-full max-w-4xl lg:max-w-5xl mx-auto rounded-3xl shadow-2xl mb-12"
            />
            <h3 className="text-4xl lg:text-5xl font-bold mb-8">FeedSriLanka ❤️</h3>
            <p className="text-2xl lg:text-3xl mb-10 opacity-90">
              Food shared with kindness reaches those who need it most
            </p>
            <p className="text-xl lg:text-2xl opacity-80">
              Thank you for helping reduce waste and bring meals home
            </p>
            <div className="mt-12 text-6xl lg:text-8xl">🍲🙏✨</div>
          </motion.div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}