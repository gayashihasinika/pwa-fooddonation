// frontend/src/pages/Donors/Claims/ClaimDetails.tsx
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { toast } from "react-hot-toast";

interface Claim {
    id: number;
    status: string;
    claimed_at: string;
    donation: {
        id: number;
        title: string;
        images: { image_path: string }[];
    };
    receiver: {
        name: string;
    };
}

export default function DonorClaimDetails() {
    const { id } = useParams<{ id: string }>();

    // Fetch single claim
    const { data: claim, isLoading } = useQuery<Claim>({
        queryKey: ["donor-claim", id],
        queryFn: async () => {
            const res = await api.get(`/donors/claims/${id}`);
            return res.data.claim;
        },
        enabled: !!id, // only run if id exists
    });

    // Action for approve/cancel
    const action = async (url: string, message: string) => {
        try {
            await api.post(url);
            toast.success(message);
            window.location.reload();
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Something went wrong");
        }
    };

    if (isLoading)
        return <AuthenticatedLayout>Loading claim details...</AuthenticatedLayout>;

    if (!claim)
        return <AuthenticatedLayout>No claim found or you are not authorized.</AuthenticatedLayout>;

    return (
        <AuthenticatedLayout>
            <div className="max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow">
                <h1 className="text-3xl font-bold mb-4">{claim.donation.title}</h1>

                <p className="text-gray-600 mb-2">
                    Receiver: <strong>{claim.receiver.name}</strong>
                </p>

                <p className="mt-4">
                    Status: <strong>{claim.status.toUpperCase()}</strong>
                </p>

                <div className="flex gap-4 mt-8 flex-wrap">
                    {claim.status === "pending" && (
                        <button
                            onClick={() =>
                                action(`/donors/claims/${id}/approve`, "Claim approved")
                            }
                            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold"
                        >
                            Approve Claim
                        </button>
                    )}

                    {claim.status !== "delivered" && (
                        <button
                            onClick={() =>
                                action(`/donors/claims/${id}/cancel`, "Claim cancelled")
                            }
                            className="bg-gray-200 px-6 py-3 rounded-xl font-bold"
                        >
                            Cancel Claim
                        </button>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
