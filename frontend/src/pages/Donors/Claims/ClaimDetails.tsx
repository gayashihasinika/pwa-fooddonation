// src/pages/Donors/Claims/ClaimDetails.tsx
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { motion } from "framer-motion";
import { ArrowLeft, Heart, Calendar, Users, Sparkles, Package } from "lucide-react";
import impactImage from "@/assets/images/impact-hands.jpg";

interface Claim {
    id: number;
    status: "pending" | "accepted" | "completed";
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
    const navigate = useNavigate();

    const { data: claim, isLoading } = useQuery<Claim>({
        queryKey: ["donor-claim", id],
        queryFn: async () => {
            const res = await api.get(`/donors/claims/${id}`);
            return res.data.claim;
        },
        enabled: !!id,
    });



    if (isLoading) {
        return (
            <AuthenticatedLayout>
                <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-orange-50 to-amber-50">
                    <p className="text-2xl text-orange-700">Loading claim details...</p>
                </div>
            </AuthenticatedLayout>
        );
    }

    if (!claim) {
        return (
            <AuthenticatedLayout>
                <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-orange-50 to-amber-50">
                    <p className="text-2xl text-orange-700">Claim not found or unauthorized</p>
                </div>
            </AuthenticatedLayout>
        );
    }



    const getStatusAnimation = (status: string) => {
        switch (status) {
            case "pending": return "animate-pulse";
            case "accepted": return "animate-heartbeat";
            case "completed": return "animate-[sparkle_3s_ease-in-out]";
            default: return "";
        }
    };

