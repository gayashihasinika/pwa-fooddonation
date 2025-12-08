// src/pages/Admin/Claims/ClaimDeliveryList.tsx
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { Truck } from "lucide-react";
import { Link } from "react-router-dom";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

interface Claim {
  id: number;
  donation: {
    id: number;
    title: string;
    user: { name: string };
    images: { image_path: string }[];
  };
  receiver: { name: string };
  volunteer: { name: string } | null;
  status: string;
  notes: string | null;
  claimed_at: string;
  picked_up_at: string | null;
  delivered_at: string | null;
}

export default function ClaimDeliveryList() {
  const { data: claims, isLoading } = useQuery<Claim[]>({
    queryKey: ["admin-claims"],
    queryFn: async () => {
      const { data } = await api.get("/admin/claims");
      return data.claims;
    },
  });

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: "bg-amber-100 text-amber-800",
      accepted: "bg-blue-100 text-blue-800",
      picked_up: "bg-purple-100 text-purple-800",
      delivered: "bg-emerald-100 text-emerald-800",
      cancelled: "bg-gray-100 text-gray-800",
      disputed: "bg-red-100 text-red-800",
    };
    return styles[status] || "bg-gray-100 text-gray-800";
  };

  if (isLoading) return <div className="p-8 text-center">Loading claims...</div>;

  return (
    <AuthenticatedLayout>
      <div className="p-6 max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 flex items-center gap-3 mb-8">
          <Truck className="text-rose-600" />
          Claim & Delivery Management
        </h1>

        <div className="grid gap-6">
          {claims?.map((claim) => (
            <div key={claim.id} className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-2xl font-bold">{claim.donation.title}</h3>
                    <p className="text-gray-600">
                      Donor: <strong>{claim.donation.user.name}</strong> → Receiver: <strong>{claim.receiver.name}</strong>
                    </p>
                  </div>
                  <span className={`px-4 py-2 rounded-full font-bold ${getStatusBadge(claim.status)}`}>
                    {claim.status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>

                {claim.volunteer && (
                  <p className="text-lg text-gray-700 mb-4">
                    Volunteer: <strong>{claim.volunteer.name}</strong>
                  </p>
                )}

                <div className="flex gap-4 flex-wrap">
                  <Link
                    to={`/admin/claims/${claim.id}`}
                    className="bg-rose-600 hover:bg-rose-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2"
                  >
                    Manage Claim →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AuthenticatedLayout>
  );
}