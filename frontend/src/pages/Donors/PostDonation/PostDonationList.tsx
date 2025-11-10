import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Donation {
  id: number;
  user_id: number;
  title: string;
  description?: string;
  expiry_date?: string;
  status: string;
  quantity?: number;
  images?: { id: number; image_path: string }[];
}

type AuthUser = { id: number; name?: string; email?: string };

export default function PostDonationList() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const authUser: AuthUser | null = useMemo(() => {
    try {
      const raw =
        typeof window !== "undefined"
          ? localStorage.getItem("authUser")
          : null;
      return raw ? (JSON.parse(raw) as AuthUser) : null;
    } catch {
      return null;
    }
  }, []);

  const api = useMemo(() => {
    const instance = axios.create({
      baseURL: "http://127.0.0.1:8001/api",
    });
    if (token) instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    return instance;
  }, [token]);

  useEffect(() => {
    const fetchDonations = async () => {
      if (!authUser?.id) {
        setLoading(false);
        return;
      }
      try {
        const res = await api.get("/donations", { params: { user_id: authUser.id } });
        setDonations(Array.isArray(res.data) ? res.data : res.data?.data || []);
      } catch (err) {
        console.error("Error fetching donations:", err);
        setDonations([]);
      } finally {
        setLoading(false);
      }
    };
    fetchDonations();
  }, [api, authUser?.id]);

  const handleEdit = (id: number) => navigate(`/donors/post-donation/post-donation-edit/${id}`);
  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this donation?")) return;
    try {
      await api.delete(`/donations/${id}`);
      setDonations((prev) => prev.filter((d) => d.id !== id));
    } catch (error) {
      console.error("Failed to delete donation:", error);
    }
  };

  const getStatusBadge = (status: string) => {
    const base = "px-3 py-1 rounded-full text-xs font-semibold";
    switch (status.toLowerCase()) {
      case "active":
        return `${base} bg-green-100 text-green-700 border border-green-300`;
      case "expired":
        return `${base} bg-red-100 text-red-700 border border-red-300`;
      default:
        return `${base} bg-yellow-100 text-yellow-700 border border-yellow-300`;
    }
  };

  return (
    <AuthenticatedLayout>
      <div className="p-6 md:p-8 lg:p-10 bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
            My Donations
          </h2>
          <Button
            className="bg-rose-600 hover:bg-rose-700 text-white shadow-md transition-all"
            onClick={() => navigate("/donors/post-donation/post-donation-add")}
          >
            + Add Donation
          </Button>
        </div>

        {/* Content */}
        {!authUser?.id ? (
          <div className="text-sm text-gray-500 bg-white p-4 rounded shadow text-center">
            No logged-in user found. Please save{" "}
            <code className="bg-gray-100 px-1 rounded">authUser</code> in{" "}
            <code className="bg-gray-100 px-1 rounded">localStorage</code> after login.
          </div>
        ) : loading ? (
          <div className="text-center py-10 text-gray-500">Loading…</div>
        ) : donations.length === 0 ? (
          <div className="text-center py-10 text-gray-500 text-lg bg-white rounded shadow">
            No donations found.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl shadow bg-white">
            <Table className="min-w-full divide-y divide-gray-200">
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead className="text-gray-700">Image</TableHead>
                  <TableHead className="text-gray-700">Title</TableHead>
                  <TableHead className="text-gray-700 hidden sm:table-cell">
                    Description
                  </TableHead>
                  <TableHead className="text-gray-700 hidden md:table-cell">
                    Quantity
                  </TableHead>
                  <TableHead className="text-gray-700">Expiry Date</TableHead>
                  <TableHead className="text-gray-700">Status</TableHead>
                  <TableHead className="text-right text-gray-700">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody className="bg-white divide-y divide-gray-100">
                {donations.map((donation) => {
                  const imageUrl =
                    donation.images && donation.images.length > 0
                      ? `http://127.0.0.1:8001/storage/${donation.images[0].image_path}`
                      : "https://via.placeholder.com/80x80.png?text=No+Image";

                  return (
                    <TableRow
                      key={donation.id}
                      className="hover:bg-gray-50 transition duration-200"
                    >
                      <TableCell>
                        <img
                          src={imageUrl}
                          alt={donation.title}
                          className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                        />
                      </TableCell>
                      <TableCell className="font-medium text-gray-800">
                        {donation.title}
                      </TableCell>
                      <TableCell className="text-gray-600 hidden sm:table-cell">
                        {donation.description || "-"}
                      </TableCell>
                      <TableCell className="text-gray-600 hidden md:table-cell">
                        {donation.quantity || "-"}
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {donation.expiry_date || "N/A"}
                      </TableCell>
                      <TableCell>
                        <span className={getStatusBadge(donation.status)}>
                          {donation.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-blue-600 hover:bg-blue-50 border-blue-200"
                          onClick={() => handleEdit(donation.id)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          className="hover:bg-red-600 hover:text-white transition"
                          onClick={() => handleDelete(donation.id)}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </AuthenticatedLayout>
  );
}
