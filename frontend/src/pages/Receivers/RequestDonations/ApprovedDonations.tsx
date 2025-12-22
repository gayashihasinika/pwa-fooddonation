// frontend/src/pages/Receivers/RequestDonations/ApprovedDonations.tsx
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { useNavigate } from "react-router-dom";
import { Heart, Package } from "lucide-react";

export default function ApprovedDonations() {
  const navigate = useNavigate();

  const { data, isLoading, error } = useQuery({
    queryKey: ["approved-donations"],
    queryFn: async () => {
      const res = await api.get("/receivers/claimed-donations");
      return res.data.donations;
    },
  });

  if (isLoading) return <AuthenticatedLayout>
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-xl text-gray-500">Loading approved donations…</p>
    </div>
  </AuthenticatedLayout>;

  if (error || !data || data.length === 0) return <AuthenticatedLayout>
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-xl text-gray-500 text-center">No approved donations found.</p>
    </div>
  </AuthenticatedLayout>;

  return (
    <AuthenticatedLayout>
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-amber-50 p-4 sm:p-6 lg:p-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-orange-800 mb-6 text-center">Approved Donations</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((donation: any) => (
            <div
              key={donation.id}
              onClick={() => navigate(`/receivers/claimed-donations/${donation.id}`)}
              className="cursor-pointer bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition"
            >
              {donation.images?.[0] ? (
                <img
                  src={`http://127.0.0.1:8001/storage/${donation.images[0].image_path}`}
                  alt={donation.title}
                  className="w-full h-48 sm:h-56 object-cover"
                />
              ) : (
                <div className="h-48 sm:h-56 flex items-center justify-center bg-orange-100">
                  <Package className="w-12 h-12 text-orange-500" />
                </div>
              )}
              <div className="p-4 sm:p-6">
                <h2 className="text-xl font-bold text-orange-800 mb-2">{donation.title}</h2>
                <div className="flex items-center gap-2 text-gray-600">
                  <Heart className="w-5 h-5 text-red-500" />
                  <span>
                    {donation.claims && donation.claims.length > 0 && donation.claims[0].quantity
                      ? donation.claims[0].quantity
                      : donation.quantity || 1} servings
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
