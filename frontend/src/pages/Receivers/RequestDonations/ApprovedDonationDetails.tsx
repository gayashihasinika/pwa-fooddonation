// frontend/src/pages/Receivers/RequestDonations/ApprovedDonationDetails.tsx
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { motion } from "framer-motion";
import { Package, MapPin, Calendar, Clock, AlertCircle, Tag, User, Sparkles, Heart, ArrowLeft } from "lucide-react";
import { format } from "date-fns";

export default function ApprovedDonationDetails() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const { data, isLoading, error } = useQuery({
        queryKey: ["approved-donation", id],
        queryFn: async () => {
            const res = await api.get(`/receivers/claimed-donations/${id}`);
            return res.data.donation;
        },
        enabled: !!id,
    });

    if (isLoading) return (
        <AuthenticatedLayout>
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-orange-50 to-amber-50">
                <p className="text-xl text-gray-500">Loading your approved donation...</p>
            </div>
        </AuthenticatedLayout>
    );

    if (error || !data) return (
        <AuthenticatedLayout>
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-orange-50 to-amber-50">
                <p className="text-xl text-gray-500">Donation not found.</p>
            </div>
        </AuthenticatedLayout>
    );

    return (
        <AuthenticatedLayout>
            <div className="min-h-screen bg-gradient-to-b from-orange-50 via-amber-50 to-yellow-50 py-8 px-4">
                <div className="max-w-4xl mx-auto">
                    {/* BACK BUTTON */}
                    <motion.button
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-3 text-orange-700 hover:text-orange-800 font-medium mb-8 text-lg group"
                    >
                        <ArrowLeft className="w-7 h-7 group-hover:-translate-x-1 transition" />
                        Back to Approved Donations
                    </motion.button>
                    {/* Title */}
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-orange-800 text-center mb-8">
                        {data.title}
                    </h1>

                    {/* Main Image */}
                    {data.images?.[0] ? (
                        <div className="rounded-3xl overflow-hidden shadow-2xl mb-10 border-8 border-white">
                            <img
                                src={`http://127.0.0.1:8001/storage/${data.images[0].image_path}`}
                                alt={data.title}
                                className="w-full h-64 sm:h-80 md:h-96 lg:h-[500px] object-cover"
                            />
                        </div>
                    ) : (
                        <div className="h-64 sm:h-80 md:h-96 lg:h-[500px] bg-gradient-to-br from-orange-100 to-amber-100 rounded-3xl shadow-2xl flex items-center justify-center mb-10">
                            <Package className="w-32 h-32 text-orange-400" />
                        </div>
                    )}

                    {/* Description */}
                    {data.description && (
                        <div className="bg-white/80 backdrop-blur rounded-3xl p-8 shadow-xl mb-10 text-center">
                            <p className="text-xl sm:text-2xl text-gray-700 italic leading-relaxed">
                                "{data.description}"
                            </p>
                        </div>
                    )}

                    {/* Key Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                        {/* Donor */}
                        <div className="bg-white rounded-3xl p-6 shadow-xl border-4 border-orange-100 flex items-center gap-4">
                            <User className="w-12 h-12 text-orange-600" />
                            <div>
                                <p className="text-gray-600 font-medium">Generous Donor</p>
                                <p className="text-2xl font-bold text-orange-800">
                                    {data.user?.name || "Anonymous Donor"}
                                </p>
                            </div>
                        </div>

                        {/* Servings */}
                        <div className="bg-white rounded-3xl p-6 shadow-xl border-4 border-orange-100 flex items-center gap-4">
                            <Heart className="w-12 h-12 text-red-600" />
                            <div>
                                <p className="text-gray-600 font-medium">Servings</p>
                                <p className="text-2xl font-bold text-red-700">
                                    {data.claims && data.claims.length > 0
                                        ? data.claims[0].quantity
                                        : data.quantity || "1"}
                                </p>
                            </div>
                        </div>

                        {/* Pickup Address */}
                        <div className="bg-white rounded-3xl p-6 shadow-xl border-4 border-orange-100 flex items-start gap-4">
                            <MapPin className="w-12 h-12 text-amber-600 mt-1" />
                            <div>
                                <p className="text-gray-600 font-medium">Pickup Location</p>
                                <p className="text-xl font-bold text-amber-800">{data.pickup_address}</p>
                            </div>
                        </div>

                        {/* Preferred Pickup Time */}
                        {data.pickup_time && (
                            <div className="bg-white rounded-3xl p-6 shadow-xl border-4 border-orange-100 flex items-center gap-4">
                                <Clock className="w-12 h-12 text-yellow-600" />
                                <div>
                                    <p className="text-gray-600 font-medium">Preferred Time</p>
                                    <p className="text-xl font-bold text-yellow-800">
                                        {format(new Date(data.pickup_time), "dd MMM yyyy, h:mm a")}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Expiry Date */}
                        {data.expiry_date && (
                            <div className="bg-white rounded-3xl p-6 shadow-xl border-4 border-orange-100 flex items-center gap-4">
                                <Calendar className="w-12 h-12 text-orange-600" />
                                <div>
                                    <p className="text-gray-600 font-medium">Best Before</p>
                                    <p className="text-xl font-bold text-orange-800">
                                        {format(new Date(data.expiry_date), "dd MMMM yyyy")}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Category & Freshness */}
                        <div className="bg-white rounded-3xl p-6 shadow-xl border-4 border-orange-100">
                            <div className="flex items-center gap-4 mb-4">
                                <Tag className="w-10 h-10 text-purple-600" />
                                <div>
                                    <p className="text-gray-600 font-medium">Category</p>
                                    <p className="text-xl font-bold text-purple-800 capitalize">{data.category.replace('_', ' ')}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <Sparkles className="w-10 h-10 text-indigo-600" />
                                <div>
                                    <p className="text-gray-600 font-medium">Freshness</p>
                                    <p className="text-xl font-bold text-indigo-800 capitalize">
                                        {data.freshness_level.replace('_', ' ')}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Allergy Tags - SAFE FOR STRING OR ARRAY */}
                    {(data.allergy_tags && data.allergy_tags.length > 0) && (
                        <div className="bg-red-50 border-4 border-red-200 rounded-3xl p-6 shadow-xl mb-10">
                            <div className="flex items-center gap-4 mb-4">
                                <AlertCircle className="w-12 h-12 text-red-600" />
                                <p className="text-2xl font-bold text-red-800">Allergy Information</p>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                {/* SAFE PARSING: Handle both string and array */}
                                {(() => {
                                    let tags = [];
                                    if (typeof data.allergy_tags === 'string') {
                                        try {
                                            tags = JSON.parse(data.allergy_tags);
                                        } catch (e) {
                                            tags = [];
                                        }
                                    } else if (Array.isArray(data.allergy_tags)) {
                                        tags = data.allergy_tags;
                                    }

                                    return tags.map((tag: string, index: number) => (
                                        <span
                                            key={index}
                                            className="bg-red-200 text-red-800 px-4 py-2 rounded-full font-bold uppercase tracking-wide"
                                        >
                                            {tag}
                                        </span>
                                    ));
                                })()}
                            </div>
                        </div>
                    )}

                    {/* Claimed Date */}
                    <div className="text-center bg-white/80 backdrop-blur rounded-3xl p-8 shadow-2xl">
                        <Calendar className="w-16 h-16 text-orange-600 mx-auto mb-4" />
                        <p className="text-gray-600 text-lg">This donation was approved for you on</p>
                        <p className="text-3xl font-bold text-orange-800">
                            {format(new Date(data.claims?.[0]?.claimed_at || data.created_at), "dd MMMM yyyy")}
                        </p>
                    </div>

                    {/* Thank You Message */}
                    <div className="text-center mt-12">
                        <p className="text-3xl font-bold text-green-700 mb-4">
                            Thank you for receiving this gift of food ❤️
                        </p>
                        <p className="text-xl text-gray-700">
                            Together, we're reducing waste and feeding families across Sri Lanka 🙏
                        </p>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}