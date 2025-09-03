// src/Pages/Donors/DonorDashboard.tsx
import { useState, useEffect } from "react";
import { Edit, Trash, Plus, Crown, Trophy } from "lucide-react";
import axios from "axios";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { useNavigate } from "react-router-dom";

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

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = sessionStorage.getItem("auth_token") || localStorage.getItem("auth_token");
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

    const fetchDonations = async () => {
      try {
        const res = await axios.get(
          `http://127.0.0.1:8001/api/donors/donations?user_id=${currentUser.id}`
        );
        setDonations(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Failed to fetch donations:", err);
      }
    };

    const fetchMatches = async () => {
      try {
        const res = await axios.get(
          `http://127.0.0.1:8001/api/donors/volunteer-matches?user_id=${currentUser.id}`
        );
        setMatches(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Failed to fetch matches:", err);
      }
    };

    const fetchTracker = async () => {
      try {
        const res = await axios.get(
          `http://127.0.0.1:8001/api/donors/tracker?user_id=${currentUser.id}`
        );
        setStreakDays(res.data.streakDays || 0);
        setBadges(res.data.badges || []);
        setPoints(res.data.points || 0);
        setRank(res.data.rank || 0);
      } catch (err) {
        console.error("Failed to fetch tracker:", err);
      }
    };

    fetchDonations();
    fetchMatches();
    fetchTracker();
  }, [currentUser]);

  if (!currentUser)
    return <div className="flex justify-center items-center h-screen">Loading...</div>;

  return (
    <AuthenticatedLayout>
      <div className="flex flex-col gap-6 px-4 sm:px-6 lg:px-8">

        {/* Welcome Header */}
        <div className="bg-green-100 text-green-800 p-4 sm:p-6 rounded-lg shadow-md text-xl sm:text-2xl font-bold text-center sm:text-left">
          👋 Welcome back, {currentUser.name || currentUser.email}!
        </div>

        {/* Post New Donation Button */}
        <div className="flex justify-center sm:justify-start">
          <Button
            onClick={() => navigate("/donors/post-donation/post-donation-add")}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg flex items-center gap-2 w-full sm:w-auto"
          >
            <Plus size={20} /> Post New Donation
          </Button>
        </div>

        {/* My Donations */}
        <Card>
          <CardHeader>
            <CardTitle>My Donations</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="active">
              <TabsList className="flex flex-col sm:flex-row gap-2 sm:gap-0">
                <TabsTrigger value="active" className="flex-1 text-center sm:text-left">Active</TabsTrigger>
                <TabsTrigger value="expired" className="flex-1 text-center sm:text-left">Expired</TabsTrigger>
              </TabsList>

              <TabsContent value="active" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                {donations.filter(d => d.status === "active").map(d => (
                  <Card key={d.id} className="border border-green-600">
                    <CardHeader className="flex justify-between items-center">
                      <CardTitle className="text-sm sm:text-base">{d.title}</CardTitle>
                      <span className="text-sm text-green-600">Active</span>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm sm:text-base">Expiry: {d.expiry_date}</p>
                      <div className="flex gap-2 mt-2 flex-wrap">
                        {d.images?.map((img, idx) => (
                          <img key={idx} src={img.image_path} alt={d.title} className="w-20 sm:w-24 h-20 sm:h-24 object-cover rounded border" />
                        ))}
                      </div>
                      <div className="flex gap-2 mt-2 flex-wrap">
                        <Button size="sm" variant="outline" className="flex-1"><Edit size={16} /> Edit</Button>
                        <Button size="sm" variant="destructive" className="flex-1"><Trash size={16} /> Delete</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="expired" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                {donations.filter(d => d.status === "expired").map(d => (
                  <Card key={d.id} className="border border-gray-300">
                    <CardHeader>
                      <CardTitle className="text-sm sm:text-base">{d.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm sm:text-base">Expired on: {d.expiry_date}</p>
                      <div className="flex gap-2 mt-2 flex-wrap">
                        {d.images?.map((img, idx) => (
                          <img key={idx} src={img.image_path} alt={d.title} className="w-20 sm:w-24 h-20 sm:h-24 object-cover rounded border" />
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {donations.filter(d => d.status === "expired").length === 0 && <p>No expired donations 🎉</p>}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Volunteer Match Status */}
        <Card>
          <CardHeader>
            <CardTitle>Volunteer Match Status</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {matches.length > 0 ? matches.map(m => (
              <p key={m.id} className="text-sm sm:text-base">✅ {m.volunteer_name} assigned to "{m.donation_title}"</p>
            )) : <p>No volunteers assigned yet.</p>}
          </CardContent>
        </Card>

        {/* Progress Tracker */}
        <Card>
          <CardHeader>
            <CardTitle>Progress Tracker</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-2 font-semibold text-sm sm:text-base">Donation Streak: {streakDays} {streakDays === 1 ? "day" : "days"}</p>
            <div className="flex gap-2 flex-wrap">
              {badges.map(b => (
                <div key={b.id} className={`p-2 rounded-md border text-xs sm:text-sm ${b.unlocked ? "bg-yellow-100 border-yellow-400" : "bg-gray-100 border-gray-300"}`}>
                  <Crown className="inline-block mr-1" size={16} /> {b.title}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Scoreboard */}
        <Card>
          <CardHeader>
            <CardTitle>Scoreboard</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm sm:text-base font-semibold mb-2">Points: {points}</p>
            <p className="text-sm sm:text-base font-semibold mb-2">Leaderboard Rank: #{rank}</p>
            <div className="flex gap-2 flex-wrap">
              {badges.filter(b => b.unlocked).map(b => (
                <div key={b.id} className="p-2 rounded-md bg-green-100 border border-green-300 flex items-center gap-1 text-xs sm:text-sm">
                  <Trophy size={16} /> {b.title}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

      </div>
    </AuthenticatedLayout>
  );
}
