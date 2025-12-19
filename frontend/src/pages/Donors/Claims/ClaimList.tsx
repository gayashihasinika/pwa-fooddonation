// src/pages/Donors/Claims/ClaimList.tsx
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { Link } from "react-router-dom";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { motion, AnimatePresence } from "framer-motion";
import { Truck, Heart, Calendar, Users, Sparkles } from "lucide-react";
import claimHero from "@/assets/images/claim-hero.jpg";
import emptyClaim from "@/assets/images/claim-empty.jpg";



interface Claim {
    id: number;
    donation: { id: number; title: string };
    receiver: { name: string };
    status: "pending" | "accepted" | "completed";
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

    const getStatusStyle = (status: string) => {
        switch (status) {
            case "pending": return "bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 border-amber-300";
            case "accepted": return "bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-300";
            case "completed": return "bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border-blue-300";
            default: return "bg-gray-100 text-gray-800 border-gray-300";
        }
    };

    if (isLoading) {
        return (
            <AuthenticatedLayout>
                <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-orange-50 to-amber-50">
                    <p className="text-2xl text-orange-700">Loading your impact...</p>
                </div>
            </AuthenticatedLayout>
        );
    }

    const getStatusGlow = (status: string) => {
        switch (status) {
            case "pending":
                return "shadow-[0_0_25px_rgba(245,158,11,0.6)]";
            case "accepted":
                return "shadow-[0_0_30px_rgba(16,185,129,0.7)]";
            default:
                return "";
        }
    };

    const getHeartColor = (status: string) => {
        switch (status) {
            case "pending":
                return "text-amber-100";
            case "accepted":
                return "text-emerald-100";
            default:
                return "text-white";
        }
    };


    return (
        <AuthenticatedLayout>
            <div className="min-h-screen bg-gradient-to-b from-orange-50 via-amber-50 to-yellow-50 py-12 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="relative rounded-3xl overflow-hidden mb-20">
                        <img
                            src={claimHero}
                            className="absolute inset-0 w-full h-full object-cover opacity-20"
                            alt="Food delivery impact"
                        />
                        <div className="relative p-16 text-center"></div>
                        {/* Hero Header */}
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center mb-16"
                        >
                            <h1 className="text-5xl md:text-6xl font-extrabold text-orange-800 mb-6 flex items-center justify-center gap-4">
                                <Truck className="w-16 h-16 text-orange-600" />
                                Your Kindness in Action
                            </h1>
                            <p className="text-2xl text-orange-700">
                                See who your donations have reached ❤️
                            </p>
                        </motion.div>
                    </div>

                    {/* Empty State */}
                    {claims.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-24 bg-white/80 backdrop-blur rounded-3xl shadow-2xl"
                        >
                            <img
                                src={emptyClaim}
                                alt="No claims yet"
                                className="w-72 mx-auto mb-10 opacity-90"
                            />
                            <h2 className="text-4xl font-bold text-orange-800 mb-6">
                                No Claims Yet
                            </h2>
                            <p className="text-xl text-gray-700 max-w-2xl mx-auto px-8">
                                When someone claims your donation, their name and story will appear here.<br />
                                Your food is waiting to bring joy to a family in need.
                            </p>
                        </motion.div>
                    ) : (
                        /* Claims Cards */
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                            <AnimatePresence>
                                {claims.map((claim, index) => (
                                    <motion.div
                                        key={claim.id}
                                        initial={{ opacity: 0, y: 40 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        whileHover={{ y: -10 }}
                                        className="group relative bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-white hover:shadow-3xl transition-all duration-500"
                                    >
                                        {/* Glow Effect */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-orange-200/30 to-amber-200/30 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                        {/* Header with Status */}
                                        <div className={`relative p-8 text-center ${getStatusStyle(claim.status)}`}>
                                            <motion.div
                                                animate={
                                                    claim.status === "pending"
                                                        ? { scale: [1, 1.05, 1] }
                                                        : {}
                                                }
                                                transition={
                                                    claim.status === "pending"
                                                        ? { repeat: Infinity, duration: 2 }
                                                        : {}
                                                }
                                                className={`inline-flex items-center gap-3 px-8 py-4 rounded-full font-bold text-lg shadow-2xl ${getStatusGlow(claim.status)}`}
                                                style={{
                                                    background:
                                                        claim.status === "pending"
                                                            ? "linear-gradient(135deg, #fbbf24, #f59e0b)"
                                                            : claim.status === "accepted"
                                                                ? "linear-gradient(135deg, #34d399, #10b981)"
                                                                : "linear-gradient(135deg, #60a5fa, #3b82f6)",
                                                }}
                                            >
                                                <motion.div
                                                    animate={
                                                        claim.status === "accepted"
                                                            ? { scale: [1, 1.2, 1] }
                                                            : claim.status === "pending"
                                                                ? { scale: [1, 1.1, 1] }
                                                                : {}
                                                    }
                                                    transition={
                                                        claim.status === "accepted"
                                                            ? { repeat: Infinity, duration: 1.2 }
                                                            : claim.status === "pending"
                                                                ? { repeat: Infinity, duration: 2 }
                                                                : {}
                                                    }
                                                    className={`rounded-full p-1 ${claim.status === "pending"
                                                            ? "bg-amber-400/30"
                                                            : claim.status === "accepted"
                                                                ? "bg-emerald-400/30"
                                                                : ""
                                                        }`}
                                                >
                                                    <Heart
                                                        className={`w-7 h-7 drop-shadow-lg ${getHeartColor(claim.status)}`}
                                                        fill="currentColor"
                                                    />
                                                </motion.div>
                                                {claim.status.toUpperCase()}
                                                {claim.status === "completed" && (
                                                    <motion.div
                                                        whileHover={{ rotate: [0, 5, -5, 0] }}
                                                        transition={{ duration: 0.5 }}
                                                    >
                                                        <Sparkles className="w-7 h-7 text-white ml-2" />
                                                    </motion.div>
                                                )}

                                            </motion.div>
                                        </div>

                                        {/* Content */}
                                        <div className="p-8 pt-0">
                                            <h3 className="text-2xl font-bold text-orange-800 mb-4 text-center">
                                                {claim.donation.title}
                                            </h3>

                                            <div className="space-y-6 text-center">
                                                <div className="flex items-center justify-center gap-4">
                                                    <Users className="w-10 h-10 text-orange-600" />
                                                    <div>
                                                        <p className="text-gray-600">Received by</p>
                                                        <p className="text-xl font-bold text-orange-800">{claim.receiver.name}</p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-center gap-4">
                                                    <Calendar className="w-8 h-8 text-orange-600" />
                                                    <div>
                                                        <p className="text-gray-600 text-sm">Claimed on</p>
                                                        <p className="font-medium">
                                                            {new Date(claim.claimed_at).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            <p className="text-center text-gray-700 mt-8 italic text-lg">
                                                Your kindness reached {claim.receiver.name} ❤️
                                            </p>
                                            <motion.p
                                                initial={{ opacity: 0 }}
                                                whileInView={{ opacity: 1 }}
                                                viewport={{ once: true }}
                                                className="text-center text-sm text-gray-500 mt-6"
                                            >
                                                Because of you, a meal reached someone in need.
                                            </motion.p>

                                            <Link
                                                to={`/donor/claims/${claim.id}`}
                                                className="mt-8 w-full block text-center bg-gradient-to-r from-orange-600 to-amber-500 text-white py-4 rounded-2xl font-bold shadow-xl hover:shadow-2xl transition transform hover:scale-105"
                                            >
                                                View Details
                                            </Link>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}