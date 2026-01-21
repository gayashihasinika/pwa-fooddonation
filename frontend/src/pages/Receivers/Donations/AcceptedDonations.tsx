import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { Package, MapPin } from "lucide-react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import api from "@/lib/api";

interface DonationImage {
  id: number;
  image_path: string;
}

interface AcceptedDonation {
  id: number;
  title: string;
  quantity: number;
  pickup_address: string;
  claimed_at: string;
  status: string;
  images: DonationImage[];
}

export default function AcceptedDonations() {
  const [loading, setLoading] = useState(true);
  const [donations, setDonations] = useState<AcceptedDonation[]>([]);

  useEffect(() => {
    fetchAcceptedDonations();
  }, []);

  const fetchAcceptedDonations = async () => {
    try {
      const res = await api.get("/receivers/accepted-donations");
      setDonations(res.data.data || []);
    } catch {
      toast.error("Failed to load accepted donations");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthenticatedLayout>
      <div className="min-h-screen bg-green-50 p-4 sm:p-6">
        <div className="max-w-7xl mx-auto bg-white rounded-3xl shadow-xl p-6">

          <h1 className="text-2xl sm:text-3xl font-bold text-green-800 mb-6 text-center">
            ❤️ My Accepted Donations
          </h1>

          {loading ? (
            <div className="text-center py-12 text-green-700">
              Loading accepted donations...
            </div>
          ) : donations.length === 0 ? (
            <div className="text-center py-16 text-gray-600">
              You haven’t accepted any donations yet.
            </div>
          ) : (
            <>
              {/* MOBILE VIEW */}
              <div className="grid gap-4 md:hidden">
                {donations.map((donation) => (
                  <div
                    key={donation.id}
                    className="border rounded-2xl p-4 shadow bg-green-50"
                  >
                    <div className="flex gap-4">
                      {donation.images.length > 0 ? (
                        <img
                          src={`http://127.0.0.1:8001/storage/${donation.images[0].image_path}`}
                          className="w-20 h-20 rounded-xl object-cover"
                        />
                      ) : (
                        <div className="w-20 h-20 bg-green-100 rounded-xl flex items-center justify-center">
                          <Package className="text-green-400" />
                        </div>
                      )}

                      <div className="flex-1">
                        <h3 className="font-bold text-green-800">
                          {donation.title}
                        </h3>
                        <p className="text-sm">
                          {donation.quantity} servings
                        </p>
                        <p className="text-sm capitalize">
                          Status: {donation.status}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2 mt-3 text-sm">
                      <MapPin className="w-4 h-4 text-green-600 mt-0.5" />
                      <span>{donation.pickup_address}</span>
                    </div>

                    <p className="text-xs text-gray-500 mt-2">
                      Accepted on {new Date(donation.claimed_at).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>

              {/* DESKTOP TABLE */}
              <div className="hidden md:block overflow-x-auto">
                <table className="min-w-full border rounded-xl overflow-hidden">
                  <thead className="bg-green-100">
                    <tr>
                      <th className="p-4 text-left">Image</th>
                      <th className="p-4 text-left">Title</th>
                      <th className="p-4 text-left">Quantity</th>
                      <th className="p-4 text-left">Pickup Address</th>
                      <th className="p-4 text-left">Accepted At</th>
                      <th className="p-4 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {donations.map((donation) => (
                      <tr
                        key={donation.id}
                        className="border-t hover:bg-green-50"
                      >
                        <td className="p-4">
                          {donation.images.length > 0 ? (
                            <img
                              src={`http://127.0.0.1:8001/storage/${donation.images[0].image_path}`}
                              className="w-14 h-14 rounded-xl object-cover"
                            />
                          ) : (
                            <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center">
                              <Package className="text-green-400" />
                            </div>
                          )}
                        </td>

                        <td className="p-4 font-semibold text-green-800">
                          {donation.title}
                        </td>

                        <td className="p-4">
                          {donation.quantity}
                        </td>

                        <td className="p-4">
                          {donation.pickup_address}
                        </td>

                        <td className="p-4">
                          {new Date(donation.claimed_at).toLocaleDateString()}
                        </td>

                        <td className="p-4 capitalize">
                          {donation.status}
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
