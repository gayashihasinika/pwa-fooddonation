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
    if (e.target.files) setForm({ ...form, images: Array.from(e.target.files) });
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
    formData.append("user_id", form.user_id);
    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("quantity", String(form.quantity));
    formData.append("pickup_address", form.pickup_address);
    formData.append("expiry_date", form.expiry_date);
    formData.append("status", form.status);
    form.images.forEach((file, idx) => formData.append(`images[${idx}]`, file));

    try {
      await api.post("/donations", formData, { headers: { "Content-Type": "multipart/form-data" } });
      toast({ title: "Donation Added", description: "Donation was successfully added!" });
      navigate("/donors/post-donation/post-donation-list");
    } catch (err: any) {
      console.error("Add donation error:", err);
      const backendErrors = (err?.response?.data?.errors ?? {}) as Record<string, string[]>;
      setErrors(Object.fromEntries(Object.entries(backendErrors).map(([k, v]) => [k, v[0]])));
      toast({
        title: "Error",
        description: Object.values(backendErrors)[0]?.[0] ?? "Please fix the errors in the form and try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <AuthenticatedLayout>
      <Card className="rounded-xl border border-border bg-card shadow-sm max-w-2xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-6">Add Donation</h2>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {!authUser?.id && <p className="text-sm text-red-600">No logged-in user found. Please log in first.</p>}

          <div>
            <Label>Title</Label>
            <Input name="title" value={form.title} onChange={handleChange} className={errors.title ? "border-red-500" : ""} />
            {errors.title && <p className="text-red-600 text-sm">{errors.title}</p>}
          </div>

          <div>
            <Label>Description</Label>
            <textarea name="description" value={form.description} onChange={handleChange} className="w-full border rounded-md p-2" />
          </div>

          <div>
            <Label>Quantity</Label>
            <Input type="number" name="quantity" value={form.quantity} onChange={handleChange} className={errors.quantity ? "border-red-500" : ""} />
            {errors.quantity && <p className="text-red-600 text-sm">{errors.quantity}</p>}
          </div>

          <div>
            <Label>Pickup Address</Label>
            <Input name="pickup_address" value={form.pickup_address} onChange={handleChange} className={errors.pickup_address ? "border-red-500" : ""} />
            {errors.pickup_address && <p className="text-red-600 text-sm">{errors.pickup_address}</p>}
          </div>

          <div>
            <Label>Expiry Date</Label>
            <Input type="date" name="expiry_date" value={form.expiry_date} onChange={handleChange} />
          </div>

          <div>
            <Label>Images</Label>
            <Input type="file" accept="image/*" multiple onChange={handleFileChange} />
          </div>

          <Button type="submit" className="mt-4 bg-[var(--brand-600)] text-white">Add Donation</Button>
        </form>
      </Card>
    </AuthenticatedLayout>
  );
}
