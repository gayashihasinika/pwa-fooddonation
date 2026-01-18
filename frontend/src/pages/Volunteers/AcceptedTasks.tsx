import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import api from "@/lib/api";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Truck,
  MapPin,
  Package,
  Clock,
  ChevronRight,
  ArrowLeft
} from "lucide-react";

export default function AcceptedTasks() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchAcceptedTasks = async () => {
    try {
      const res = await api.get("/volunteers/accepted-tasks");
      setTasks(Array.isArray(res.data?.data) ? res.data.data : []);
    } catch (error) {
      console.error("Failed to load accepted tasks", error);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAcceptedTasks();
  }, []);

  const formatStatus = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <AuthenticatedLayout>
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-white py-8 px-5 md:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Truck className="h-9 w-9 text-emerald-600" strokeWidth={1.7} />
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-emerald-700 to-teal-600 bg-clip-text text-transparent">
                  My Accepted Deliveries
                </h1>
              </div>
              <p className="text-gray-600/90 text-lg">
                Manage your active delivery commitments • {tasks.length} task{tasks.length !== 1 ? 's' : ''}
              </p>
            </div>

            <Button
              variant="outline"
              className="border-emerald-400 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800"
              onClick={() => navigate("/volunteers/delivery-tasks")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Available Tasks
            </Button>
          </div>

          {/* Loading */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="h-64 bg-white/60 rounded-2xl animate-pulse border border-emerald-100/60"
                />
              ))}
            </div>
          ) : tasks.length === 0 ? (
            /* Empty State */
            <div className="flex flex-col items-center justify-center py-20 bg-white/60 backdrop-blur-sm rounded-3xl border border-emerald-100/70 shadow-sm">
              <Truck className="h-20 w-20 text-emerald-300 mb-8" strokeWidth={1.3} />
              <h2 className="text-3xl font-bold text-emerald-800 mb-4">
                No Active Deliveries Yet
              </h2>
              <p className="text-gray-600 text-lg max-w-md text-center mb-8">
                When you accept a delivery task, it will appear here so you can easily track and manage it.
              </p>
              <Button
                size="lg"
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-md"
                onClick={() => navigate("/volunteers/delivery-tasks")}
              >
                Find Tasks to Accept
              </Button>
            </div>
          ) : (
            /* Task Cards */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 xl:gap-8">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="group relative bg-white rounded-2xl shadow-md hover:shadow-xl 
                           border border-emerald-100/70 overflow-hidden transition-all duration-300
                           hover:-translate-y-2 hover:border-emerald-300/50"
                >
                  {/* Status & Accent Bar */}
                  <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 to-teal-500" />

                  <div className="p-6">
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <h3 className="text-xl font-bold text-gray-800 group-hover:text-emerald-700 transition-colors line-clamp-2">
                        {task.donation?.title || "Delivery Task"}
                      </h3>

                      <span className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide
                        ${task.status === "accepted"
                          ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                          : task.status === "in_progress"
                            ? "bg-amber-100 text-amber-700 border border-amber-200"
                            : task.status === "completed"
                              ? "bg-sky-100 text-sky-700 border border-sky-200"
                              : "bg-gray-100 text-gray-600 border border-gray-200"}`}
                      >
                        {formatStatus(task.status)}
                      </span>
                    </div>

                    <div className="space-y-4 text-gray-700">
                      <div className="flex items-center gap-2.5">
                        <MapPin className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                        <span className="line-clamp-1">{task.donation?.pickup_address || "—"}</span>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                        <div className="flex items-center gap-2">
                          <Package className="h-4 w-4 text-emerald-600" />
                          <span>Qty: <strong>{task.donation?.quantity || "?"}</strong></span>
                        </div>

                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="h-4 w-4 text-teal-700" />
                          <span>Accepted: <strong>{new Date(task.accepted_at || task.created_at).toLocaleDateString()}</strong></span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6">
                      <Button
                        variant="outline"
                        className="w-full border-emerald-300 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800 group-hover:border-emerald-400 transition-colors"
                        onClick={() => navigate(`/volunteers/accepted-tasks/${task.id}`)}
                      >
                        View Details & Progress
                        <ChevronRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AuthenticatedLayout>
  );
}