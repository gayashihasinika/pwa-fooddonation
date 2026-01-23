import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import api from "@/lib/api";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
    ArrowLeft,
    CheckCircle2,
    Truck,
    PackageCheck,
    MapPin,
    Package,
    CalendarClock,
    Tag,
    Info
} from "lucide-react";

export default function AcceptedTaskDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [task, setTask] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    const markAsPickedUp = async () => {
    try {
        setUpdating(true);

        const res = await api.post(
            `/volunteers/accepted-tasks/${task.id}/mark-as-picked-up`
        );

        setTask((prev: any) => ({
            ...prev,
            status: res.data.status,
            picked_up_at: new Date().toISOString(),
        }));
    } catch (err) {
        alert("Failed to mark as picked up");
    } finally {
        setUpdating(false);
    }
};

const markAsDelivered = async () => {
    try {
        setUpdating(true);

        const res = await api.post(
            `/volunteers/accepted-tasks/${task.id}/mark-as-delivered`
        );

        setTask((prev: any) => ({
            ...prev,
            status: res.data.status,
            delivered_at: new Date().toISOString(),
        }));
    } catch (err) {
        alert("Failed to complete delivery");
    } finally {
        setUpdating(false);
    }
};


    useEffect(() => {
        api
            .get(`/volunteers/accepted-tasks/${id}`)
            .then(res => setTask(res.data))
            .catch(() => setTask(null))
            .finally(() => setLoading(false));
    }, [id]);

    const formatDate = (dateStr?: string) => {
        if (!dateStr) return "—";
        return new Date(dateStr).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    const statusSteps = [
        { key: "accepted", label: "Accepted", icon: CheckCircle2 },
        { key: "picked_up", label: "Picked Up", icon: Truck },
        { key: "delivered", label: "Delivered", icon: PackageCheck },
    ];

    const currentStepIndex = statusSteps.findIndex(s => s.key === task?.status);

    if (loading) {
        return (
            <AuthenticatedLayout>
                <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-white flex items-center justify-center">
                    <div className="text-center">
                        <div className="h-12 w-12 rounded-full border-4 border-emerald-200 border-t-emerald-600 animate-spin mx-auto mb-4" />
                        <p className="text-gray-600 font-medium">Loading your delivery task...</p>
                    </div>
                </div>
            </AuthenticatedLayout>
        );
    }

    if (!task) {
        return (
            <AuthenticatedLayout>
                <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-white flex items-center justify-center p-6">
                    <div className="text-center max-w-md">
                        <Truck className="mx-auto h-16 w-16 text-emerald-300 mb-6" strokeWidth={1.3} />
                        <h2 className="text-2xl font-bold text-emerald-800 mb-3">Task not found</h2>
                        <p className="text-gray-600 mb-8">
                            This delivery task could not be found or may have been completed/removed.
                        </p>
                        <Button
                            onClick={() => navigate(-1)}
                            className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
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
            <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-white py-8 px-5 md:px-8">
                <div className="mx-auto max-w-4xl">
                    {/* Back button */}
                    <Button
                        variant="ghost"
                        className="mb-6 text-emerald-700 hover:text-emerald-800 hover:bg-emerald-100/60 -ml-3"
                        onClick={() => navigate(-1)}
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to My Tasks
                    </Button>

                    {/* Main Card */}
                    <div className="bg-white rounded-2xl shadow-xl border border-emerald-100/70 overflow-hidden">
                        {/* Top accent bar */}
                        <div className="h-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600" />

                        <div className="p-6 md:p-9">
                            {/* Header */}
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-7">
                                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 leading-tight">
                                    {task.donation?.title || "Delivery Task"}
                                </h1>
                                <div className="shrink-0 px-4 py-2 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium uppercase tracking-wide">
                                    {task.status?.charAt(0).toUpperCase() + task.status?.slice(1) || "Active"}
                                </div>
                            </div>

                            {/* Progress Tracker */}
                            <div className="mb-10">
                                <h2 className="text-lg font-semibold text-gray-800 mb-5 flex items-center gap-2">
                                    <Info className="h-5 w-5 text-emerald-600" />
                                    Delivery Progress
                                </h2>

                                <div className="relative">
                                    {/* Connecting line */}
                                    <div className="absolute top-6 left-0 right-0 h-1 bg-gray-200 rounded-full" />
                                    <div
                                        className="absolute top-6 left-0 h-1 bg-emerald-500 rounded-full transition-all duration-500"
                                        style={{ width: `${(currentStepIndex + 1) / statusSteps.length * 100}%` }}
                                    />

                                    <div className="relative flex justify-between">
                                        {statusSteps.map((step, index) => {
                                            const Icon = step.icon;
                                            const isActive = index <= currentStepIndex;
                                            const isCurrent = index === currentStepIndex;

                                            return (
                                                <div key={step.key} className="flex flex-col items-center flex-1">
                                                    <div
                                                        className={`h-12 w-12 flex items-center justify-center rounded-full mb-3 border-4 transition-all duration-300
                              ${isActive
                                                                ? "bg-emerald-500 border-emerald-500 text-white shadow-lg"
                                                                : "bg-white border-gray-300 text-gray-400"} 
                              ${isCurrent ? "ring-4 ring-emerald-200 scale-110" : ""}`}
                                                    >
                                                        <Icon className="h-6 w-6" />
                                                    </div>
                                                    <p className={`text-sm font-medium ${isActive ? "text-emerald-700" : "text-gray-500"}`}>
                                                        {step.label}
                                                    </p>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            {/* Details Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
                                <DetailCard
                                    icon={<MapPin className="h-5 w-5" />}
                                    label="Pickup Location"
                                    value={task.donation?.pickup_address || "—"}
                                    accent="emerald"
                                />

                                <DetailCard
                                    icon={<Package className="h-5 w-5" />}
                                    label="Quantity"
                                    value={task.donation?.quantity ?? "?"}
                                    accent="emerald"
                                />

                                <DetailCard
                                    icon={<CalendarClock className="h-5 w-5" />}
                                    label="Expiry Date"
                                    value={formatDate(task.donation?.expiry_date)}
                                    accent="teal"
                                />

                                <DetailCard
                                    icon={<Tag className="h-5 w-5" />}
                                    label="Category"
                                    value={task.donation?.category || "—"}
                                    accent="emerald"
                                />
                            </div>

                            {/* Action area */}
                            <div className="pt-7 border-t border-gray-100 flex flex-col sm:flex-row gap-4">
                                <Button
                                    variant="outline"
                                    className="flex-1 border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                                    onClick={() => navigate(-1)}
                                >
                                    ← Back to List
                                </Button>

                                {/* Example conditional actions - customize as needed */}
                               {task.status === "accepted" && (
    <Button
        disabled={updating}
        className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600"
        onClick={markAsPickedUp}
    >
        {updating ? "Updating..." : "Mark as Picked Up"}
    </Button>
)}

{task.status === "picked_up" && (
    <Button
        disabled={updating}
        className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600"
        onClick={markAsDelivered}
    >
        {updating ? "Updating..." : "Complete Delivery"}
    </Button>
)}

                            </div>
                        </div>
                    </div>

                    <p className="text-center text-sm text-gray-500 mt-8">
                        Thank you for helping with this delivery • Your support means a lot! 🌱
                    </p>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

function DetailCard({
    icon,
    label,
    value,
    accent = "emerald"
}: {
    icon: React.ReactNode;
    label: string;
    value: string | number;
    accent?: "emerald" | "teal";
}) {
    const colorClasses = accent === "teal"
        ? "bg-teal-50 text-teal-800 border-teal-100"
        : "bg-emerald-50 text-emerald-800 border-emerald-100";

    return (
        <div className={`rounded-xl p-5 border ${colorClasses} flex flex-col items-center text-center`}>
            <div className="mb-3 opacity-90">{icon}</div>
            <div className="text-xs font-medium uppercase tracking-wider opacity-70 mb-1">
                {label}
            </div>
            <div className="font-semibold text-base">{value}</div>
        </div>
    );
}