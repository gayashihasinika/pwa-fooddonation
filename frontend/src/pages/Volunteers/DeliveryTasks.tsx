import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import api from "@/lib/api";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";
import {
  Clock,
  MapPin,
  Package,
  ChevronRight,
  Truck,
} from "lucide-react";

export default function DeliveryTasks() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchTasks = async () => {
    try {
      const res = await api.get("/volunteers/delivery-tasks");
      setTasks(Array.isArray(res.data?.data) ? res.data.data : []);
    } catch {
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
      <div className="p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
              <Truck className="h-8 w-8 text-orange-600" />
              Delivery Tasks
            </h1>
            <p className="text-muted-foreground mt-1">
              {tasks.length} available task{tasks.length !== 1 && "s"}
            </p>
          </div>

          <Button
            variant="outline"
            size="lg"
            onClick={() => navigate("/volunteers/accepted-tasks")}
            className="gap-2"
          >
            <Truck className="h-4 w-4" />
            My Accepted Deliveries
          </Button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                </CardHeader>
                <CardContent className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                </CardContent>
                <CardFooter>
                  <Skeleton className="h-9 w-full" />
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && tasks.length === 0 && (
          <Card className="text-center py-16">
            <CardContent className="space-y-4">
              <Truck className="mx-auto h-14 w-14 text-muted-foreground" />
              <h3 className="text-xl font-semibold">
                No delivery tasks available
              </h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Check back later or review your accepted deliveries.
              </p>
              <Button
                className="mt-4"
                onClick={() => navigate("/volunteers/accepted-tasks")}
              >
                Go to My Accepted Tasks
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Tasks Grid */}
        {!loading && tasks.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks.map((task) => (
              <Card
                key={task.id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <CardTitle className="line-clamp-2">
                    {task.donation?.title || "Delivery Request"}
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-3 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span className="line-clamp-1">
                      {task.donation?.pickup_address || "—"}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-orange-600" />
                      <span>
                        Qty:{" "}
                        <strong>{task.donation?.quantity || "?"}</strong>
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-amber-600" />
                      <span>
                        Exp:{" "}
                        <strong>
                          {formatDate(task.donation?.expiry_date)}
                        </strong>
                      </span>
                    </div>
                  </div>
                </CardContent>

                <CardFooter>
                  <Button
                    variant="outline"
                    className="w-full gap-1"
                    onClick={() =>
                      navigate(`/volunteers/delivery-tasks/${task.id}`)
                    }
                  >
                    View Details
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AuthenticatedLayout>
  );
}
