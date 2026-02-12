import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import api from "@/lib/api";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import {
  Truck,
  MapPin,
  Package,
  Clock,
  ChevronRight,
  ArrowLeft,
} from "lucide-react";

export default function AcceptedTasks() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchAcceptedTasks = async () => {
    try {
      const res = await api.get("/volunteers/accepted-tasks");
      setTasks(Array.isArray(res.data?.data) ? res.data.data : []);
    } catch {
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAcceptedTasks();
  }, []);

  const formatStatus = (status: string) =>
    status.charAt(0).toUpperCase() + status.slice(1);

  const statusVariant = (status: string) => {
    switch (status) {
      case "accepted":
        return "secondary";
      case "in_progress":
        return "outline";
      case "completed":
        return "default";
      default:
        return "outline";
    }
  };

  return (
    <AuthenticatedLayout>
      <div className="max-w-7xl mx-auto p-6 lg:p-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
              <Truck className="h-8 w-8 text-emerald-600" />
              My Accepted Deliveries
            </h1>
            <p className="text-muted-foreground mt-1">
              {tasks.length} active task{tasks.length !== 1 && "s"}
            </p>
          </div>

          <Button
            variant="outline"
            onClick={() => navigate("/volunteers/delivery-tasks")}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Available Tasks
          </Button>
        </div>

        {/* Loading */}
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
          <Card className="py-16 text-center">
            <CardContent className="space-y-5">
              <Truck className="h-14 w-14 mx-auto text-muted-foreground" />
              <h2 className="text-2xl font-semibold">
                No active deliveries
              </h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                Accepted delivery tasks will appear here so you can track their progress.
              </p>
              <Button
                size="lg"
                onClick={() => navigate("/volunteers/delivery-tasks")}
              >
                Find Delivery Tasks
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Task Cards */}
        {!loading && tasks.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks.map((task) => (
              <Card
                key={task.id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardHeader className="space-y-2">
                  <div className="flex justify-between items-start gap-3">
                    <CardTitle className="line-clamp-2">
                      {task.donation?.title || "Delivery Task"}
                    </CardTitle>

                    <Badge variant={statusVariant(task.status)}>
                      {formatStatus(task.status)}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span className="line-clamp-1">
                      {task.donation?.pickup_address || "—"}
                    </span>
                  </div>

                  <Separator />

                  <div className="flex justify-between">
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-emerald-600" />
                      <span>
                        Qty: <strong>{task.donation?.quantity || "?"}</strong>
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-teal-600" />
                      <span>
                        Accepted:{" "}
                        <strong>
                          {new Date(
                            task.accepted_at || task.created_at
                          ).toLocaleDateString()}
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
                      navigate(`/volunteers/accepted-tasks/${task.id}`)
                    }
                  >
                    View Details & Progress
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
