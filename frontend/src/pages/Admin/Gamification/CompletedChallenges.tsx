import { useEffect, useState, useMemo } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import api from "@/lib/api";
import { CheckCircle, Award, Users, Search } from "lucide-react";

interface CompletedChallenge {
  id: number;
  donor_name: string;
  challenge_title: string;
  points_reward: number;
  completed_at: string;
}

export default function CompletedChallenges() {
  const [items, setItems] = useState<CompletedChallenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterDonor, setFilterDonor] = useState("");

  useEffect(() => {
    api
      .get("/admin/challenge-progress")
      .then((res) => setItems(res.data.completed_challenges))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  const donors = [...new Set(items.map((i) => i.donor_name))];

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch =
        item.challenge_title.toLowerCase().includes(search.toLowerCase()) ||
        item.donor_name.toLowerCase().includes(search.toLowerCase());

      const matchesDonor = filterDonor ? item.donor_name === filterDonor : true;

      return matchesSearch && matchesDonor;
    });
  }, [items, search, filterDonor]);

  return (
    <AuthenticatedLayout>
      <div className="p-10 bg-gradient-to-br from-indigo-50 to-purple-100 min-h-screen">

        {/* HEADER */}
        <div className="mb-12">
          <h1 className="text-4xl font-extrabold flex items-center gap-3 mb-4 text-indigo-700 drop-shadow-sm">
            <CheckCircle className="w-10 h-10" />
            Completed Challenges
          </h1>
          <p className="text-gray-600 text-lg">
            Track donor achievements and completed challenge milestones.
          </p>
        </div>

        {/* TOP SUMMARY CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          
          <div className="bg-white/70 p-6 rounded-2xl shadow-lg border border-white/40 backdrop-blur-md hover:shadow-xl transition">
            <Award className="text-indigo-600 w-9 h-9 mb-3" />
            <h3 className="text-3xl font-bold text-gray-800">{items.length}</h3>
            <p className="text-gray-600">Completed Challenges</p>
          </div>

          <div className="bg-white/70 p-6 rounded-2xl shadow-lg border border-white/40 backdrop-blur-md hover:shadow-xl transition">
            <Users className="text-purple-600 w-9 h-9 mb-3" />
            <h3 className="text-3xl font-bold text-gray-800">{donors.length}</h3>
            <p className="text-gray-600">Unique Donors</p>
          </div>
        </div>

        {/* SEARCH + FILTER BAR */}
        <div className="bg-white/60 p-5 rounded-2xl shadow-md backdrop-blur-xl border border-white/40 mb-10">
          <div className="flex flex-col md:flex-row items-center gap-4">

            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search donor or challenge..."
                className="w-full pl-10 p-3 rounded-xl border border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-400 outline-none"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Donor Filter */}
            <select
              className="p-3 rounded-xl border border-gray-300 shadow-sm w-full md:w-64 focus:ring-2 focus:ring-purple-400 outline-none"
              value={filterDonor}
              onChange={(e) => setFilterDonor(e.target.value)}
            >
              <option value="">Filter by donor</option>
              {donors.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* LOADING SKELETON */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="p-6 bg-white/60 rounded-2xl shadow animate-pulse"
              >
                <div className="h-5 bg-gray-300 rounded w-1/2 mb-4"></div>
                <div className="h-4 bg-gray-300 rounded w-1/3 mb-3"></div>
                <div className="h-4 bg-gray-300 rounded w-1/4"></div>
              </div>
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <p className="text-gray-500 text-xl text-center mt-20">
            No completed challenges found.
          </p>
        ) : (
          // MAIN CARDS
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((c) => (
              <div
                key={c.id}
                className="group p-6 bg-white/75 shadow-xl rounded-2xl border border-white/40 backdrop-blur-lg transition-all hover:scale-105 hover:shadow-2xl"
              >
                <h2 className="text-xl font-bold text-gray-800 group-hover:text-indigo-600 transition">
                  {c.challenge_title}
                </h2>

                <p className="text-gray-600 mt-2">
                  Donor:{" "}
                  <span className="font-semibold text-gray-800">
                    {c.donor_name}
                  </span>
                </p>

                <p className="text-indigo-700 font-semibold mt-3">
                  Reward: {c.points_reward} pts
                </p>

                <p className="text-gray-500 text-sm mt-4">
                  Completed on: {new Date(c.completed_at).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </AuthenticatedLayout>
  );
}
