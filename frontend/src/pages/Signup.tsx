import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { motion } from "framer-motion";
import { HiLockClosed, HiMail, HiUser, HiPhone } from "react-icons/hi";
import { useLang } from "../context/LanguageContext";

export default function Signup() {
  const { t, language, changeLanguage } = useLang();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "donor",
    organization: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    const phoneRegex = /^[0-9]{7,15}$/;

    if (!form.name.trim()) return toast.error("Name is required");
    if (!emailRegex.test(form.email)) return toast.error("Invalid email format");
    if (!passwordRegex.test(form.password))
      return toast.error(
        "Password must include uppercase, lowercase & number (min 8 chars)"
      );
    if (form.phone && !phoneRegex.test(form.phone))
      return toast.error("Phone must be 7–15 digits");
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      await axios.post("http://127.0.0.1:8001/api/register", form, {
        headers: { "Content-Type": "application/json" },
      });
      toast.success("Signup successful!");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Signup failed");
    }
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (delay = 0) => ({
      opacity: 1,
      y: 0,
      transition: { delay, duration: 0.6, ease: "easeOut" },
    }),
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50 font-sans text-gray-800">
      <Toaster position="top-center" />

      {/* Left Side - Gradient / Image */}
      <div className="hidden md:flex w-1/2 bg-gradient-to-br from-rose-500 via-orange-400 to-amber-400 items-center justify-center text-white relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="text-center p-12"
        >
          <h1 className="text-5xl font-extrabold mb-4 tracking-tight drop-shadow-md">
            Feed<span className="text-yellow-300">SriLanka</span>
          </h1>
          <p className="text-lg text-white/90 leading-relaxed max-w-md mx-auto">
            Join our mission to connect donors, volunteers, and receivers — together we can end hunger.
          </p>
        </motion.div>

        {/* Decorative blur circle */}
        <div className="absolute w-96 h-96 bg-white/20 rounded-full blur-3xl top-20 left-10 opacity-20" />
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 md:p-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="w-full max-w-md bg-white shadow-xl rounded-2xl px-8 py-10"
        >
          <motion.h2
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="text-3xl font-bold text-gray-900 text-center mb-2"
          >
            Create an Account
          </motion.h2>
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.1 }}
            className="text-center text-gray-500 mb-8"
          >
            Sign up to get started on your journey.
          </motion.p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <motion.div variants={fadeUp} initial="hidden" animate="visible">
              <label className="text-sm font-medium text-gray-600">Full Name</label>
              <div className="relative mt-1">
                <HiUser className="absolute left-3 top-3.5 text-gray-400" />
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Enter your name"
                  className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-400 focus:outline-none"
                  required
                />
              </div>
            </motion.div>

            {/* Email */}
            <motion.div variants={fadeUp} initial="hidden" animate="visible" transition={{ delay: 0.1 }}>
              <label className="text-sm font-medium text-gray-600">Email</label>
              <div className="relative mt-1">
                <HiMail className="absolute left-3 top-3.5 text-gray-400" />
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="Enter your email"
                  className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-400 focus:outline-none"
                  required
                />
              </div>
            </motion.div>

            {/* Password */}
            <motion.div variants={fadeUp} initial="hidden" animate="visible" transition={{ delay: 0.2 }}>
              <label className="text-sm font-medium text-gray-600">Password</label>
              <div className="relative mt-1">
                <HiLockClosed className="absolute left-3 top-3.5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="Create a password"
                  className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-400 focus:outline-none"
                  required
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-500 text-sm cursor-pointer select-none"
                >
                  {showPassword ? "Hide" : "Show"}
                </span>
              </div>
            </motion.div>

            {/* Phone */}
            <motion.div variants={fadeUp} initial="hidden" animate="visible" transition={{ delay: 0.3 }}>
              <label className="text-sm font-medium text-gray-600">Phone (Optional)</label>
              <div className="relative mt-1">
                <HiPhone className="absolute left-3 top-3.5 text-gray-400" />
                <input
                  type="text"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="Enter phone number"
                  className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-400 focus:outline-none"
                />
              </div>
            </motion.div>

            {/* Role */}
            <motion.div variants={fadeUp} initial="hidden" animate="visible" transition={{ delay: 0.4 }}>
              <label className="text-sm font-medium text-gray-600">Role</label>
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-400 focus:outline-none"
              >
                <option value="donor">Donor</option>
                <option value="receiver">Receiver</option>
                <option value="volunteer">Volunteer</option>
              </select>
            </motion.div>

            {/* Organization */}
            {(form.role === "donor" || form.role === "volunteer") && (
              <motion.div variants={fadeUp} initial="hidden" animate="visible" transition={{ delay: 0.5 }}>
                <label className="text-sm font-medium text-gray-600">Organization (Optional)</label>
                <input
                  type="text"
                  value={form.organization}
                  onChange={(e) => setForm({ ...form, organization: e.target.value })}
                  placeholder="Organization name"
                  className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-400 focus:outline-none"
                />
              </motion.div>
            )}

            {/* Submit Button */}
            <motion.button
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.6 }}
              type="submit"
              className="w-full py-3 mt-4 rounded-lg bg-gradient-to-r from-rose-500 via-orange-400 to-amber-400 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02] active:scale-95"
            >
              {t("signUp")}
            </motion.button>

            {/* Login Redirect */}
            <motion.p
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.7 }}
              className="text-center text-sm text-gray-600 mt-5"
            >
              Already have an account?{" "}
              <span
                onClick={() => navigate("/login")}
                className="text-rose-500 font-semibold hover:underline cursor-pointer"
              >
                Login here
              </span>
            </motion.p>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
