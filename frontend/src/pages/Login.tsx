// src/pages/Login.tsx
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { motion } from "framer-motion";
import { HiMail, HiLockClosed, HiEye, HiEyeOff } from "react-icons/hi";
import { useLang } from "../context/LanguageContext";

// Fixed Framer Motion variants — NO MORE TYPE ERRORS!
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (custom = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: custom,
      duration: 0.6,
      ease: "easeOut" as const, // Fixed: string → proper easing type
    },
  }),
};

export default function Login() {
  const navigate = useNavigate();
  const { t } = useLang(); // Removed unused: language & changeLanguage

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://127.0.0.1:8001/api/login", form, {
        headers: { "Content-Type": "application/json" },
      });

      const { access_token, role, user } = res.data;
      localStorage.setItem("auth_token", access_token);
      localStorage.setItem("authUser", JSON.stringify(user));
      localStorage.setItem("user_role", role);

      if (rememberMe) {
        sessionStorage.setItem("auth_token", access_token);
        sessionStorage.setItem("authUser", JSON.stringify(user));
        sessionStorage.setItem("user_role", role);
      }

      toast.success("Login successful!");
      redirectUser(role);
    } catch (err: any) {
      console.error(err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Login failed");
    }
  };

  const redirectUser = (role: string) => {
    switch (role) {
      case "donor":
        navigate("/Donors/dashboard");
        break;
      case "volunteer":
        navigate("/Volunteers/dashboard");
        break;
      case "receiver":
        navigate("/Receivers/dashboard");
        break;
      case "admin":
        navigate("/Admin/dashboard");
        break;
      default:
        navigate("/");
        break;
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50 font-sans text-gray-800">
      <Toaster position="top-center" />

      {/* Left Side - Gradient Section */}
      <div className="hidden md:flex w-1/2 bg-gradient-to-br from-rose-500 via-orange-400 to-amber-400 items-center justify-center text-white relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="text-center p-12 z-10"
        >
          <h1 className="text-5xl font-extrabold mb-4 tracking-tight drop-shadow-md">
            {t("leftTitle")}
          </h1>
          <p className="text-lg text-white/90 leading-relaxed max-w-md mx-auto">
            {t("leftDesc")}
          </p>
        </motion.div>
        <div className="absolute w-96 h-96 bg-white/20 rounded-full blur-3xl top-20 left-10 opacity-20" />
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 md:p-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="w-full max-w-md bg-white shadow-2xl rounded-2xl px-8 py-10"
        >
          <motion.h2
            custom={0}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="text-3xl font-bold text-gray-900 text-center mb-2"
          >
            {t("welcomeBack")}
          </motion.h2>

          <motion.p
            custom={0.1}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="text-center text-gray-500 mb-8"
          >
            {t("loginSubtitle")}
          </motion.p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <motion.div custom={0.1} initial="hidden" animate="visible" variants={fadeUp}>
              <label className="text-sm font-medium text-gray-600">{t("email")}</label>
              <div className="relative mt-1">
                <HiMail className="absolute left-3 top-3.5 text-gray-400" size={20} />
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder={t("emailPlaceholder") || "you@example.com"}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-400 focus:outline-none transition"
                  required
                />
              </div>
            </motion.div>

            {/* Password */}
            <motion.div custom={0.2} initial="hidden" animate="visible" variants={fadeUp}>
              <label className="text-sm font-medium text-gray-600">{t("password")}</label>
              <div className="relative mt-1">
                <HiLockClosed className="absolute left-3 top-3.5 text-gray-400" size={20} />
                <input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-400 focus:outline-none"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <HiEyeOff size={20} /> : <HiEye size={20} />}
                </button>
              </div>
            </motion.div>

            {/* Remember Me + Forgot Password */}
            <motion.div
              custom={0.3}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="flex items-center justify-between text-sm"
            >
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                  className="w-4 h-4 text-rose-500 rounded focus:ring-rose-400"
                />
                <span className="text-gray-600">{t("rememberMe")}</span>
              </label>
              <span
                onClick={() => navigate("/forgot-password")}
                className="text-rose-500 hover:underline cursor-pointer"
              >
                {t("forgotPassword")}
              </span>
            </motion.div>

            {/* Submit Button */}
            <motion.button
              custom={0.4}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              type="submit"
              className="w-full py-3.5 mt-6 rounded-xl bg-gradient-to-r from-rose-500 via-orange-400 to-amber-400 text-white font-bold text-lg shadow-lg hover:shadow-xl transform transition-all duration-200 hover:scale-[1.02] active:scale-98"
            >
              {t("login")}
            </motion.button>

            {/* Signup Link */}
            <motion.p
              custom={0.5}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="text-center text-sm text-gray-600 mt-6"
            >
              {t("noAccount")}{" "}
              <span
                onClick={() => navigate("/signup")}
                className="text-rose-600 font-bold hover:underline cursor-pointer"
              >
                {t("signup")}
              </span>
            </motion.p>
          </form>
        </motion.div>
      </div>
    </div>
  );
}