import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Button } from "@/components/ui/button";
import toast, { Toaster } from "react-hot-toast";

export default function PostDonationEdit() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    expiry_date: "",
    images: [] as File[],
  });

  // ✅ Load donation data
  useEffect(() => {
    const fetchDonation = async () => {
      try {
        const token = localStorage.getItem("auth_token");
        if (!token) {
          toast.error("No logged-in user found");
          navigate("/login");
          return;
        }

        const res = await axios.get(`http://127.0.0.1:8001/api/donations/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const donation = res.data;
        setFormData({
          title: donation.title || "",
          description: donation.description || "",
          expiry_date: donation.expiry_date || "",
          images: [], // don’t preload files, only new ones
        });
      } catch (err: any) {
        console.error("Error loading donation:", err);
        toast.error("Failed to load donation");
      } finally {
        setLoading(false);
      }
    };

    fetchDonation();
  }, [id, navigate]);

  // ✅ Handle input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const files = e.target.files;
  if (files) {
    setFormData((prev) => ({ ...prev, images: Array.from(files) }));
  }
};


  // ✅ Handle update
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        toast.error("No logged-in user found");
        navigate("/login");
        return;
      }

      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("expiry_date", formData.expiry_date);
      formData.images.forEach((file) => data.append("images[]", file));

      await axios.post(
        `http://127.0.0.1:8001/api/donations/${id}?_method=PUT`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Donation updated successfully!");
      navigate("/donors/post-donation/list");
    } catch (err: any) {
      console.error("Error updating donation:", err);
      toast.error("Failed to update donation");
    }
  };

  if (loading) return <p className="p-6">Loading donation...</p>;

  return (
    <AuthenticatedLayout>
      <Toaster position="top-center" />
      <div className="p-6 max-w-2xl mx-auto">
        <h2 className="text-xl font-bold mb-6">Edit Donation</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Title</label>
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full border p-2 rounded-md"
              placeholder="Enter donation title"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              placeholder="Enter donation description"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Expiry Date</label>
            <input
              type="date"
              name="expiry_date"
              value={formData.expiry_date}
              onChange={handleChange}
              className="w-full border p-2 rounded-md"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Images</label>
            <input type="file" multiple onChange={handleFileChange} />
          </div>

          <div className="flex gap-2 mt-4">
            <Button type="submit">Update Donation</Button>
            <Button
              variant="outline"
              type="button"
              onClick={() => navigate("/donors/post-donation/list")}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </AuthenticatedLayout>
  );
}
