import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { motion } from "framer-motion";
import { HiMail, HiLockClosed, HiEye, HiEyeOff } from "react-icons/hi";
import { useLang } from "../context/LanguageContext";
import signupimage from "../assets/images/signup.jpg";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function Login() {
  const { t } = useLang();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://127.0.0.1:8001/api/login", form);

      const { access_token, role, user } = res.data;

      localStorage.setItem("auth_token", access_token);
      localStorage.setItem("authUser", JSON.stringify(user));
      localStorage.setItem("user_role", role);

      if (rememberMe) {
        sessionStorage.setItem("auth_token", access_token);
        sessionStorage.setItem("authUser", JSON.stringify(user));
        sessionStorage.setItem("user_role", role);
      }

      let welcomeMessage = "";
      let roleIcon = "❤️";

      if (role === "donor") {
        welcomeMessage = "Thank you for coming back! Your kindness continues to feed families across Sri Lanka 🍲";
        roleIcon = "🍲";
      } else if (role === "receiver") {
        welcomeMessage = "Welcome back! Let's find warm meals waiting for you today 🤝";
        roleIcon = "🤝";
      } else if (role === "volunteer") {
        welcomeMessage = "Thank you for your service! Ready to deliver hope and food today? 🙏";
        roleIcon = "🙏";
      } else if (role === "admin") {
        welcomeMessage = "Welcome back, Admin! Ready to manage and make an impact? 🛠️";
        roleIcon = "🛠️";
      }

      const toastId = toast.custom(
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 max-w-sm w-full text-center border-4 border-orange-200"
        >
          <motion.div
            animate={{ y: [0, -15, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="text-7xl mb-4"
          >
            {roleIcon}
          </motion.div>

          <h3 className="text-2xl font-bold text-orange-700 mb-4">
            {t("welcomeBack")} 🎉
          </h3>

          <p className="text-lg text-gray-800 mb-4">
            Hello <span className="font-bold text-orange-600">{user.name}</span>!
          </p>

          <p className="text-md text-gray-700 mb-6 leading-relaxed px-2">
            {welcomeMessage}
          </p>

          <img
            src={signupimage}
            alt="Sri Lankan rice and curry"
            className="w-full h-40 object-cover rounded-2xl shadow-xl mx-auto mb-4"
          />

          <p className="text-md text-gray-600">
            Taking you to your dashboard...
          </p>
        </motion.div>,
        {
          duration: 3000,
          position: "top-center",
          style: { marginTop: "80px" },
        }
      );

      setTimeout(() => {
        toast.dismiss(toastId);
        redirectUser(role);
      }, 3000);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Login failed. Please check your credentials.");
    }
  };

  const redirectUser = (role: string) => {
    switch (role) {
      case "donor":
        navigate("/donors/dashboard");
        break;
      case "volunteer":
        navigate("/volunteers/dashboard");
        break;
      case "receiver":
        navigate("/receivers/dashboard");
        break;
      case "admin":
        navigate("/admin/dashboard");
        break;
      default:
        navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-amber-50 to-yellow-50 flex items-center justify-center p-6">
      <Toaster position="top-center" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden"
      >
        <div className="grid md:grid-cols-2">
          
          {/* Left Side */}
          <div className="relative h-96 md:h-full">
            <img
              src={signupimage}
              alt="Warm Sri Lankan food"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute bottom-10 left-10 text-white">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                {t("leftTitle")}
              </h2>
              <p className="text-xl opacity-90">
                {t("leftDesc")}
              </p>
            </div>
          </div>

          {/* Right Side Form */}
          <div className="p-8 md:p-12 lg:p-16">
            <h2 className="text-4xl font-bold text-orange-800 text-center mb-4">
              {t("welcomeBack")}
            </h2>
            <p className="text-center text-gray-600 mb-10">
              {t("loginSubtitle")}
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Email */}
              <motion.div variants={fadeUp} initial="hidden" animate="visible">
                <label className="block text-lg font-semibold text-gray-700 mb-2">
                  {t("email")}
                </label>
                <div className="relative">
                  <HiMail className="absolute left-4 top-5 text-orange-600" size={24} />
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder={t("email")}
                    className="w-full pl-14 pr-6 py-5 border-2 border-orange-200 rounded-2xl focus:border-orange-500 focus:outline-none text-lg"
                    required
                  />
                </div>
              </motion.div>

              {/* Password */}
              <motion.div variants={fadeUp} initial="hidden" animate="visible" transition={{ delay: 0.1 }}>
                <label className="block text-lg font-semibold text-gray-700 mb-2">
                  {t("password")}
                </label>
                <div className="relative">
                  <HiLockClosed className="absolute left-4 top-5 text-orange-600" size={24} />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder="••••••••"
                    className="w-full pl-14 pr-16 py-5 border-2 border-orange-200 rounded-2xl focus:border-orange-500 focus:outline-none text-lg"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-5 text-gray-600"
                  >
                    {showPassword ? <HiEyeOff size={24} /> : <HiEye size={24} />}
                  </button>
                </div>
              </motion.div>

              {/* Remember + Forgot */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                    className="w-5 h-5 text-orange-600 rounded focus:ring-orange-500"
                  />
                  <span className="text-gray-700">{t("rememberMe")}</span>
                </label>
                <span className="text-orange-600 hover:underline cursor-pointer text-sm">
                  {t("forgotPassword")}
                </span>
              </div>

              {/* Submit */}
              <motion.button
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.2 }}
                type="submit"
                className="w-full py-6 mt-8 text-2xl font-bold text-white bg-gradient-to-r from-orange-600 to-amber-500 rounded-2xl shadow-2xl transition transform hover:scale-105"
              >
                {t("login")}
              </motion.button>

              <p className="text-center text-gray-600 mt-8">
                {t("noAccount")}{" "}
                <span
                  onClick={() => navigate("/signup")}
                  className="text-orange-700 font-bold hover:underline cursor-pointer"
                >
                  {t("signup")}
                </span>
              </p>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
