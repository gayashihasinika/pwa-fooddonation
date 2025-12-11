// src/pages/Donors/ChallengeDashboard.tsx
import { useEffect, useState, useMemo } from "react";
import api from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Award, Flame, Lock, CheckCircle, XCircle } from "lucide-react";
import { toast } from "react-hot-toast";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

type AuthUser = { id: number };

interface Challenge {
  id: number;
  title: string;
  description: string;
  points_reward: number;
  start_date: string;
  end_date: string;
  active: number;
  status: "active" | "completed" | "upcoming" | "expired" | "inactive";
  completed: boolean;
  user_points_earned?: number;
  progress?: number; // optional for future use
}

export default function ChallengeDashboard() {
  const authUser: AuthUser | null = useMemo(() => {
    try {
      const raw = localStorage.getItem("authUser");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }, []);

  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadChallenges();
  }, []);

  const loadChallenges = async () => {
    try {
      const res = await api.get("/donors/challenges");
      console.log("API response:", res.data);
      setChallenges(res.data.challenges);
    } catch (err) {
      toast.error("Failed to load challenges");
    } finally {
      setLoading(false);
    }
  };

  const completeChallenge = async (id: number) => {
    try {
      await api.post(`/donors/challenges/${id}/complete`);
      toast.success("Challenge completed!");
      loadChallenges(); // refresh challenges
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to complete challenge");
    }
  };

  const sectionTitle = (text: string) => (
    <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
      <Flame className="text-orange-600" /> {text}
    </h2>
  );

  const statusConfig = {
    active: { color: "bg-orange-100 text-orange-700", icon: <Flame /> },
    completed: { color: "bg-green-200 text-green-800", icon: <CheckCircle /> },
    upcoming: { color: "bg-gray-200 text-gray-700", icon: <Lock /> },
    expired: { color: "bg-red-200 text-red-800", icon: <XCircle /> },
  };

  if (loading) {
    return (
      <AuthenticatedLayout>
        <p className="text-center mt-10 text-lg font-medium">Loading challenges...</p>
      </AuthenticatedLayout>
    );
  }

  // Filter challenges by status
  const active = challenges.filter((c) => c.status === "active");
  const completed = challenges.filter((c) => c.status === "completed");
  const upcoming = challenges.filter((c) => c.status === "upcoming");

  return (
    <AuthenticatedLayout>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-rose-50 py-10 px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-5xl mx-auto"
        >
          {/* Dashboard Header */}
          <Card className="shadow-xl rounded-3xl border-0 mb-8">
            <CardHeader className="text-center py-8 bg-gradient-to-r from-rose-600 to-orange-600 text-white">
              <CardTitle className="text-4xl font-bold">
                Donor Challenge Dashboard
              </CardTitle>
              <p className="text-lg opacity-90">Complete challenges and earn more points</p>
            </CardHeader>
          </Card>

          {/* Active Challenges */}
          {sectionTitle("Active Challenges")}
          <div className="grid md:grid-cols-2 gap-6 mb-10">
            {active.length ? (
              active.map((challenge) => (
                <motion.div
                  key={challenge.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                >
                  <Card className="border-l-8 border-orange-500 rounded-2xl shadow-lg">
                    <CardContent className="py-6">
                      <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <Award className="text-orange-600" /> {challenge.title}
                      </h3>
                      <p className="text-gray-600 mt-2">{challenge.description}</p>

                      {/* Optional progress bar */}
                      {challenge.progress !== undefined && (
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                          <div
                            className="bg-orange-500 h-2 rounded-full"
                            style={{ width: `${challenge.progress}%` }}
                          />
                        </div>
                      )}

                      <div className="mt-4 flex justify-between items-center">
                        <span className="text-orange-700 font-bold text-lg">
                          +{challenge.points_reward} points
                        </span>
                        <button
                          onClick={() => completeChallenge(challenge.id)}
                          className="px-3 py-1 bg-blue-500 text-white rounded-full text-sm hover:bg-blue-600 transition"
                        >
                          Mark as Completed
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            ) : (
              <p>No active challenges</p>
            )}
          </div>

          {/* Completed Challenges */}
          {sectionTitle("Completed Challenges")}
          <div className="grid md:grid-cols-2 gap-6 mb-10">
            {completed.length ? (
              completed.map((challenge) => (
                <Card
                  key={challenge.id}
                  className="rounded-2xl shadow-lg border-l-8 border-green-500 bg-green-50"
                >
                  <CardContent className="py-6">
                    <h3 className="text-xl font-bold flex items-center gap-2 text-green-700">
                      <CheckCircle className="text-green-600" /> {challenge.title}
                    </h3>
                    <p className="text-gray-600 mt-2">{challenge.description}</p>

                    <div className="mt-4 flex justify-between items-center">
                      <span className="text-green-700 font-bold text-lg">
                        Earned: +{challenge.user_points_earned || challenge.points_reward}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${
                          statusConfig[challenge.status]?.color
                        }`}
                      >
                        {challenge.status.charAt(0).toUpperCase() + challenge.status.slice(1)}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p>No completed challenges yet</p>
            )}
          </div>

          {/* Upcoming Challenges */}
          {sectionTitle("Upcoming Challenges")}
          <div className="grid md:grid-cols-2 gap-6">
            {upcoming.length ? (
              upcoming.map((challenge) => (
                <Card
                  key={challenge.id}
                  className="rounded-2xl shadow-lg border-l-8 border-gray-400 bg-gray-50"
                >
                  <CardContent className="py-6">
                    <h3 className="text-xl font-bold flex items-center gap-2 text-gray-700">
                      <Lock className="text-gray-600" /> {challenge.title}
                    </h3>
                    <p className="text-gray-600 mt-2">{challenge.description}</p>

                    <div className="mt-4 flex justify-between items-center">
                      <span className="text-gray-700 font-bold text-lg">
                        +{challenge.points_reward} points
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${
                          statusConfig[challenge.status]?.color
                        }`}
                      >
                        {challenge.status.charAt(0).toUpperCase() + challenge.status.slice(1)}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p>No upcoming challenges</p>
            )}
          </div>
        </motion.div>
      </div>
    </AuthenticatedLayout>
  );
}
