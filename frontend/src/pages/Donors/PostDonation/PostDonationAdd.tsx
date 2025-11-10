// src/pages/Donors/PostDonation/PostDonationAdd.tsx
import React, { useState, useEffect, useMemo } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { UploadCloud, CalendarDays, Package, MapPin } from "lucide-react";

type AuthUser = { id: number; name?: string; email?: string };

export default function DonationAdd() {
  const navigate = useNavigate();

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
    const instance = axios.create({ baseURL: "http://127.0.0.1:8001/api" });
    if (token) instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    return instance;
  }, [token]);

  const [form, setForm] = useState({
    user_id: "",
    title: "",
    description: "",
    quantity: 1,
    pickup_address: "",
    expiry_date: "",
    status: "pending",
    images: [] as File[],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [previewImages, setPreviewImages] = useState<string[]>([]);

  useEffect(() => {
    if (authUser?.id) {
      setForm((prev) => ({ ...prev, user_id: String(authUser.id) }));
    }
  }, [authUser?.id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: name === "quantity" ? Number(value) : value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setForm({ ...form, images: files });
      setPreviewImages(files.map((file) => URL.createObjectURL(file)));
    }
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.user_id) errs.user_id = "User not found. Please log in again.";
    if (!form.title) errs.title = "Title is required.";
    if (!form.pickup_address) errs.pickup_address = "Pickup address is required.";
    if (form.quantity < 1) errs.quantity = "Quantity must be at least 1.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (key === "images") return;
      formData.append(key, String(value));
    });
    form.images.forEach((file, idx) => formData.append(`images[${idx}]`, file));

    try {
      await api.post("/donations", formData, { headers: { "Content-Type": "multipart/form-data" } });
      toast({ title: "✅ Donation Added", description: "Donation successfully added!" });
      navigate("/donors/post-donation/post-donation-list");
    } catch (err: any) {
      console.error("Add donation error:", err);
      const backendErrors = (err?.response?.data?.errors ?? {}) as Record<string, string[]>;
      setErrors(Object.fromEntries(Object.entries(backendErrors).map(([k, v]) => [k, v[0]])));
      toast({
        title: "Error",
        description: Object.values(backendErrors)[0]?.[0] ?? "Please check the form and try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <AuthenticatedLayout>
      <div className="min-h-screen bg-gradient-to-br from-rose-50 to-orange-50 py-10 px-4">
        <motion.div
          className="max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="rounded-3xl shadow-lg border border-rose-100 bg-white/90 backdrop-blur-sm p-8">
            <h2 className="text-3xl font-bold text-center text-rose-700 mb-8">
              🍲 Add a New Donation
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div>
                <Label className="text-gray-700">Donation Title</Label>
                <Input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="e.g., Freshly cooked meals"
                  className={`mt-1 ${errors.title ? "border-red-500" : "border-gray-300"} focus:ring-rose-400`}
                />
                {errors.title && <p className="text-sm text-red-600 mt-1">{errors.title}</p>}
              </div>

              {/* Description */}
              <div>
                <Label className="text-gray-700">Description</Label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Describe your donation..."
                  className="w-full border border-gray-300 rounded-lg p-3 mt-1 focus:ring-rose-400 focus:border-rose-400 resize-none"
                  rows={4}
                />
              </div>

              {/* Quantity + Expiry Date */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label className="flex items-center gap-1 text-gray-700">
                    <Package size={16} /> Quantity
                  </Label>
                  <Input
                    type="number"
                    name="quantity"
                    value={form.quantity}
                    onChange={handleChange}
                    min={1}
                    className={`mt-1 ${errors.quantity ? "border-red-500" : "border-gray-300"} focus:ring-rose-400`}
                  />
                  {errors.quantity && <p className="text-sm text-red-600 mt-1">{errors.quantity}</p>}
                </div>

                <div>
                  <Label className="flex items-center gap-1 text-gray-700">
                    <CalendarDays size={16} /> Expiry Date
                  </Label>
                  <Input
                    type="date"
                    name="expiry_date"
                    value={form.expiry_date}
                    onChange={handleChange}
                    className="mt-1 border-gray-300 focus:ring-rose-400"
                  />
                </div>
              </div>

              {/* Pickup Address */}
              <div>
                <Label className="flex items-center gap-1 text-gray-700">
                  <MapPin size={16} /> Pickup Address
                </Label>
                <Input
                  name="pickup_address"
                  value={form.pickup_address}
                  onChange={handleChange}
                  placeholder="Enter pickup address"
                  className={`mt-1 ${errors.pickup_address ? "border-red-500" : "border-gray-300"} focus:ring-rose-400`}
                />
                {errors.pickup_address && (
                  <p className="text-sm text-red-600 mt-1">{errors.pickup_address}</p>
                )}
              </div>

              {/* Images */}
              <div>
                <Label className="flex items-center gap-2 text-gray-700">
                  <UploadCloud size={18} /> Upload Images
                </Label>
                <Input type="file" accept="image/*" multiple onChange={handleFileChange} />
                {previewImages.length > 0 && (
                  <div className="flex flex-wrap gap-3 mt-3">
                    {previewImages.map((src, idx) => (
                      <img
                        key={idx}
                        src={src}
                        alt="Preview"
                        className="w-20 h-20 object-cover rounded-lg border"
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-rose-500 to-orange-400 text-white font-semibold py-3 rounded-xl shadow-md hover:shadow-lg transition"
                >
                  🚀 Add Donation
                </Button>
              </motion.div>
            </form>
          </Card>
        </motion.div>
      </div>
    </AuthenticatedLayout>
  );
}
