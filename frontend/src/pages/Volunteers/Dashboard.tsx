import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Truck, Users, Leaf, Package, Award } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

/* Mock Data */
const deliveryData = [
  { week: "Week 1", deliveries: 5 },
  { week: "Week 2", deliveries: 8 },
  { week: "Week 3", deliveries: 6 },
  { week: "Week 4", deliveries: 10 },
];

const leaderboard = [
  { name: "Gayashi", deliveries: 24 },
  { name: "Nimal", deliveries: 19 },
  { name: "Kavindu", deliveries: 15 },
];

export default function VolunteerDashboard() {
  return (
    <AuthenticatedLayout>
      <div className="space-y-8">
        {/* Page Title */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Volunteer Dashboard
          </h1>
          <p className="text-muted-foreground">
            Your impact at a glance
          </p>
        </div>

        {/* Motivation Banner */}
        <Card className="bg-gradient-to-r from-orange-600 to-amber-500 text-white border-none">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold">
              Thank you for making a difference ❤️
            </h2>
            <p className="mt-2 text-sm opacity-90">
              Your efforts reduce food waste and uplift communities across Sri Lanka.
            </p>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={<Truck className="h-5 w-5" />}
            title="Deliveries Completed"
            value="24"
          />
          <StatCard
            icon={<Package className="h-5 w-5" />}
            title="Food Rescued"
            value="120 meals"
          />
          <StatCard
            icon={<Users className="h-5 w-5" />}
            title="People Helped"
            value="85"
          />
          <StatCard
            icon={<Leaf className="h-5 w-5" />}
            title="CO₂ Saved"
            value="48 kg"
          />
        </div>

        {/* Chart + Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Monthly Delivery Activity</CardTitle>
            </CardHeader>
            <CardContent className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={deliveryData}>
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="deliveries"
                    stroke="#EA580C"
                    strokeWidth={3}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Monthly Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p>✅ 24 successful deliveries</p>
              <p>🍱 120 meals delivered</p>
              <p>👨‍👩‍👧‍👦 85 people supported</p>
              <p>🌍 48 kg CO₂ emissions saved</p>
            </CardContent>
          </Card>
        </div>

        {/* Badges + Leaderboard */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Badges */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-yellow-500" />
                Your Badges
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-3">
              <Badge variant="secondary">🏅 First Delivery</Badge>
              <Badge variant="secondary">🏅 10+ Deliveries</Badge>
              <Badge variant="secondary">🌱 Eco Hero</Badge>
            </CardContent>
          </Card>

          {/* Leaderboard */}
          <Card>
            <CardHeader>
              <CardTitle>Volunteer Leaderboard</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {leaderboard.map((v, index) => (
                <div key={index}>
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">
                      {index + 1}. {v.name}
                    </span>
                    <span className="font-semibold text-orange-600">
                      {v.deliveries} deliveries
                    </span>
                  </div>
                  {index !== leaderboard.length - 1 && (
                    <Separator className="my-3" />
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}

/* Stat Card */
function StatCard({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
}) {
  return (
    <Card>
      <CardContent className="p-6 flex items-center gap-4">
        <div className="rounded-lg bg-orange-100 p-3 text-orange-700">
          {icon}
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}
