import { useEffect, useState } from "react";
import axios from "axios";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Toaster, toast } from "react-hot-toast";

interface Donor {
  id: number;
  name: string;
  email: string;
  total_quantity: number | null;
}

export default function Leaderboard() {
  const [loading, setLoading] = useState(true);
  const [donors, setDonors] = useState<Donor[]>([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const token = localStorage.getItem("auth_token");
        if (!token) {
          toast.error("No logged-in user found");
          return;
        }

        const res = await axios.get(
          "http://127.0.0.1:8001/api/donor-leaderboard",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setDonors(res.data);
      } catch (err) {
        console.error("Failed to fetch leaderboard:", err);
        toast.error("Failed to fetch leaderboard");
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  if (loading) return <p className="p-6 text-center">Loading leaderboard...</p>;

  if (donors.length === 0)
    return <p className="p-6 text-center">No donors found.</p>;

  return (
    <AuthenticatedLayout>
      <Toaster position="top-center" />
      <div className="p-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-center text-rose-600">
          Donor Leaderboard
        </h2>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-xl overflow-hidden">
            <thead className="bg-rose-500 text-white">
              <tr>
                <th className="py-3 px-6 text-left">Rank</th>
                <th className="py-3 px-6 text-left">Name</th>
                <th className="py-3 px-6 text-left">Email</th>
                <th className="py-3 px-6 text-left">Total Quantity Donated</th>
              </tr>
            </thead>
            <tbody>
              {donors.map((donor, index) => (
                <tr
                  key={donor.id}
                  className={`border-b hover:bg-gray-50 transition`}
                >
                  <td className="py-3 px-6">{index + 1}</td>
                  <td className="py-3 px-6">{donor.name}</td>
                  <td className="py-3 px-6">{donor.email}</td>
                  <td className="py-3 px-6">
                    {donor.total_quantity ?? 0}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
