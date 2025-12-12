import { useEffect, useState } from "react";
import api from "@/lib/api";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Sparkles, Award, Medal } from "lucide-react";
import { toast } from "react-hot-toast";

interface StreakInfo {
    id?: number;
    user_id?: number;
    current_streak?: number;
    last_action_date?: string;
    longest_streak?: number;
    monthly_streak?: number;
    monthly_streak_month?: string;
    last_awarded_at?: string;
}

export default function DonorStreak() {
    const [streak, setStreak] = useState<StreakInfo | null>(null);
    const [points, setPoints] = useState<number>(0);
    const [loading, setLoading] = useState(true);

    const load = async () => {
        setLoading(true);
        try {
            const { data } = await api.get("/donors/streak");
            setStreak(data.streak);
            setPoints(data.points || 0);
        } catch {
            toast.error("Failed to load streak info");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, []);

    const claimSimulate = async () => {
        try {
            await api.post("/donors/streaks/process", { donation_at: new Date().toISOString() });
            toast.success("Streak processed");
            load();
        } catch {
            toast.error("Failed");
        }
    };

    const sevenDayProgress = Math.min(100, ((streak?.current_streak || 0) / 7) * 100);

    return (
        <AuthenticatedLayout>
            <div className="p-8 max-w-4xl mx-auto">
                <div className="bg-white rounded-3xl shadow-2xl p-8 text-center border border-gray-100">
                    {/* Header */}
                    <div className="inline-flex items-center gap-3 mb-4 justify-center">
                        <Sparkles className="w-10 h-10 text-rose-500 animate-pulse" />
                        <h1 className="text-3xl font-extrabold text-gray-800">Your Donation Streak</h1>
                    </div>

                    {loading ? (
                        <p className="text-gray-400">Loading streak info...</p>
                    ) : (
                        <>
                            {/* Current Streak */}
                            <div className="mt-6">
                                <p className="text-lg text-gray-500">Current Streak</p>
                                <div className="text-5xl font-extrabold text-rose-500 mt-2">
                                    {streak?.current_streak || 0} <span className="text-lg font-medium">days</span>
                                </div>

                                {/* Progress Bar */}
                                <div className="mt-4 w-full bg-gray-200 rounded-full h-4 overflow-hidden shadow-inner">
                                    <div
                                        className="h-4 bg-gradient-to-r from-rose-500 to-orange-400 transition-all duration-500"
                                        style={{ width: `${sevenDayProgress}%` }}
                                    />
                                </div>
                                <p className="text-sm text-gray-400 mt-1">
                                    Progress to 7-day reward: {Math.min(7, streak?.current_streak || 0)}/7
                                </p>
                            </div>

                            {/* Stats Cards */}
                            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="p-4 bg-gray-50 rounded-xl shadow hover:shadow-lg transition">
                                    <p className="text-xs text-gray-400">Longest Streak</p>
                                    <div className="text-xl font-semibold">{streak?.longest_streak || 0} days</div>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-xl shadow hover:shadow-lg transition">
                                    <p className="text-xs text-gray-400">Monthly Streak</p>
                                    <div className="text-xl font-semibold">{streak?.monthly_streak || 0} days</div>
                                </div>
                            </div>

                            {/* Rewards */}
                            <div className="mt-6">
                                <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                                    <Award className="w-5 h-5 text-indigo-600" /> Rewards
                                </h3>

                                <div className="grid sm:grid-cols-2 gap-4">
                                    {/* 7-Day Streak Reward */}
                                    <div className="flex items-center p-4 bg-indigo-50 rounded-2xl shadow hover:shadow-lg transition">
                                        <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mr-4">
                                            <span className="text-indigo-600 font-bold text-lg">7</span>
                                        </div>
                                        <div>
                                            <p className="text-gray-700 font-semibold">7-Day Giving Streak</p>
                                            <p className="text-gray-500 text-sm mt-1">
                                                Reward: <span className="font-semibold">50 points</span> + <span className="text-indigo-600 font-semibold">badge</span>
                                            </p>
                                            <div className="mt-2 w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                                                <div
                                                    className="h-2 bg-indigo-500 transition-all"
                                                    style={{ width: `${Math.min(100, ((streak?.current_streak || 0) / 7) * 100)}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Monthly Streak Reward */}
                                    <div className="flex items-center p-4 bg-purple-50 rounded-2xl shadow hover:shadow-lg transition">
                                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                                            <span className="text-purple-600 font-bold text-lg">28+</span>
                                        </div>
                                        <div>
                                            <p className="text-gray-700 font-semibold">Monthly Giving Streak</p>
                                            <p className="text-gray-500 text-sm mt-1">
                                                Reward: <span className="font-semibold">200 points</span> + <span className="text-purple-600 font-semibold">badge</span>
                                            </p>
                                            <div className="mt-2 w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                                                <div
                                                    className="h-2 bg-purple-500 transition-all"
                                                    style={{ width: `${Math.min(100, ((streak?.monthly_streak || 0) / 28) * 100)}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Points */}
                            <div className="mt-6 bg-yellow-50 p-4 rounded-xl shadow-inner flex items-center justify-center gap-2">
                                <Medal className="w-6 h-6 text-yellow-500" />
                                <span className="text-lg font-semibold text-gray-700">Your Points: {points}</span>
                            </div>

                            {/* Process Button */}
                            <div className="mt-6">
                                <button
                                    onClick={claimSimulate}
                                    className="px-6 py-3 bg-rose-500 text-white rounded-2xl font-semibold shadow-lg hover:bg-rose-600 transition"
                                >
                                    Process Streak
                                </button>
                                <p className="text-xs text-gray-400 mt-2">
                                    Streaks update automatically when you donate. Use this button to re-check manually.
                                </p>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
