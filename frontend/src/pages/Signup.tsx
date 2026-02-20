import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { motion } from "framer-motion";
import { HiLockClosed, HiMail, HiUser, HiPhone, HiEye, HiEyeOff } from "react-icons/hi";
import { useLang } from "../context/LanguageContext";
import signupimage from "../assets/images/signup.jpg";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function Signup() {
  const { t } = useLang();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "donor" as "donor" | "receiver" | "volunteer",
    organization: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const validateField = (name: string, value: string) => {
    let error = "";

    if (name === "name" && !value.trim()) {
      error = "Name is required";
    }
    if (name === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!value) error = "Email is required";
      else if (!emailRegex.test(value)) error = "Please enter a valid email address";
    }
    if (name === "password") {
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
      if (!value) error = "Password is required";
      else if (!passwordRegex.test(value))
        error = "Password must be at least 8 characters with uppercase, lowercase, and number";
    }
    if (name === "phone" && value) {
      const phoneRegex = /^[0-9]{7,15}$/;
      if (!phoneRegex.test(value)) error = "Phone number must be 7–15 digits";
    }

    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    validateField("name", form.name);
    validateField("email", form.email);
    validateField("password", form.password);
    validateField("phone", form.phone);

    if (Object.values(errors).some((err) => err) || !form.name || !form.email || !form.password) {
      return;
    }

    try {
      await axios.post("http://127.0.0.1:8001/api/register", form);

      toast.success("Account created successfully 🎉");

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Signup failed. Please try again.");
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
          {/* Left Image */}
          <div className="relative h-96 md:h-full">
            <img
              src={signupimage}
              alt="Signup"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute bottom-10 left-10 text-white">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                {t("createAccount")}
              </h2>
              <p className="text-xl opacity-90">
                {t("signupSubtitle")}
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="p-8 md:p-12 lg:p-16">
            <h2 className="text-4xl font-bold text-orange-800 text-center mb-4">
              {t("createAccount")}
            </h2>
            <p className="text-center text-gray-600 mb-10">
              {t("signupSubtitle")}
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Full Name */}
              <motion.div variants={fadeUp} initial="hidden" animate="visible">
                <label className="block text-lg font-semibold text-gray-700 mb-2">
                  {t("fullName")}
                </label>
                <div className="relative">
                  <HiUser className="absolute left-4 top-5 text-orange-600" size={24} />
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder={t("enterName")}
                    className="w-full pl-14 pr-6 py-5 border-2 border-orange-200 rounded-2xl focus:border-orange-500 focus:outline-none text-lg"
                    required
                  />
                </div>
              </motion.div>

              {/* Email */}
              <motion.div variants={fadeUp} initial="hidden" animate="visible">
                <label className="block text-lg font-semibold text-gray-700 mb-2">
                  {t("email")}
                </label>
                <div className="relative">
                  <HiMail className="absolute left-4 top-5 text-orange-600" size={24} />
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder={t("enterEmail")}
                    className="w-full pl-14 pr-6 py-5 border-2 border-orange-200 rounded-2xl focus:border-orange-500 focus:outline-none text-lg"
                    required
                  />
                </div>
              </motion.div>

              {/* Password */}
              <motion.div variants={fadeUp} initial="hidden" animate="visible">
                <label className="block text-lg font-semibold text-gray-700 mb-2">
                  {t("createPassword")}
                </label>
                <div className="relative">
                  <HiLockClosed className="absolute left-4 top-5 text-orange-600" size={24} />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
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

              {/* Phone */}
              <motion.div variants={fadeUp} initial="hidden" animate="visible">
                <label className="block text-lg font-semibold text-gray-700 mb-2">
                  {t("phoneOptional")}
                </label>
                <div className="relative">
                  <HiPhone className="absolute left-4 top-5 text-orange-600" size={24} />
                  <input
                    type="text"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder={t("enterPhone")}
                    className="w-full pl-14 pr-6 py-5 border-2 border-orange-200 rounded-2xl focus:border-orange-500 focus:outline-none text-lg"
                  />
                </div>
              </motion.div>

              {/* Role */}
              <motion.div variants={fadeUp} initial="hidden" animate="visible">
                <label className="block text-lg font-semibold text-gray-700 mb-2">
                  {t("role")}
                </label>
                <select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className="w-full px-6 py-5 border-2 border-orange-200 rounded-2xl focus:border-orange-500 focus:outline-none text-lg"
                >
                  <option value="donor">{t("donor")}</option>
                  <option value="receiver">{t("receiver")}</option>
                  <option value="volunteer">{t("volunteer")}</option>
                </select>
              </motion.div>

              {(form.role === "donor" || form.role === "volunteer") && (
                <motion.div variants={fadeUp} initial="hidden" animate="visible">
                  <label className="block text-lg font-semibold text-gray-700 mb-2">
                    {t("organizationOptional")}
                  </label>
                  <input
                    type="text"
                    name="organization"
                    value={form.organization}
                    onChange={handleChange}
                    placeholder={t("organizationName")}
                    className="w-full px-6 py-5 border-2 border-orange-200 rounded-2xl focus:border-orange-500 focus:outline-none text-lg"
                  />
                </motion.div>
              )}

              {/* Submit */}
              <motion.button
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                type="submit"
                className="w-full py-6 mt-10 text-2xl font-bold text-white bg-gradient-to-r from-orange-600 to-amber-500 rounded-2xl shadow-2xl transition transform hover:scale-105"
              >
                {t("createAccount")}
              </motion.button>

              <p className="text-center text-gray-600 mt-8">
                {t("alreadyAccount")}{" "}
                <span
                  onClick={() => navigate("/login")}
                  className="text-orange-700 font-bold hover:underline cursor-pointer"
                >
                  {t("loginHere")}
                </span>
              </p>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
