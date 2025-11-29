import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Button } from "@/components/ui/button";
import toast, { Toaster } from "react-hot-toast";

interface DonationImage {
  id: number;
  image_path: string;
}

export default function PostDonationEdit() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    quantity: 1,
    pickup_address: "",
    expiry_date: "",
    status: "pending",
    newImages: [] as File[],
    existingImages: [] as DonationImage[],
  });

  // Fetch donation data
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
        setFormData((prev) => ({
          ...prev,
          title: donation.title || "",
          description: donation.description || "",
          quantity: donation.quantity || 1,
          pickup_address: donation.pickup_address || "",
          expiry_date: donation.expiry_date || "",
          status: donation.status || "pending",
          existingImages: donation.images || [],
        }));
      } catch (err) {
        console.error("Error loading donation:", err);
        toast.error("Failed to load donation");
      } finally {
        setLoading(false);
      }
    };

    fetchDonation();
  }, [id, navigate]);

  // Handle input change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setFormData((prev) => ({ ...prev, newImages: Array.from(files) }));
    }
  };

  const removeExistingImage = (imageId: number) => {
    setFormData((prev) => ({
      ...prev,
      existingImages: prev.existingImages.filter((img) => img.id !== imageId),
    }));
  };

  // Handle form submission
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
      data.append("quantity", String(formData.quantity));
      data.append("pickup_address", formData.pickup_address);
      data.append("expiry_date", formData.expiry_date);
      data.append("status", formData.status);

      // Append new images
      formData.newImages.forEach((file) => data.append("images[]", file));

      // Send IDs of existing images to keep
      formData.existingImages.forEach((img) =>
        data.append("existing_images[]", String(img.id))
      );

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
      navigate("/donors/post-donation/post-donation-list");
    } catch (err) {
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
              required
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
            <label className="block mb-1 font-medium">Quantity</label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              className="w-full border p-2 rounded-md"
              min={1}
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Pickup Address</label>
            <input
              name="pickup_address"
              value={formData.pickup_address}
              onChange={handleChange}
              className="w-full border p-2 rounded-md"
              placeholder="Enter pickup address"
              required
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
            <label className="block mb-1 font-medium">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full border p-2 rounded-md"
            >
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium">Existing Images</label>
            <div className="flex flex-wrap gap-2">
              {formData.existingImages.map((img) => (
                <div key={img.id} className="relative">
                  <img
                    src={`http://127.0.0.1:8001/storage/${img.image_path}`}
                    alt="donation"
                    className="w-20 h-20 object-cover rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => removeExistingImage(img.id)}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block mb-1 font-medium">Add New Images</label>
            <input type="file" multiple onChange={handleFileChange} />
          </div>

          <div className="flex gap-2 mt-4">
            <Button type="submit">Update Donation</Button>
            <Button
              variant="outline"
              type="button"
              onClick={() => navigate("/donors/post-donation/post-donation-list")}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </AuthenticatedLayout>
  );
}
