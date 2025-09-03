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

  // Get token & user from localStorage (set these after login)
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const authUser: AuthUser | null = useMemo(() => {
    try {
      const raw = typeof window !== "undefined" ? localStorage.getItem("authUser") : null;
      return raw ? (JSON.parse(raw) as AuthUser) : null;
    } catch {
      return null;
    }
  }, []);

  const api = useMemo(() => {
    const instance = axios.create({
      baseURL: "http://127.0.0.1:8001/api",
    });
    if (token) {
      instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
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

  const handleEdit = (id: number) => {
    navigate(`/donors/post-donation/post-donation-edit/${id}`);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this donation?")) return;
    try {
      await api.delete(`/donations/${id}`);
      setDonations((prev) => prev.filter((d) => d.id !== id));
    } catch (error) {
      console.error("Failed to delete donation:", error);
    }
  };

  return (
    <AuthenticatedLayout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">My Donations</h2>
          <Button onClick={() => navigate("/donors/post-donation/post-donation-add")}>
            + Add Donation
          </Button>
        </div>

        {!authUser?.id ? (
          <div className="text-sm text-muted-foreground">
            No logged-in user found. Make sure you save{" "}
            <code>authUser</code> (with an <code>id</code>) in <code>localStorage</code> after login.
          </div>
        ) : loading ? (
          <div className="text-sm text-muted-foreground">Loading…</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Expiry Date</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {donations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">
                    No donations found.
                  </TableCell>
                </TableRow>
              ) : (
                donations.map((donation) => (
                  <TableRow key={donation.id}>
                    <TableCell className="font-medium">{donation.title}</TableCell>
                    <TableCell>{donation.description || "-"}</TableCell>
                    <TableCell>{donation.expiry_date || "N/A"}</TableCell>
                    <TableCell>{donation.quantity || "-"}</TableCell>
                    <TableCell>{donation.status}</TableCell>
                    
                    <TableCell className="text-right space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(donation.id)}>
                        Edit
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(donation.id)}>
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </div>
    </AuthenticatedLayout>
  );
}
