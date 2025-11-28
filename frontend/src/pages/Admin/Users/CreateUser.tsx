// src/pages/Admin/Users/CreateUser.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  ArrowLeft,
  UserPlus,
  Building2,
  ShieldCheck,
  Mail,
  Phone,
  Lock,
  User,
  AlertCircle,
} from "lucide-react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import api from "@/lib/api";

interface Errors {
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
  password_confirmation?: string;
  organization?: string;
  role?: string;
  general?: string;
}

export default function CreateUser() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Errors>({});

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    password_confirmation: "",
    role: "donor" as "admin" | "donor" | "receiver" | "volunteer",
    organization: "",
    is_verified: false,
    verification_note: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Frontend validation
    const newErrors: Errors = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.email.trim()) newErrors.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) newErrors.email = "Invalid email format";
    if (!form.password) newErrors.password = "Password is required";
    else if (form.password.length < 8) newErrors.password = "Password must be at least 8 characters";
    if (form.password !== form.password_confirmation)
      newErrors.password_confirmation = "Passwords do not match";
    if (form.role === "receiver" && !form.organization.trim())
      newErrors.organization = "Organization name is required for NGOs";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Please fix the errors below");
      return;
    }

    setLoading(true);
    try {
      await api.post("/admin/users", {
        ...form,
        is_verified: form.role === "receiver" ? form.is_verified : false,
      });

      toast.success("User created successfully!");
      navigate("/admin/users");
    } catch (err: any) {
      if (err.response?.status === 422) {
        // Laravel validation errors
        const laravelErrors = err.response.data.errors;
        const formatted: Errors = {};
        for (const key in laravelErrors) {
          formatted[key as keyof Errors] = laravelErrors[key][0];
        }
        setErrors(formatted);
        toast.error("Please check the form");
      } else {
        setErrors({ general: err.response?.data?.message || "Something went wrong" });
        toast.error("Failed to create user");
      }
    } finally {
      setLoading(false);
    }
  };

  const ErrorMessage = ({ message }: { message?: string }) => {
    if (!message) return null;
    return (
      <div className="flex items-center gap-2 mt-2 text-red-600 text-sm font-medium">
        <AlertCircle size={16} />
        <span>{message}</span>
      </div>
    );
  };

  return (
    <AuthenticatedLayout>
      <div className="p-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Users
          </button>
          <h1 className="text-4xl font-bold text-gray-800 flex items-center gap-3">
            <UserPlus className="text-rose-500" />
            Add New User
          </h1>
          <p className="text-gray-600 mt-2">
            Create a new donor, NGO (receiver), volunteer, or admin account
          </p>
        </div>

        {/* General Error */}
        {errors.general && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-3">
            <AlertCircle size={20} />
            <span>{errors.general}</span>
          </div>
        )}

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-rose-500 to-pink-500 p-6">
            <h2 className="text-2xl font-bold text-white">User Details</h2>
            <p className="text-pink-100 mt-1">Fill in all required information</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-7">
            {/* Personal Info */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <User size={18} />
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                    errors.name
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-rose-500"
                  }`}
                  placeholder="Gayashi Hasinika"
                />
                <ErrorMessage message={errors.name} />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Mail size={18} />
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                    errors.email
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-rose-500"
                  }`}
                  placeholder="gayashi@example.com"
                />
                <ErrorMessage message={errors.email} />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Phone size={18} />
                  Phone Number
                </label>
                <input
                  type="text"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all"
                  placeholder="076 134 3005"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  Role <span className="text-rose-500">*</span>
                </label>
                <select
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value as any })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all"
                >
                  <option value="donor">Donor</option>
                  <option value="receiver">Receiver (NGO)</option>
                  <option value="volunteer">Volunteer</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>

            {/* NGO Only Fields */}
            {form.role === "receiver" && (
              <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-6 space-y-5">
                <div className="flex items-center gap-3">
                  <Building2 className="text-amber-600" size={24} />
                  <h3 className="text-lg font-semibold text-amber-900">NGO / Organization Details</h3>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    Organization Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.organization}
                    onChange={(e) => setForm({ ...form, organization: e.target.value })}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all bg-white ${
                      errors.organization
                        ? "border-red-500 focus:ring-red-500"
                        : "border-amber-300 focus:ring-amber-500"
                    }`}
                    placeholder="Impresso Holding Ceylon"
                  />
                  <ErrorMessage message={errors.organization} />
                </div>

                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.is_verified}
                      onChange={(e) => setForm({ ...form, is_verified: e.target.checked })}
                      className="w-5 h-5 text-rose-600 rounded focus:ring-rose-500"
                    />
                    <span className="flex items-center gap-2 font-medium">
                      <ShieldCheck className="text-green-600" size={20} />
                      Mark as Verified NGO (trusted)
                    </span>
                  </label>
                </div>

                {form.is_verified && (
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Verification Note (optional)
                    </label>
                    <textarea
                      rows={3}
                      value={form.verification_note}
                      onChange={(e) => setForm({ ...form, verification_note: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500"
                      placeholder="Verified via registration documents and phone call on 2025-11-28"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Password */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Lock size={18} />
                  Password <span className="text-rose-500">*</span>
                </label>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                    errors.password
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-rose-500"
                  }`}
                  placeholder="••••••••"
                />
                <ErrorMessage message={errors.password} />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Lock size={18} />
                  Confirm Password <span className="text-rose-500">*</span>
                </label>
                <input
                  type="password"
                  value={form.password_confirmation}
                  onChange={(e) => setForm({ ...form, password_confirmation: e.target.value })}
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                    errors.password_confirmation
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-rose-500"
                  }`}
                  placeholder="••••••••"
                />
                <ErrorMessage message={errors.password_confirmation} />
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate("/admin/users")}
                className="px-8 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-xl hover:from-rose-600 hover:to-pink-600 transition-all font-medium shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-3"
              >
                {loading ? (
                  <>Creating...</>
                ) : (
                  <>
                    <UserPlus size={20} />
                    Create User Account
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}