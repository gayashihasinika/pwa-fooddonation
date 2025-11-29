// src/pages/Signup.tsx
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { motion } from "framer-motion";
import { HiLockClosed, HiMail, HiUser, HiPhone, HiEye, HiEyeOff } from "react-icons/hi";
import { useLang } from "../context/LanguageContext";

// Fixed Framer Motion variants — TypeScript fully happy!
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (custom: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: custom,
      duration: 0.6,
      ease: "easeOut" as const,
    },
  }),
};

export default function Signup() {
  const { t } = useLang(); // Removed unused: language, changeLanguage
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "donor" as const,
    organization: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    const phoneRegex = /^[0-9]{7,15}$/;

    if (!form.name.trim()) return toast.error(t("nameRequired") || "Name is required");
    if (!emailRegex.test(form.email)) return toast.error(t("invalidEmail") || "Invalid email format");
    if (!passwordRegex.test(form.password))
      return toast.error(t("passwordStrength") || "Password must include uppercase, lowercase & number (min 8 chars)");
    if (form.phone && !phoneRegex.test(form.phone))
      return toast.error(t("invalidPhone") || "Phone must be 7–15 digits");

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await axios.post("http://127.0.0.1:8001/api/register", form, {
        headers: { "Content-Type": "application/json" },
      });
      toast.success(t("signupSuccess") || "Account created successfully!");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err: any) {
      toast.error(err.response?.data?.message || t("signupFailed") || "Signup failed");
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50 font-sans text-gray-800">
      <Toaster position="top-center" />

      {/* Left Side - Beautiful Gradient */}
      <div className="hidden md:flex w-1/2 bg-gradient-to-br from-rose-500 via-orange-400 to-amber-400 items-center justify-center text-white relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="text-center p-12 z-10"
        >
          <h1 className="text-5xl font-extrabold mb-6 tracking-tight drop-shadow-lg">
            {t("joinFeedSriLanka")}
          </h1>
          <p className="text-xl text-white/90 leading-relaxed max-w-lg mx-auto">
            {t("togetherWeFeed")}
          </p>
        </motion.div>
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute w-96 h-96 bg-white/20 rounded-full blur-3xl -bottom-20 -right-20" />
      </div>

      {/* Right Side - Signup Form */}
      <div className="flex-1 flex items-center justify-center p-8 md:p-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-lg bg-white shadow-2xl rounded-3xl px-10 py-12"
        >
          <motion.h2
            custom={0}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="text-4xl font-bold text-center text-gray-900 mb-3"
          >
            {t("createAccount")}
          </motion.h2>

          <motion.p
            custom={0.1}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="text-center text-gray-600 mb-10"
          >
            {t("signupSubtitle")}
          </motion.p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name */}
            <motion.div custom={0.1} initial="hidden" animate="visible" variants={fadeUp}>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {t("fullName")}
              </label>
              <div className="relative">
                <HiUser className="absolute left-4 top-4 text-gray-400" size={20} />
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder={t("enterName")}
                  className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition"
                  required
                />
              </div>
            </motion.div>

            {/* Email */}
            <motion.div custom={0.2} initial="hidden" animate="visible" variants={fadeUp}>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {t("email")}
              </label>
              <div className="relative">
                <HiMail className="absolute left-4 top-4 text-gray-400" size={20} />
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder={t("enterEmail")}
                  className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-rose-500 focus:border-transparent outline-none transition"
                  required
                />
              </div>
            </motion.div>

            {/* Password */}
            <motion.div custom={0.3} initial="hidden" animate="visible" variants={fadeUp}>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {t("password")}
              </label>
              <div className="relative">
                <HiLockClosed className="absolute left-4 top-4 text-gray-400" size={20} />
                <input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-14 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <HiEyeOff size={20} /> : <HiEye size={20} />}
                </button>
              </div>
            </motion.div>

            {/* Phone */}
            <motion.div custom={0.4} initial="hidden" animate="visible" variants={fadeUp}>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {t("phoneOptional")}
              </label>
              <div className="relative">
                <HiPhone className="absolute left-4 top-4 text-gray-400" size={20} />
                <input
                  type="text"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder={t("enterPhone")}
                  className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none"
                />
              </div>
            </motion.div>

            {/* Role Selection */}
            <motion.div custom={0.5} initial="hidden" animate="visible" variants={fadeUp}>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {t("iAmA")}
              </label>
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value as any })}
                className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none bg-white"
              >
                <option value="donor">{t("donor")}</option>
                <option value="receiver">{t("receiver")}</option>
                <option value="volunteer">{t("volunteer")}</option>
              </select>
            </motion.div>

            {/* Organization (Conditional) */}
            {(form.role === "donor" || form.role === "volunteer") && (
              <motion.div custom={0.6} initial="hidden" animate="visible" variants={fadeUp}>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {t("organizationOptional")}
                </label>
                <input
                  type="text"
                  value={form.organization}
                  onChange={(e) => setForm({ ...form, organization: e.target.value })}
                  placeholder={t("organizationName")}
                  className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none"
                />
              </motion.div>
            )}

            {/* Submit Button */}
            <motion.button
              custom={0.7}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              type="submit"
              className="w-full py-4 mt-8 text-lg font-bold text-white bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 rounded-xl shadow-lg hover:shadow-2xl transform transition-all duration-300 hover:scale-[1.02] active:scale-98"
            >
              {t("createAccount")}
            </motion.button>

            {/* Login Link */}
            <motion.p
              custom={0.8}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="text-center text-gray-600 mt-8"
            >
              {t("alreadyAccount")}{" "}
              <span
                onClick={() => navigate("/login")}
                className="text-rose-600 font-bold hover:underline cursor-pointer"
              >
                {t("loginHere")}
              </span>
            </motion.p>
          </form>
        </motion.div>
      </div>
    </div>
  );
}