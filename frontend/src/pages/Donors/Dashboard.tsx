// src/pages/Donors/Dashboard.tsx
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "react-confetti";
import { toast } from "react-hot-toast";
import { 
  Plus, Trophy, Flame, Crown, Award, Package
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { useNavigate } from "react-router-dom";
import CountUp from "react-countup";
import api from "@/lib/api";

interface User { id: number; name: string | null; email: string; }
interface Donation { id: number; title: string; expiry_date: string; status: "active" | "expired"; images?: { image_path: string }[]; }
interface Match { id: number; volunteer_name: string; donation_title: string; }
interface Badge { id: number; title: string; unlocked: boolean; threshold: number; }
interface TrackerData { streakDays: number; badges: Badge[]; points: number; rank: number; totalDonations: number; }

export default function Dashboard() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [tracker, setTracker] = useState<TrackerData>({
    streakDays: 0, badges: [], points: 0, rank: 0, totalDonations: 0,
  });
  const [showConfetti, setShowConfetti] = useState(false);

  const foodItems = ["🍎","🍞","🍛","🍲","🥗","🍕","🍌","🍚","🍪","🍇"];
  const [visibleFoods, setVisibleFoods] = useState<{ id:number; emoji:string; left:string; size:number}[]>([]);

  // Falling food animation
  useEffect(() => {
    const interval = setInterval(() => {
      const newFood = {
        id: Date.now(),
        emoji: foodItems[Math.floor(Math.random() * foodItems.length)],
        left: `${Math.random()*100}%`,
        size: Math.random()*1.5+1
      };
      setVisibleFoods(prev => [...prev.slice(-12), newFood]);
      setTimeout(() => setVisibleFoods(prev => prev.filter(f => f.id !== newFood.id)), 8000);
    }, 900);
    return () => clearInterval(interval);
  }, []);

  // Fetch all dashboard data
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const userRes = await api.get("/users/me");
        setCurrentUser(userRes.data);

        const [donationsRes, dashboardRes] = await Promise.all([
          api.get(`/donors/donations?user_id=${userRes.data.id}`),
          api.get("/donors/dashboard")
        ]);

        setDonations(donationsRes.data || []);
        setTracker({
          streakDays: dashboardRes.data.streakDays || 0,
          badges: dashboardRes.data.badges || [],
          points: dashboardRes.data.points || 0,
          rank: dashboardRes.data.rank || 0,
          totalDonations: donationsRes.data.length || 0,
        });

        // Trigger confetti if a badge was unlocked
        if(dashboardRes.data.badges.some((b:Badge) => b.unlocked)) setShowConfetti(true);
      } catch (err) {
        toast.error("Failed to load dashboard");
      }
    };
    fetchAll();
  }, []);

  const nextBadge = tracker.badges.find(b => !b.unlocked);
  const progress = nextBadge ? (tracker.points/nextBadge.threshold)*100 : 100;

  if(!currentUser) return <div className="flex items-center justify-center h-screen text-2xl">Loading...</div>;

  return (
    <AuthenticatedLayout>
      <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-rose-50 via-orange-50 to-amber-100">
        {showConfetti && <Confetti numberOfPieces={200} recycle={false} />}

        <div className="fixed inset-0 pointer-events-none z-10">
          <AnimatePresence>
            {visibleFoods.map(food => (
              <motion.div
                key={food.id}
                initial={{y:-100, opacity:0}}
                animate={{y:"110vh", opacity:[0,1,0.8,0]}}
                exit={{opacity:0}}
                transition={{duration:10, ease:"linear"}}
                className="absolute text-4xl"
                style={{left: food.left}}
              >{food.emoji}</motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="relative z-20 max-w-7xl mx-auto p-6 space-y-12">
          {/* Hero */}
          <motion.div initial={{opacity:0,y:-30}} animate={{opacity:1,y:0}} className="text-center py-16">
            <motion.h1
              initial={{scale:0.8}}
              animate={{scale:1}}
              transition={{type:"spring", stiffness:200}}
              className="text-6xl font-extrabold bg-gradient-to-r from-rose-600 via-orange-500 to-amber-600 bg-clip-text text-transparent mb-4"
            >Welcome back, {currentUser.name?.split(" ")[0] || "Hero"}!</motion.h1>
            <p className="text-2xl text-gray-700 flex items-center justify-center gap-4">
              Every donation feeds a family
              {tracker.streakDays > 2 && <Flame className="w-10 h-10 text-orange-500 animate-bounce" />}
            </p>
          </motion.div>

          {/* Quick Action */}
          <motion.div initial={{scale:0}} animate={{scale:1}} transition={{delay:0.3,type:"spring"}} className="text-center">
            <Button
              onClick={()=>navigate("/donors/post-donation/post-donation-add")}
              size="lg"
              className="bg-gradient-to-r from-rose-600 to-orange-600 hover:from-rose-700 hover:to-orange-700 text-white px-12 py-8 text-2xl font-bold rounded-3xl shadow-2xl flex items-center gap-4 mx-auto hover:scale-110 transition"
            >
              <Plus className="w-10 h-10" />
              Post New Donation
            </Button>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[{icon:<Trophy className="w-12 h-12"/>,label:"Points",value:tracker.points,color:"from-rose-500 to-pink-500"},
              {icon:<Crown className="w-12 h-12"/>,label:"Rank",value:tracker.rank,suffix:"#",color:"from-amber-500 to-yellow-600"},
              {icon:<Flame className="w-12 h-12"/>,label:"Streak",value:tracker.streakDays,suffix:" days",color:"from-orange-500 to-red-500"},
              {icon:<Award className="w-12 h-12"/>,label:"Badges",value:tracker.badges.filter(b=>b.unlocked).length,color:"from-purple-500 to-indigo-500"}].map((stat,i)=>(
              <motion.div key={i} initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} transition={{delay:i*0.1}} className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-white/10 rounded-3xl blur-xl group-hover:blur-2xl transition"></div>
                <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl p-8 text-center shadow-2xl border border-white/30">
                  <div className={`inline-flex p-6 rounded-full bg-gradient-to-br ${stat.color} text-white shadow-xl mb-4 animate-pulse`}>
                    {stat.icon}
                  </div>
                  <div className="text-5xl font-bold text-gray-800">
                    <CountUp end={stat.value} duration={2} />{stat.suffix}
                  </div>
                  <p className="text-lg text-gray-600 mt-2">{stat.label}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Next Badge Progress with shimmer */}
          {nextBadge && (
            <motion.div initial={{opacity:0,scale:0.9}} animate={{opacity:1,scale:1}} className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-10 border border-white/30 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-yellow-200 via-yellow-50 to-yellow-200 opacity-20 animate-pulse pointer-events-none"></div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-800">Next Badge: {nextBadge.title}</h3>
                <Trophy className="w-12 h-12 text-yellow-500 animate-bounce" />
              </div>
              <Progress value={progress} className="h-8 rounded-full mb-4" />
              <div className="flex justify-between text-lg">
                <span className="text-gray-600">{tracker.points} points</span>
                <span className="font-bold text-rose-600">{nextBadge.threshold} needed</span>
              </div>
            </motion.div>
          )}

          {/* Donations */}
          <Card className="bg-white/80 backdrop-blur-xl shadow-2xl border-none rounded-3xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-rose-600 to-orange-600 text-white">
              <CardTitle className="text-3xl flex items-center gap-3">
                <Package className="w-10 h-10"/>
                My Donations
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <Tabs defaultValue="active" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-8">
                  <TabsTrigger value="active" className="text-lg py-4">Active</TabsTrigger>
                  <TabsTrigger value="expired" className="text-lg py-4">Completed</TabsTrigger>
                </TabsList>

                <TabsContent value="active" className="space-y-6">
                  {donations.filter(d=>d.status==="active").map(d=>(
                    <motion.div key={d.id} whileHover={{scale:1.05, rotateZ:1}} className="bg-gradient-to-r from-rose-50 to-orange-50 rounded-2xl p-6 shadow-lg border border-rose-200 transition-all hover:shadow-2xl">
                      <h3 className="text-2xl font-bold text-rose-700 mb-2">{d.title}</h3>
                      <p className="text-gray-600 mb-4">Expires: {new Date(d.expiry_date).toLocaleDateString()}</p>
                      <div className="grid grid-cols-4 gap-3">
                        {d.images?.slice(0,4).map((img,i)=>(
                          <img key={i} src={img.image_path} alt="" className="w-full h-24 object-cover rounded-xl shadow transition hover:scale-105 hover:shadow-2xl"/>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </TabsContent>

                <TabsContent value="expired">
                  <p className="text-center text-2xl text-gray-600 py-16">All your donations have been successfully delivered!</p>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Achievements / Badges */}
<Card className="bg-gradient-to-r from-purple-50 to-indigo-50 border-4 border-purple-300 rounded-3xl shadow-2xl">
  <CardHeader>
    <CardTitle className="text-3xl text-purple-800 flex items-center gap-3">
      <Trophy className="w-10 h-10" />
      Your Badges
    </CardTitle>
  </CardHeader>
  <CardContent>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {tracker.badges.map((b) => (
        <motion.div
          key={b.id}
          whileHover={{ scale: 1.1 }}
          className={`text-center p-6 rounded-2xl border ${
            b.unlocked
              ? "bg-yellow-100 border-yellow-300"
              : "bg-gray-100 border-gray-300 opacity-50"
          } transition-shadow shadow-lg`}
        >
          <Award
            className={`w-16 h-16 mx-auto mb-3 ${
              b.unlocked ? "text-yellow-600 animate-pulse" : "text-gray-400"
            }`}
          />
          <p className="font-bold text-lg">{b.title}</p>
          <p className="text-sm text-gray-600">{b.threshold} pts</p>
          {b.unlocked ? (
            <p className="text-green-600 font-semibold mt-2">Unlocked</p>
          ) : (
            <p className="text-gray-500 font-semibold mt-2">To Earn</p>
          )}
        </motion.div>
      ))}
    </div>
  </CardContent>
</Card>

        </div>
      </div>
    </AuthenticatedLayout>
  );
}
