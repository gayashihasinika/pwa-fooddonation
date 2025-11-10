// src/Pages/Donors/DonorDashboard.tsx
import { useState, useEffect } from "react";
import { Edit, Trash, Plus, Crown, Trophy } from "lucide-react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import CountUp from "react-countup";

interface User {
  id: number;
  name: string | null;
  email: string;
  role: string | null;
}

interface Donation {
  id: number;
  title: string;
  expiry_date: string;
  status: "active" | "expired";
  images?: { image_path: string }[];
}

interface Match {
  id: number;
  volunteer_name: string;
  donation_title: string;
}

interface Badge {
  id: number;
  title: string;
  unlocked: boolean;
}

export default function DonorDashboard() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [streakDays, setStreakDays] = useState(0);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [points, setPoints] = useState(0);
  const [rank, setRank] = useState(0);

  // Falling food animation
  const foodItems = ["🍎", "🍞", "🍛", "🍲", "🥗", "🍕", "🍌", "🍚", "🍪", "🍇"];
  const [visibleFoods, setVisibleFoods] = useState<
    { id: number; emoji: string; left: string; size: number }[]
  >([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newFood = {
        id: Date.now(),
        emoji: foodItems[Math.floor(Math.random() * foodItems.length)],
        left: `${Math.random() * 100}%`,
        size: Math.random() * 1.3 + 1,
      };
      setVisibleFoods((prev) => [...prev.slice(-10), newFood]);
      setTimeout(
        () => setVisibleFoods((prev) => prev.filter((f) => f.id !== newFood.id)),
        7000
      );
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Fetch user and donor data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token =
          sessionStorage.getItem("auth_token") || localStorage.getItem("auth_token");
        if (!token) return;
        const res = await axios.get("http://127.0.0.1:8001/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCurrentUser(res.data);
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (!currentUser) return;
    const fetchAll = async () => {
      try {
        const [donationsRes, matchesRes, trackerRes] = await Promise.all([
          axios.get(`http://127.0.0.1:8001/api/donors/donations?user_id=${currentUser.id}`),
          axios.get(`http://127.0.0.1:8001/api/donors/volunteer-matches?user_id=${currentUser.id}`),
          axios.get(`http://127.0.0.1:8001/api/donors/tracker?user_id=${currentUser.id}`),
        ]);
        setDonations(Array.isArray(donationsRes.data) ? donationsRes.data : []);
        setMatches(Array.isArray(matchesRes.data) ? matchesRes.data : []);
        setStreakDays(trackerRes.data.streakDays || 0);
        setBadges(trackerRes.data.badges || []);
        setPoints(trackerRes.data.points || 0);
        setRank(trackerRes.data.rank || 0);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchAll();
  }, [currentUser]);

  if (!currentUser)
    return <div className="flex justify-center items-center h-screen">Loading...</div>;

  return (
    <AuthenticatedLayout>
      {/* 🌈 Animated gradient background */}
      <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-rose-50 via-amber-50 to-orange-100 text-gray-900">
        {/* 🍱 Falling food animation */}
        <div className="pointer-events-none fixed inset-0 overflow-hidden z-10">
          {visibleFoods.map((food) => (
            <motion.div
              key={food.id}
              initial={{ y: -50, opacity: 0 }}
              animate={{
                y: "100vh",
                opacity: [1, 0.9, 0.7, 0],
                rotate: [0, 30, -30, 0],
              }}
              transition={{
                duration: 8 + Math.random() * 3,
                ease: "easeInOut",
              }}
              className="absolute"
              style={{
                left: food.left,
                fontSize: `${food.size}rem`,
                top: "-10%",
                zIndex: 9999,
              }}
            >
              {food.emoji}
            </motion.div>
          ))}
        </div>

        {/* Main dashboard content */}
        <div className="relative z-20 max-w-7xl mx-auto p-6 sm:p-10 space-y-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center sm:text-left bg-white/70 backdrop-blur-sm p-4 sm:p-6 rounded-2xl shadow-lg border border-white/40"
          >
            <h1 className="text-2xl sm:text-3xl font-bold text-rose-600">
              👋 Welcome back, {currentUser.name || currentUser.email}!
            </h1>
            <p className="text-gray-600 text-sm mt-1">
              You’re making a difference, one meal at a time. 💚
            </p>
          </motion.div>

          {/* Action Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="flex justify-center sm:justify-start"
          >
            <Button
              onClick={() => navigate("/donors/post-donation/post-donation-add")}
              className="bg-gradient-to-r from-rose-500 via-orange-400 to-amber-400 text-white px-6 py-3 rounded-full shadow-lg hover:scale-105 transition flex items-center gap-2"
            >
              <Plus size={20} /> Post New Donation
            </Button>
          </motion.div>

          {/* Stats Overview */}
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-4 gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="bg-white/70 rounded-lg shadow p-4 text-center">
              <div className="text-2xl font-bold text-rose-500">
                <CountUp end={points} duration={1.6} />
              </div>
              <div className="text-sm">Points</div>
            </div>
            <div className="bg-white/70 rounded-lg shadow p-4 text-center">
              <div className="text-2xl font-bold text-amber-500">
                <CountUp end={rank} duration={1.6} />#
              </div>
              <div className="text-sm">Leaderboard Rank</div>
            </div>
            <div className="bg-white/70 rounded-lg shadow p-4 text-center">
              <div className="text-2xl font-bold text-green-500">
                <CountUp end={streakDays} duration={1.6} />
              </div>
              <div className="text-sm">Streak Days</div>
            </div>
            <div className="bg-white/70 rounded-lg shadow p-4 text-center">
              <div className="text-2xl font-bold text-indigo-500">
                <CountUp end={badges.filter((b) => b.unlocked).length} duration={1.6} />
              </div>
              <div className="text-sm">Badges Earned</div>
            </div>
          </motion.div>

          {/* Donations Tabs */}
          <Card className="bg-white/70 backdrop-blur-sm shadow-xl border-none rounded-2xl">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">My Donations</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="active">
                <TabsList className="flex flex-wrap gap-2">
                  <TabsTrigger value="active">Active</TabsTrigger>
                  <TabsTrigger value="expired">Expired</TabsTrigger>
                </TabsList>
                <TabsContent
                  value="active"
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4"
                >
                  {donations
                    .filter((d) => d.status === "active")
                    .map((d) => (
                      <motion.div
                        key={d.id}
                        whileHover={{ scale: 1.03 }}
                        className="bg-white rounded-xl p-4 border shadow"
                      >
                        <h3 className="font-semibold text-rose-600">{d.title}</h3>
                        <p className="text-sm">Expiry: {d.expiry_date}</p>
                        <div className="flex gap-2 mt-2 flex-wrap">
                          {d.images?.map((img, idx) => (
                            <img
                              key={idx}
                              src={img.image_path}
                              alt={d.title}
                              className="w-20 h-20 object-cover rounded-lg border"
                            />
                          ))}
                        </div>
                        <div className="flex gap-2 mt-3">
                          <Button size="sm" variant="outline">
                            <Edit size={16} /> Edit
                          </Button>
                          <Button size="sm" variant="destructive">
                            <Trash size={16} /> Delete
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                </TabsContent>
                <TabsContent
                  value="expired"
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4"
                >
                  {donations.filter((d) => d.status === "expired").length === 0 ? (
                    <p>No expired donations 🎉</p>
                  ) : (
                    donations
                      .filter((d) => d.status === "expired")
                      .map((d) => (
                        <motion.div
                          key={d.id}
                          whileHover={{ scale: 1.02 }}
                          className="bg-gray-50 rounded-xl p-4 border"
                        >
                          <h3 className="font-semibold">{d.title}</h3>
                          <p className="text-sm text-gray-600">
                            Expired on: {d.expiry_date}
                          </p>
                        </motion.div>
                      ))
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Volunteer Matches */}
          <Card className="bg-white/70 backdrop-blur-sm shadow-xl border-none rounded-2xl">
            <CardHeader>
              <CardTitle>Volunteer Match Status</CardTitle>
            </CardHeader>
            <CardContent>
              {matches.length > 0 ? (
                matches.map((m) => (
                  <p key={m.id} className="text-sm">
                    ✅ {m.volunteer_name} assigned to “{m.donation_title}”
                  </p>
                ))
              ) : (
                <p>No volunteers assigned yet.</p>
              )}
            </CardContent>
          </Card>

          {/* Badges Display */}
          <Card className="bg-white/70 backdrop-blur-sm shadow-xl border-none rounded-2xl">
            <CardHeader>
              <CardTitle>Achievements</CardTitle>
            </CardHeader>
            <CardContent className="flex gap-3 flex-wrap">
              {badges.map((b) => (
                <div
                  key={b.id}
                  className={`p-2 rounded-md text-sm flex items-center gap-2 ${
                    b.unlocked
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  <Crown size={16} /> {b.title}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
