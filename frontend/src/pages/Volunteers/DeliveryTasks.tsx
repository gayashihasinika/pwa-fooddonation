import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import api from "@/lib/api";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  Clock,
  MapPin,
  Package,
  ChevronRight,
  Truck
} from "lucide-react";

export default function DeliveryTasks() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchTasks = async () => {
    try {
      const res = await api.get("/volunteers/delivery-tasks");
      setTasks(Array.isArray(res.data?.data) ? res.data.data : []);
    } catch (error) {
      console.error(error);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date?: string) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <AuthenticatedLayout>
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-white p-5 md:p-8 pb-20">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Truck className="h-9 w-9 text-orange-600" strokeWidth={1.8} />
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500 bg-clip-text text-transparent">
                  Delivery Tasks
                </h1>
              </div>
              <p className="text-gray-600/90 text-lg">
                Help deliver kindness — {tasks.length} available task{tasks.length !== 1 ? 's' : ''}
              </p>
            </div>

            <Button
              variant="outline"
              size="lg"
              className="group border-2 border-orange-400/40 hover:border-orange-500 text-orange-700 hover:text-orange-800 
                         bg-white/70 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300
                         rounded-xl px-6 gap-2"
              onClick={() => navigate("/volunteers/accepted-tasks")}
            >
              <Truck className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              My Accepted Deliveries
            </Button>
          </div>

          {/* Loading */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="h-12 w-12 rounded-full border-4 border-orange-200 border-t-orange-600 animate-spin mb-4" />
              <p className="text-gray-600 font-medium">Finding tasks for you...</p>
            </div>
          ) : tasks.length === 0 ? (
            <div className="text-center py-20 bg-white/40 backdrop-blur-sm rounded-3xl border border-orange-100 shadow-sm">
              <Truck className="mx-auto h-16 w-16 text-orange-300 mb-6" strokeWidth={1.2} />
              <h3 className="text-2xl font-semibold text-gray-700 mb-3">
                No available delivery tasks right now
              </h3>
              <p className="text-gray-500 max-w-md mx-auto">
                Check back later or look at your already accepted deliveries!
              </p>
              <Button
                className="mt-8 bg-gradient-to-r from-orange-500 to-amber-600"
                onClick={() => navigate("/volunteers/accepted-tasks")}
              >
                Go to My Accepted Tasks
              </Button>
            </div>
          ) : (
            /* Cards Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 xl:gap-8">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="group relative bg-white rounded-2xl shadow-md hover:shadow-xl 
                           border border-orange-100/60 overflow-hidden transition-all duration-300
                           hover:-translate-y-2 hover:border-orange-300/40"
                >
                  {/* Subtle top accent */}
                  <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-orange-400 to-amber-500" />

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 group-hover:text-orange-700 transition-colors line-clamp-2">
                      {task.donation?.title || "Delivery Request"}
                    </h3>

                    <div className="mt-4 space-y-3 text-sm">
                      <div className="flex items-center gap-2.5 text-gray-700">
                        <MapPin className="h-4 w-4 text-orange-600 flex-shrink-0" />
                        <span className="line-clamp-1">{task.donation?.pickup_address || "—"}</span>
                      </div>

                      <div className="flex items-center justify-between text-gray-700">
                        <div className="flex items-center gap-2">
                          <Package className="h-4 w-4 text-orange-600" />
                          <span>Qty: <strong>{task.donation?.quantity || "?"}</strong></span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-amber-700" />
                          <span>Exp: <strong>{formatDate(task.donation?.expiry_date)}</strong></span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-6 flex gap-3">
                      <Button
                        variant="outline"
                        className="flex-1 border-orange-300 text-orange-700 hover:bg-orange-50 
                                 hover:text-orange-800 transition-colors"
                        onClick={() => navigate(`/volunteers/delivery-tasks/${task.id}`)}
                      >
                        View Details
                        <ChevronRight className="ml-1.5 h-4 w-4" />
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