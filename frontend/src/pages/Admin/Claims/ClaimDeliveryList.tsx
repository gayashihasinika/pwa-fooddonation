// src/pages/Admin/Claims/ClaimDeliveryList.tsx
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { Truck, Calendar, User } from "lucide-react";
import { Link } from "react-router-dom";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

interface Claim {
  id: number;
  donation: {
    id: number;
    title: string;
    user?: { name: string };
    images: { image_path: string }[];
  };
  receiver?: { name: string };
  volunteer?: { name: string } | null;
  status: string;
  notes: string | null;
  claimed_at: string;
  picked_up_at: string | null;
  delivered_at: string | null;
}

export default function ClaimDeliveryList() {
  const {
    data: claims = [],
    isLoading,
    isError,
  } = useQuery<Claim[]>({
    queryKey: ["admin-claims"],
    queryFn: async () => {
      const { data } = await api.get("/admin/claims");
      return data.claims ?? [];
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

  if (isLoading) {
    return (
      <AuthenticatedLayout>
        <div className="p-10 text-center text-gray-500">
          Loading claims...
        </div>
      </AuthenticatedLayout>
    );
  }

  if (isError) {
    return (
      <AuthenticatedLayout>
        <div className="p-10 text-center text-red-500">
          Failed to load claims
        </div>
      </AuthenticatedLayout>
    );
  }

  return (
    <AuthenticatedLayout>
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* HEADER */}
        <div className="flex items-center gap-3 mb-10">
          <Truck className="w-8 h-8 text-rose-600" />
          <h1 className="text-4xl font-bold text-gray-800">
            Claim & Delivery Management
          </h1>
        </div>

        {/* EMPTY STATE */}
        {claims.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-2xl shadow">
            <Truck className="w-20 h-20 text-gray-300 mx-auto mb-6" />
            <p className="text-2xl text-gray-600 mb-2">No claims yet</p>
            <p className="text-gray-500">
              Claims will appear here once receivers claim donations.
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {claims.map((claim) => (
              <div
                key={claim.id}
                className="bg-white rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition"
              >
                <div className="p-6">
                  {/* TOP ROW */}
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800">
                        {claim.donation?.title ?? "Unknown Donation"}
                      </h3>

                      <p className="text-gray-600 mt-1">
                        Donor:{" "}
                        <strong>
                          {claim.donation?.user?.name ?? "Unknown"}
                        </strong>{" "}
                        → Receiver:{" "}
                        <strong>
                          {claim.receiver?.name ?? "Unknown"}
                        </strong>
                      </p>
                    </div>

                    <span
                      className={`px-4 py-2 rounded-full font-bold text-sm ${getStatusBadge(
                        claim.status
                      )}`}
                    >
                      {claim.status.replace("_", " ").toUpperCase()}
                    </span>
                  </div>

                  {/* META INFO */}
                  <div className="flex flex-wrap gap-6 text-gray-600 text-sm mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Claimed on{" "}
                      {new Date(claim.claimed_at).toLocaleDateString()}
                    </div>

                    {claim.volunteer && (
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Volunteer:{" "}
                        <strong className="text-gray-800">
                          {claim.volunteer.name}
                        </strong>
                      </div>
                    )}
                  </div>

                  {/* ACTIONS */}
                  <div className="flex flex-wrap gap-4">
                    <Link
                      to={`/admin/claims/${claim.id}`}
                      className="bg-rose-600 hover:bg-rose-700 text-white px-6 py-3 rounded-xl font-bold transition"
                    >
                      Manage Claim →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AuthenticatedLayout>
  );
}
