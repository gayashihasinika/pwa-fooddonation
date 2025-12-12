import { useEffect, useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import api from "@/lib/api";
import { Trophy } from "lucide-react";

interface StreakRow {
  user_id: number;
  name: string;
  email?: string;
  current_streak: number;
  last_donation_date?: string;
  longest_streak?: number;
  monthly_streak?: number;
}

export default function AdminStreaks() {
  const [rows, setRows] = useState<StreakRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/admin/streaks").then(res => {
      setRows(res.data.streaks || []);
    }).catch(() => setRows([])).finally(() => setLoading(false));
  }, []);

  return (
    <AuthenticatedLayout>
      <div className="p-8 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Trophy className="w-8 h-8 text-yellow-500" />
              Donor Streaks & Leaderboard
            </h1>
            <p className="text-sm text-gray-500">Monitor donor engagement and streak awards</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-sm text-gray-500 border-b">
                      <th className="py-3">Donor</th>
                      <th className="py-3">Email</th>
                      <th className="py-3">Current Streak</th>
                      <th className="py-3">Monthly Streak</th>
                      <th className="py-3">Longest</th>
                      <th className="py-3">Last Donation</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map(r => (
                      <tr key={r.user_id} className="border-b last:border-0 hover:bg-gray-50">
                        <td className="py-3 font-medium">{r.name}</td>
                        <td className="py-3 text-sm text-gray-600">{r.email}</td>
                        <td className="py-3">{r.current_streak}d</td>
                        <td className="py-3">{r.monthly_streak || 0}d</td>
                        <td className="py-3">{r.longest_streak || 0}d</td>
                        <td className="py-3 text-sm text-gray-500">{r.last_donation_date ? new Date(r.last_donation_date).toLocaleDateString() : '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