    return (
        <AuthenticatedLayout>
            <div className="min-h-screen bg-gradient-to-b from-orange-50 via-amber-50 to-yellow-50 py-8 px-4">
                <div className="max-w-5xl mx-auto">
                    {/* Back Button */}
                    <motion.button
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-3 text-orange-700 hover:text-orange-800 font-medium mb-8"
                    >
                        <ArrowLeft className="w-6 h-6" />
                        Back to Claims
                    </motion.button>

                    {/* Hero Header */}
                    <motion.div
                        initial={{ opacity: 0, y: -30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-12"
                    >
                        <h1 className="text-5xl md:text-6xl font-extrabold text-orange-800 mb-6">
                            {claim.donation.title}
                        </h1>
                        <p className="text-2xl text-orange-700">
                            Your kindness reached <span className="font-bold text-orange-600">{claim.receiver.name}</span>
                        </p>
                    </motion.div>

                    {/* Main Image */}
                    {claim.donation.images.length > 0 ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="relative rounded-3xl overflow-hidden shadow-3xl mb-12 border-8 border-white"
                        >
                            <img
                                src={`http://127.0.0.1:8001/storage/${claim.donation.images[0].image_path}`}
                                alt={claim.donation.title}
                                className="w-full h-96 md:h-[500px] object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                            {/* Animated Status Badge */}
                            <motion.div
                                className={`absolute bottom-8 left-1/2 -translate-x-1/2 px-10 py-5 rounded-full font-bold text-2xl shadow-2xl flex items-center gap-4 text-white ${getStatusAnimation(claim.status)}`}
                                style={{
                                    background: claim.status === "pending" ? "linear-gradient(to right, #f59e0b, #eab308)" :
                                        claim.status === "accepted" ? "linear-gradient(to right, #10b981, #059669)" :
                                            "linear-gradient(to right, #3b82f6, #1d4ed8)"
                                }}
                            >
                                <Heart className="w-8 h-8" />
                                {claim.status.toUpperCase()}
                                {claim.status === "completed" && <Sparkles className="w-8 h-8 ml-2" />}
                            </motion.div>
                        </motion.div>
                    ) : (
                        <div className="h-96 md:h-[500px] bg-gradient-to-br from-orange-100 to-amber-100 rounded-3xl shadow-3xl flex items-center justify-center mb-12">
                            <Package className="w-32 h-32 text-orange-400" />
                        </div>
                    )}

                    {/* Narrative Story */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white/80 backdrop-blur rounded-3xl p-10 shadow-2xl mb-16 text-center"
                    >
                        <p className="text-2xl text-gray-800 leading-relaxed max-w-3xl mx-auto">
                            This donation is on its way to <span className="font-bold text-orange-700">{claim.receiver.name}</span> and their family.<br />
                            <span className="text-orange-700 font-medium">
                                Your kindness is bringing warmth and hope to someone in need.
                            </span>
                        </p>
                    </motion.div>
                    {/* Impact Image */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="rounded-3xl overflow-hidden shadow-2xl mb-16"
                    >
                        <img
                            src={impactImage}
                            alt="Hands receiving donated food"
                            className="w-full h-72 md:h-96 object-cover"
                        />
                    </motion.div>


                    {/* Journey Indicator */}
                    <div className="bg-white/80 backdrop-blur rounded-3xl p-10 shadow-2xl mb-16">
                        <h3 className="text-3xl font-bold text-orange-800 mb-8 text-center">
                            Journey of Your Donation
                        </h3>
                        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                            <div className="text-center flex-1">
                                <div className="w-20 h-20 rounded-full bg-orange-100 flex items-center justify-center mx-auto mb-4">
                                    <Package className="w-10 h-10 text-orange-600" />
                                </div>
                                <p className="font-bold text-orange-700">Donated</p>
                            </div>

                            <div className="flex-1 h-2 bg-gray-300 relative hidden md:block">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{
                                        width:
                                            claim.status === "pending"
                                                ? "50%"
                                                : claim.status === "accepted"
                                                    ? "75%"
                                                    : "100%",
                                    }}
                                    transition={{ duration: 1.2, ease: "easeOut" }}
                                    className="absolute h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full"
                                />

                            </div>

                            <div className="text-center flex-1">
                                <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                                    <Users className="w-10 h-10 text-green-600" />
                                </div>
                                <p className="font-bold text-green-700">Claimed</p>
                            </div>

                            <div className="text-center flex-1">
                                <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
                                    <Heart className="w-10 h-10 text-blue-600" />
                                </div>
                                <p className="font-bold text-blue-700">Delivered</p>
                            </div>
                        </div>
                    </div>

                    {/* Gratitude Message for Completed */}
                    {claim.status === "completed" && (
                        <motion.div
                            animate={{ y: [0, -8, 0] }}
                            transition={{ repeat: Infinity, duration: 3 }}
                        >
                            <Heart className="w-16 h-16 text-green-600 mx-auto mb-6" />

                            <p className="text-2xl font-bold text-green-800 mb-4">
                                Thank you for helping us today 🙏
                            </p>
                            <p className="text-xl text-gray-700">
                                Your donation brought a smile and a full stomach to {claim.receiver.name}'s family
                            </p>
                        </motion.div>
                    )}

                    {/* Claim Info */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-white rounded-3xl p-8 text-center shadow-2xl border-4 border-orange-100">
                            <Calendar className="w-16 h-16 text-orange-600 mx-auto mb-6" />
                            <p className="text-gray-600 mb-2">Claimed on</p>
                            <p className="text-3xl font-bold text-orange-800">
                                {new Date(claim.claimed_at).toLocaleDateString()}
                            </p>
                        </div>

                        <div className="bg-white rounded-3xl p-8 text-center shadow-2xl border-4 border-orange-100">
                            <Users className="w-16 h-16 text-orange-600 mx-auto mb-6" />
                            <p className="text-gray-600 mb-2">Received by</p>
                            <p className="text-3xl font-bold text-orange-800">
                                {claim.receiver.name}
                            </p>
                        </div>

                        <div className="bg-white rounded-3xl p-8 text-center shadow-2xl border-4 border-orange-100">
                            <Heart className="w-16 h-16 text-orange-600 mx-auto mb-6" />
                            <p className="text-gray-600 mb-2">Your Impact</p>
                            <p className="text-3xl font-bold text-orange-800">
                                Helped a family today ❤️
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}