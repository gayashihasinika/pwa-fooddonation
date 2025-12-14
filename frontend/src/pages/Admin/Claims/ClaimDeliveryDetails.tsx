// frontend/src/pages/Admin/Claims/ClaimDeliveryDetails.tsx
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { toast } from "react-hot-toast";
import { Truck, User, HeartHandshake, Clock } from "lucide-react";

export default function ClaimDeliveryDetails() {
  const { id } = useParams();

  const { data: claim, isLoading } = useQuery({
    queryKey: ["admin-claim", id],
    queryFn: async () => {
      const res = await api.get(`/admin/claims/${id}`);
      return res.data.claim;
    },
  });

  const action = (url: string, message: string) =>
    api.post(url).then(() => toast.success(message));

  const statusStyles: Record<string, string> = {
    pending: "bg-amber-100 text-amber-800",
    accepted: "bg-blue-100 text-blue-800",
    picked_up: "bg-purple-100 text-purple-800",
    delivered: "bg-emerald-100 text-emerald-800",
    cancelled: "bg-gray-100 text-gray-700",
  };

  if (isLoading) {
    return (
      <AuthenticatedLayout>
        <div className="p-10 text-center text-gray-500">
          Loading claim details...
        </div>
      </AuthenticatedLayout>
    );
  }

  return (
    <AuthenticatedLayout>
      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* HEADER */}
        <div className="flex items-center gap-3 mb-8">
          <Truck className="w-8 h-8 text-rose-600" />
          <h1 className="text-4xl font-bold text-gray-800">
            Manage Claim
          </h1>
        </div>

        {/* MAIN CARD */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden">
          {/* TOP SECTION */}
          <div className="p-8 border-b">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
              <div>
                <h2 className="text-3xl font-extrabold text-gray-800">
                  {claim.donation.title}
                </h2>
                <p className="text-gray-500 mt-1 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Claimed on{" "}
                  {new Date(claim.claimed_at).toLocaleDateString()}
                </p>
              </div>

              <span
                className={`px-5 py-2 rounded-full text-sm font-bold ${statusStyles[claim.status]}`}
              >
                {claim.status.replace("_", " ").toUpperCase()}
              </span>
            </div>
          </div>

          {/* DETAILS GRID */}
          <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-50 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-2 text-gray-600">
                <User className="w-4 h-4" />
                Donor
              </div>
              <p className="font-bold text-gray-800">
                {claim.donation.user.name}
              </p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-2 text-gray-600">
                <HeartHandshake className="w-4 h-4" />
                Receiver
              </div>
              <p className="font-bold text-gray-800">
                {claim.receiver.name}
              </p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-2 text-gray-600">
                <Truck className="w-4 h-4" />
                Volunteer
              </div>
              <p className="font-bold text-gray-800">
                {claim.volunteer?.name ?? "Not Assigned"}
              </p>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="p-8 border-t bg-gray-50">
            <h3 className="text-lg font-bold text-gray-700 mb-4">
              Claim Actions
            </h3>

            <div className="flex flex-wrap gap-4">
              {claim.status === "accepted" && (
                <button
                  onClick={() =>
                    action(
                      `/admin/claims/${id}/picked-up`,
                      "Marked as picked up"
                    )
                  }
                  className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-bold transition"
                >
                  Mark Picked Up
                </button>
              )}

              {claim.status === "picked_up" && (
                <button
                  onClick={() =>
                    action(
                      `/admin/claims/${id}/delivered`,
                      "Delivery completed"
                    )
                  }
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-bold transition"
                >
                  Mark Delivered
                </button>
              )}

              <button
                onClick={() =>
                  action(
                    `/admin/claims/${id}/cancel`,
                    "Claim cancelled"
                  )
                }
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-3 rounded-xl font-bold transition"
              >
                Cancel Claim
              </button>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
