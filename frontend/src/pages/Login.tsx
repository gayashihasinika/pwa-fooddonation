import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { motion } from "framer-motion";
import { HiMail, HiLockClosed } from "react-icons/hi";
import { useLang } from "../context/LanguageContext";

export default function Login() {
  const navigate = useNavigate();
  const { t, language, changeLanguage } = useLang();
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

      if (!rememberMe) {
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

      {/* Left Side - Gradient Section */}
      <div className="hidden md:flex w-1/2 bg-gradient-to-br from-rose-500 via-orange-400 to-amber-400 items-center justify-center text-white relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="text-center p-12"
        >
          <h1 className="text-5xl font-extrabold mb-4 tracking-tight drop-shadow-md">
            {t("leftTitle")}
          </h1>
          <p className="text-lg text-white/90 leading-relaxed max-w-md mx-auto">
            {t("leftDesc")}
          </p>
        </motion.div>

        {/* Decorative blur circle */}
        <div className="absolute w-96 h-96 bg-white/20 rounded-full blur-3xl top-20 left-10 opacity-20" />
      </div>

      {/* Right Side - Login Form */}
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
            {t("welcomeBack")}
          </motion.h2>
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.1 }}
            className="text-center text-gray-500 mb-8"
          >
            {t("loginSubtitle")}
          </motion.p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <motion.div variants={fadeUp} initial="hidden" animate="visible">
              <label className="text-sm font-medium text-gray-600">{t("email")}</label>
              <div className="relative mt-1">
                <HiMail className="absolute left-3 top-3.5 text-gray-400" />
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder={t("email")}
                  className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-400 focus:outline-none"
                  required
                />
              </div>
            </motion.div>

            {/* Password */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.1 }}
            >
              <label className="text-sm font-medium text-gray-600"> {t("password")}</label>
              <div className="relative mt-1">
                <HiLockClosed className="absolute left-3 top-3.5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder={t("password")}
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

            {/* Remember Me + Forgot Password */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.2 }}
              className="flex items-center justify-between text-sm text-gray-600"
            >
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                  className="h-4 w-4 accent-rose-500"
                />
                {t("rememberMe")}
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
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.3 }}
              type="submit"
              className="w-full py-3 mt-4 rounded-lg bg-gradient-to-r from-rose-500 via-orange-400 to-amber-400 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02] active:scale-95"
            >
              {t("login")}
            </motion.button>

            {/* Signup Redirect */}
            <motion.p
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.4 }}
              className="text-center text-sm text-gray-600 mt-5"
            >
              {t("noAccount")}{" "}
              <span
                onClick={() => navigate("/signup")}
                className="text-rose-500 font-semibold hover:underline cursor-pointer"
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
