// frontend/src/pages/Admin/Gamification/DonorsEarned.tsx
import { useEffect, useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import api from "@/lib/api";
import { Trophy } from "lucide-react";

interface EarnedBadge {
  id: number;
  donor_name: string;
  badge_title: string;
  points: number;
  earned_at: string;
}

export default function DonorsEarned() {
  const [earnedBadges, setEarnedBadges] = useState<EarnedBadge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/admin/gamification/earned")
      .then((res) => setEarnedBadges(res.data.earned_badges || []))
      .catch(() => setEarnedBadges([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AuthenticatedLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Trophy className="w-8 h-8 text-yellow-500" />
          <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-red-500">
            Donors Earned Badges
          </h1>
        </div>

        {/* Loading state */}
        {loading ? (
          <p className="text-gray-500 text-center mt-10">Loading...</p>
        ) : earnedBadges.length === 0 ? (
          <p className="text-gray-500 text-center mt-10">No badges earned yet.</p>
        ) : (
          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {earnedBadges.map((b) => (
              <div
                key={b.id}
                className="p-6 bg-white rounded-2xl shadow-md hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 border border-gray-100"
              >
                {/* Badge Title */}
                <h2 className="font-bold text-xl mb-2 text-gray-800">{b.badge_title}</h2>
                
                {/* Donor Info */}
                <p className="text-gray-600 mb-1">
                  <span className="font-semibold">Donor:</span> {b.donor_name}
                </p>

                {/* Points */}
                <p className="text-gray-600 mb-1">
                  <span className="font-semibold">Points:</span> {b.points}
                </p>

                {/* Earned Date */}
                <p className="text-gray-400 text-sm">
                  Earned on {new Date(b.earned_at).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </AuthenticatedLayout>
  );
}
