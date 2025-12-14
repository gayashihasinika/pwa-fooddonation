// frontend/src/pages/Donors/Claims/ClaimList.tsx
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { Link } from "react-router-dom";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Truck } from "lucide-react";

interface Claim {
    id: number;
    donation: { id: number; title: string };
    receiver: { name: string };
    status: string;
    claimed_at: string;
}

export default function DonorClaimList() {
    const { data: claims = [], isLoading } = useQuery<Claim[]>({
        queryKey: ["donor-claims"],
        queryFn: async () => {
            const res = await api.get("/donors/claims");
            return res.data.claims ?? [];
        },
    });

    if (isLoading) {
        return (
            <AuthenticatedLayout>
                <div className="p-10 text-center text-gray-500">Loading claims...</div>
            </AuthenticatedLayout>
        );
    }

    return (
        <AuthenticatedLayout>
            <div className="max-w-7xl mx-auto px-6 py-10">
                <h1 className="text-4xl font-bold flex items-center gap-3 mb-10">
                    <Truck className="text-rose-600 w-8 h-8" />
                    My Claims
                </h1>

                {claims.length === 0 ? (
                    <div className="text-center py-24 bg-white rounded-2xl shadow">
                        <Truck className="w-20 h-20 text-gray-300 mx-auto mb-6" />
                        <p className="text-2xl text-gray-600">No claims yet</p>
                        <p className="text-gray-500">
                            Claims will appear here once someone claims your donations.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto bg-white rounded-2xl shadow border border-gray-200">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Donation
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Receiver
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Claimed On
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {claims.map((claim) => (
                                    <tr key={claim.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {claim.donation.title}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                            {claim.receiver.name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(claim.claimed_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <span
                                                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${claim.status === "pending"
                                                        ? "bg-yellow-100 text-yellow-800"
                                                        : claim.status === "accepted"
                                                            ? "bg-green-100 text-green-800"
                                                            : "bg-gray-100 text-gray-800"
                                                    }`}
                                            >
                                                {claim.status.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex gap-2 justify-end">
                                            <Link
                                                to={`/donor/claims/${claim.id}`}
                                                className="bg-rose-600 hover:bg-rose-700 text-white px-3 py-1 rounded-xl font-bold transition"
                                            >
                                                View
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
