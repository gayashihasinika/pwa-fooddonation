import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import api from "@/lib/api";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
    ArrowLeft,
    MapPin,
    Package,
    CalendarClock,
    Tag,
    Truck,
    Image as ImageIcon,
    ChevronLeft,
    ChevronRight
} from "lucide-react";

export default function DeliveryTaskDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [task, setTask] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        api.get(`/volunteers/delivery-tasks/${id}`)
            .then(res => setTask(res.data))
            .catch(() => setTask(null))
            .finally(() => setLoading(false));
    }, [id]);

    const images = task?.donation?.images || []; // assuming array of urls
    // Alternative common structures you might have:
    // task?.donation?.image_urls
    // task?.donation?.photos?.map(p => p.url)
    // task?.donation?.media

    const hasImages = Array.isArray(images) && images.length > 0;

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    if (loading) {
        return (
            <AuthenticatedLayout>
                <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-white flex items-center justify-center">
                    <div className="flex flex-col items-center gap-4">
                        <div className="h-12 w-12 rounded-full border-4 border-orange-200 border-t-orange-600 animate-spin" />
                        <p className="text-gray-600 font-medium">Loading donation details...</p>
                    </div>
                </div>
            </AuthenticatedLayout>
        );
    }

    if (!task) {
        return (
            <AuthenticatedLayout>
                <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-white flex items-center justify-center p-6">
                    <div className="text-center max-w-md">
                        <Truck className="mx-auto h-16 w-16 text-orange-300 mb-6" strokeWidth={1.3} />
                        <h2 className="text-2xl font-bold text-gray-800 mb-3">Task not found</h2>
                        <p className="text-gray-600 mb-8">
                            The delivery task you're looking for might have been removed or is no longer available.
                        </p>
                        <Button
                            onClick={() => navigate(-1)}
                            className="bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700"
                        >
                            ← Go Back
                        </Button>
                    </div>
                </div>
            </AuthenticatedLayout>
        );
    }

    return (
        <AuthenticatedLayout>
            <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-white py-8 px-5 md:px-8">
                <div className="mx-auto max-w-4xl">
                    {/* Back button */}
                    <Button
                        variant="ghost"
                        className="mb-6 text-orange-700 hover:text-orange-800 hover:bg-orange-100/50 -ml-3"
                        onClick={() => navigate(-1)}
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to available tasks
                    </Button>

                    <div className="bg-white rounded-2xl shadow-xl border border-orange-100/60 overflow-hidden">
                        {/* Top accent */}
                        <div className="h-2 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600" />

                        {/* Image Gallery Section */}
                        <div className="relative">
                            {hasImages ? (
                                <>
                                    {/* Main image */}
                                    <div className="relative h-64 md:h-80 lg:h-96 bg-gray-100 overflow-hidden">
                                        <img
                                            src={images[currentImageIndex]}
                                            alt={`${task.donation.title} - image ${currentImageIndex + 1}`}
                                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = "/placeholder-food.jpg"; // fallback
                                            }}
                                        />

                                        {/* Navigation arrows */}
                                        {images.length > 1 && (
                                            <>
                                                <button
                                                    onClick={prevImage}
                                                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full transition-colors"
                                                >
                                                    <ChevronLeft size={24} />
                                                </button>
                                                <button
                                                    onClick={nextImage}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full transition-colors"
                                                >
                                                    <ChevronRight size={24} />
                                                </button>
                                            </>
                                        )}

                                        {/* Image counter */}
                                        {images.length > 1 && (
                                            <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-3 py-1.5 rounded-full">
                                                {currentImageIndex + 1} / {images.length}
                                            </div>
                                        )}
                                    </div>

                                    {/* Thumbnails */}
                                    {images.length > 1 && (
                                        <div className="flex gap-2 p-4 bg-gray-50 overflow-x-auto">
                                            {images.map((img: string, idx: number) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => setCurrentImageIndex(idx)}
                                                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${idx === currentImageIndex
                                                            ? "border-orange-500 shadow-md"
                                                            : "border-transparent opacity-70 hover:opacity-100"
                                                        }`}
                                                >
                                                    <img
                                                        src={img}
                                                        alt={`Thumbnail ${idx + 1}`}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="h-64 md:h-80 lg:h-96 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                                    <div className="text-center text-gray-400">
                                        <ImageIcon size={48} className="mx-auto mb-3 opacity-50" />
                                        <p>No photos available for this donation</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Content */}
                        <div className="p-6 md:p-9">
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
                                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 leading-tight">
                                    {task.donation.title}
                                </h1>
                                <div className="shrink-0 px-4 py-2 bg-gradient-to-r from-orange-100 to-amber-100 text-orange-800 rounded-full text-sm font-medium shadow-sm">
                                    Delivery Request
                                </div>
                            </div>

                            {/* Main info */}
                            <div className="space-y-7">
                                <div className="flex items-start gap-3 text-gray-700">
                                    <MapPin className="h-5 w-5 text-orange-600 mt-1 flex-shrink-0" />
                                    <div>
                                        <div className="font-medium text-gray-800 mb-0.5">Pickup Location</div>
                                        <div className="text-base">{task.donation.pickup_address}</div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-3 border-t border-gray-100">
                                    <InfoItem icon={<Package />} label="Quantity" value={task.donation.quantity} color="orange" />
                                    <InfoItem
                                        icon={<CalendarClock />}
                                        label="Expiry Date"
                                        value={task.donation.expiry_date?.split('T')[0] || "—"}
                                        color="amber"
                                    />
                                    <InfoItem icon={<Tag />} label="Category" value={task.donation.category || "—"} color="orange" />
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="mt-10 pt-7 border-t border-gray-100 flex flex-col sm:flex-row gap-4">
                                <Button
                                    variant="outline"
                                    className="flex-1 border-orange-400 text-orange-700 hover:bg-orange-50"
                                    onClick={() => navigate(-1)}
                                >
                                    ← Return to list
                                </Button>

                                <Button
                                    className="flex-1 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 shadow-md hover:shadow-lg transition-all"
                                    onClick={() => {
                                        // Add your accept task API call here
                                        alert("Task accepted! (Add real accept logic here)");
                                    }}
                                >
                                    Accept This Delivery Task
                                </Button>
                            </div>
                        </div>
                    </div>

                    <p className="text-center text-sm text-gray-500 mt-8">
                        Please check the photos carefully • Only accept if you can deliver in time • Thank you! 🍊
                    </p>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

function InfoItem({
    icon,
    label,
    value,
    color = "orange"
}: {
    icon: React.ReactNode;
    label: string;
    value: string | number;
    color?: "orange" | "amber";
}) {
    const colorClasses = color === "amber"
        ? "text-amber-700 bg-amber-50 border-amber-200"
        : "text-orange-700 bg-orange-50 border-orange-200";

    return (
        <div className={`flex flex-col items-center p-5 rounded-xl border ${colorClasses}`}>
            <div className="mb-3 opacity-85">{icon}</div>
            <div className="text-xs font-medium uppercase tracking-wider opacity-70 mb-1.5">
                {label}
            </div>
            <div className="text-xl font-semibold">{value}</div>
        </div>
    );
}