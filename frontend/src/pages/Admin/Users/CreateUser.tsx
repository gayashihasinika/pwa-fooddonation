// src/pages/Admin/Users/CreateUser.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
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
  Heart,
} from "lucide-react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import api from "@/lib/api";
import newmemberImg from '@/assets/images/newmember.jpg';

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

    const newErrors: Errors = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.email.trim()) newErrors.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) newErrors.email = "Invalid email format";
    if (!form.password) newErrors.password = "Password is required";
    else if (form.password.length < 8) newErrors.password = "Password must be at least 8 characters";
    if (form.password !== form.password_confirmation)
      newErrors.password_confirmation = "Passwords do not match";

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

      toast.success("🎉 New user created successfully! Welcome to the community ❤️");
      navigate("/admin/users");
    } catch (err: any) {
      if (err.response?.status === 422) {
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
      <div className="flex items-center gap-2 mt-3 text-red-600 text-base font-medium">
        <AlertCircle className="w-5 h-5" />
        <span>{message}</span>
      </div>
    );
  };

  return (
    <AuthenticatedLayout>
      <div className="min-h-screen bg-gradient-to-b from-orange-50 via-amber-50 to-yellow-50 py-6 px-4 sm:py-8 lg:py-12">
        <div className="max-w-5xl mx-auto">
          {/* Hero Image — Responsive */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative rounded-3xl overflow-hidden shadow-3xl mb-10 sm:mb-12 border-8 border-white"
          >
            <img
              src={newmemberImg}
              alt="Volunteers welcoming new community members with food and kindness"
              className="w-full h-72 sm:h-96 lg:h-[500px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 lg:p-12 text-white text-center">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-4">
                Welcome a New Member ❤️
              </h1>
              <p className="text-lg sm:text-xl lg:text-3xl opacity-90 px-4">
                Grow our community of kindness, one person at a time
              </p>
            </div>
          </motion.div>

          {/* Back Button */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate(-1)}
            className="flex items-center gap-3 text-orange-700 hover:text-orange-800 font-medium mb-8 text-base sm:text-lg"
          >
            <ArrowLeft className="w-7 h-7 sm:w-8 sm:h-8" />
            Back to Users
          </motion.button>

          {/* General Error */}
          {errors.general && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 p-5 sm:p-6 bg-red-50 border-2 border-red-200 text-red-700 rounded-3xl flex items-center gap-4 text-base sm:text-lg"
            >
              <AlertCircle className="w-7 h-7 sm:w-8 sm:h-8 flex-shrink-0" />
              <span>{errors.general}</span>
            </motion.div>
          )}

          {/* Form Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-3xl overflow-hidden border-8 border-white"
          >
            <div className="bg-gradient-to-r from-orange-600 to-amber-500 p-6 sm:p-8 lg:p-10">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white flex items-center gap-4">
                <UserPlus className="w-10 h-10 sm:w-12 sm:h-12" />
                Add New Community Member
              </h2>
              <p className="text-orange-100 text-lg sm:text-xl mt-3">
                Create a donor, NGO, volunteer, or admin account
              </p>
            </div>

            <form onSubmit={handleSubmit} className="p-6 sm:p-8 lg:p-12 space-y-8 lg:space-y-10">
              {/* Personal Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="flex items-center gap-3 text-base sm:text-lg font-medium text-gray-700 mb-3">
                    <User className="w-6 h-6 sm:w-7 sm:h-7 text-orange-600" />
                    Full Name <span className="text-orange-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className={`w-full px-5 sm:px-6 py-4 sm:py-5 text-base sm:text-lg border-2 rounded-2xl focus:outline-none focus:ring-4 transition-all ${
                      errors.name
                        ? "border-red-500 focus:ring-red-300"
                        : "border-gray-300 focus:ring-orange-300"
                    }`}
                    placeholder="Gayashi Hasinika"
                  />
                  <ErrorMessage message={errors.name} />
                </div>

                <div>
                  <label className="flex items-center gap-3 text-base sm:text-lg font-medium text-gray-700 mb-3">
                    <Mail className="w-6 h-6 sm:w-7 sm:h-7 text-orange-600" />
                    Email Address <span className="text-orange-600">*</span>
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className={`w-full px-5 sm:px-6 py-4 sm:py-5 text-base sm:text-lg border-2 rounded-2xl focus:outline-none focus:ring-4 transition-all ${
                      errors.email
                        ? "border-red-500 focus:ring-red-300"
                        : "border-gray-300 focus:ring-orange-300"
                    }`}
                    placeholder="gayashi@example.com"
                  />
                  <ErrorMessage message={errors.email} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="flex items-center gap-3 text-base sm:text-lg font-medium text-gray-700 mb-3">
                    <Phone className="w-6 h-6 sm:w-7 sm:h-7 text-orange-600" />
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-5 sm:px-6 py-4 sm:py-5 text-base sm:text-lg border-2 border-gray-300 rounded-2xl focus:outline-none focus:ring-4 focus:ring-orange-300 transition-all"
                    placeholder="076 134 3005"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-3 text-base sm:text-lg font-medium text-gray-700 mb-3">
                    <Heart className="w-6 h-6 sm:w-7 sm:h-7 text-orange-600" />
                    Role <span className="text-orange-600">*</span>
                  </label>
                  <select
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value as any })}
                    className="w-full px-5 sm:px-6 py-4 sm:py-5 text-base sm:text-lg border-2 border-gray-300 rounded-2xl focus:outline-none focus:ring-4 focus:ring-orange-300 transition-all"
                  >
                    <option value="donor">Donor</option>
                    <option value="receiver">NGO / Receiver</option>
                    <option value="volunteer">Volunteer</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>

              {/* NGO Fields */}
              {form.role === "receiver" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  transition={{ duration: 0.4 }}
                  className="bg-gradient-to-br from-amber-50 to-orange-50 border-4 border-amber-300 rounded-3xl p-6 sm:p-8 space-y-8"
                >
                  <div className="flex items-center gap-4">
                    <Building2 className="w-10 h-10 sm:w-12 sm:h-12 text-amber-700" />
                    <h3 className="text-2xl sm:text-3xl font-bold text-amber-900">NGO / Organization Details</h3>
                  </div>

                  <div>
                    <label className="flex items-center gap-3 text-base sm:text-lg font-medium text-gray-700 mb-3">
                      Organization Name <span className="text-orange-600">*</span>
                    </label>
                    <input
                      type="text"
                      value={form.organization}
                      onChange={(e) => setForm({ ...form, organization: e.target.value })}
                      className={`w-full px-5 sm:px-6 py-4 sm:py-5 text-base sm:text-lg border-2 rounded-2xl focus:outline-none focus:ring-4 transition-all bg-white ${
                        errors.organization
                          ? "border-red-500 focus:ring-red-300"
                          : "border-amber-400 focus:ring-amber-300"
                      }`}
                      placeholder="Impresso Holding Ceylon"
                    />
                    <ErrorMessage message={errors.organization} />
                  </div>

                  <div className="flex items-center gap-6">
                    <label className="flex items-center gap-4 cursor-pointer text-lg sm:text-xl">
                      <input
                        type="checkbox"
                        checked={form.is_verified}
                        onChange={(e) => setForm({ ...form, is_verified: e.target.checked })}
                        className="w-7 h-7 sm:w-8 sm:h-8 text-orange-600 rounded focus:ring-orange-500"
                      />
                      <span className="flex items-center gap-3 font-bold text-orange-800">
                        <ShieldCheck className="w-9 h-9 sm:w-10 sm:h-10 text-emerald-600" />
                        Mark as Verified NGO
                      </span>
                    </label>
                  </div>

                  {form.is_verified && (
                    <div>
                      <label className="text-base sm:text-lg font-medium text-gray-700 mb-3 block">
                        Verification Note
                      </label>
                      <textarea
                        rows={4}
                        value={form.verification_note}
                        onChange={(e) => setForm({ ...form, verification_note: e.target.value })}
                        className="w-full px-5 sm:px-6 py-4 sm:py-5 text-base sm:text-lg border-2 border-gray-300 rounded-2xl focus:outline-none focus:ring-4 focus:ring-orange-300 bg-white"
                        placeholder="Verified via registration documents and phone call on December 17, 2025"
                      />
                    </div>
                  )}
                </motion.div>
              )}

              {/* Password Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="flex items-center gap-3 text-base sm:text-lg font-medium text-gray-700 mb-3">
                    <Lock className="w-6 h-6 sm:w-7 sm:h-7 text-orange-600" />
                    Password <span className="text-orange-600">*</span>
                  </label>
                  <input
                    type="password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className={`w-full px-5 sm:px-6 py-4 sm:py-5 text-base sm:text-lg border-2 rounded-2xl focus:outline-none focus:ring-4 transition-all ${
                      errors.password
                        ? "border-red-500 focus:ring-red-300"
                        : "border-gray-300 focus:ring-orange-300"
                    }`}
                    placeholder="••••••••"
                  />
                  <ErrorMessage message={errors.password} />
                </div>

                <div>
                  <label className="flex items-center gap-3 text-base sm:text-lg font-medium text-gray-700 mb-3">
                    <Lock className="w-6 h-6 sm:w-7 sm:h-7 text-orange-600" />
                    Confirm Password <span className="text-orange-600">*</span>
                  </label>
                  <input
                    type="password"
                    value={form.password_confirmation}
                    onChange={(e) => setForm({ ...form, password_confirmation: e.target.value })}
                    className={`w-full px-5 sm:px-6 py-4 sm:py-5 text-base sm:text-lg border-2 rounded-2xl focus:outline-none focus:ring-4 transition-all ${
                      errors.password_confirmation
                        ? "border-red-500 focus:ring-red-300"
                        : "border-gray-300 focus:ring-orange-300"
                    }`}
                    placeholder="••••••••"
                  />
                  <ErrorMessage message={errors.password_confirmation} />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row justify-end gap-4 sm:gap-6 pt-8 border-t-2 border-gray-200">
                <button
                  type="button"
                  onClick={() => navigate("/admin/users")}
                  className="w-full sm:w-auto px-8 sm:px-10 py-4 sm:py-5 border-2 border-gray-300 rounded-3xl hover:bg-gray-50 transition-all font-bold text-base sm:text-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto px-10 sm:px-12 py-4 sm:py-5 bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white rounded-3xl font-bold text-lg sm:text-xl shadow-2xl hover:shadow-3xl transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3 sm:gap-4"
                >
                  {loading ? (
                    "Creating..."
                  ) : (
                    <>
                      <UserPlus className="w-7 h-7 sm:w-8 sm:h-8" />
                      Create & Welcome User
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}