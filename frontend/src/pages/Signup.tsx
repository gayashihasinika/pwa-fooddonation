// frontend/src/pages/Signup.tsx
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { motion } from "framer-motion";
import { HiLockClosed, HiMail, HiUser, HiPhone, HiEye, HiEyeOff } from "react-icons/hi";
import { useLang } from "../context/LanguageContext";

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

  // Real-time validation
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

    // Final validation before submit
    validateField("name", form.name);
    validateField("email", form.email);
    validateField("password", form.password);
    validateField("phone", form.phone);

    if (Object.values(errors).some((err) => err) || !form.name || !form.email || !form.password) {
      return;
    }

    try {
      await axios.post("http://127.0.0.1:8001/api/register", form);

      // ROLE-SPECIFIC SUCCESS MESSAGE
      let roleMessage = "";
      let roleIcon = "❤️";

      if (form.role === "donor") {
        roleMessage = "Thank you for your generosity! Your donations will feed families and reduce food waste across Sri Lanka 🍲";
        roleIcon = "🍲";
      } else if (form.role === "receiver") {
        roleMessage = "Welcome! We're here to help connect you with warm meals from kind donors near you 🤝";
        roleIcon = "🤝";
      } else if (form.role === "volunteer") {
        roleMessage = "Thank you for your heart of service! Your help delivering food brings hope to many 🙏";
        roleIcon = "🙏";
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
            Welcome to FeedSriLanka! 🎉
          </h3>

          <p className="text-lg text-gray-800 mb-4">
            Hello <span className="font-bold text-orange-600">{form.name}</span>,<br />
            Your account has been created successfully!
          </p>

          <p className="text-md text-gray-700 mb-6 leading-relaxed">
            {roleMessage}
          </p>

          <img
            src="https://www.remitly.com/blog/wp-content/uploads/2023/09/sri-lanka-rice-and-curry-scaled.jpg"
            alt="Sri Lankan rice and curry"
            className="w-full h-40 object-cover rounded-2xl shadow-xl mx-auto mb-4"
          />

          <p className="text-md text-gray-600">
            Redirecting to login in 3 seconds...
          </p>
        </motion.div>,
        {
          duration: 3000,
          position: "top-center",
          style: { marginTop: "80px" },
        }
      );

      // Close toast after 3s and redirect
      setTimeout(() => {
        toast.dismiss(toastId);
        navigate("/login");
      }, 3000);
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
          {/* Left: Image */}
          <div className="relative h-96 md:h-full">
            <img
              src="https://www.remitly.com/blog/wp-content/uploads/2023/09/sri-lanka-rice-and-curry-scaled.jpg"
              alt="Delicious Sri Lankan rice and curry"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute bottom-10 left-10 text-white">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">Join FeedSriLanka ❤️</h2>
              <p className="text-xl opacity-90">Together, we reduce food waste and feed families across Sri Lanka</p>
            </div>
          </div>

          {/* Right: Form */}
          <div className="p-8 md:p-12 lg:p-16">
            <h2 className="text-4xl font-bold text-orange-800 text-center mb-4">Create Your Account</h2>
            <p className="text-center text-gray-600 mb-10">Join thousands making a difference every day</p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <motion.div variants={fadeUp} initial="hidden" animate="visible">
                <label className="block text-lg font-semibold text-gray-700 mb-2">Full Name</label>
                <div className="relative">
                  <HiUser className="absolute left-4 top-5 text-orange-600" size={24} />
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Your full name"
                    className={`w-full pl-14 pr-6 py-5 border-2 rounded-2xl focus:outline-none text-lg transition ${
                      errors.name ? "border-red-500" : "border-orange-200 focus:border-orange-500"
                    }`}
                    required
                  />
                </div>
                {errors.name && <p className="text-red-600 text-sm mt-2 ml-2">{errors.name}</p>}
              </motion.div>

              {/* Email */}
              <motion.div variants={fadeUp} initial="hidden" animate="visible" transition={{ delay: 0.1 }}>
                <label className="block text-lg font-semibold text-gray-700 mb-2">Email</label>
                <div className="relative">
                  <HiMail className="absolute left-4 top-5 text-orange-600" size={24} />
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    className={`w-full pl-14 pr-6 py-5 border-2 rounded-2xl focus:outline-none text-lg transition ${
                      errors.email ? "border-red-500" : "border-orange-200 focus:border-orange-500"
                    }`}
                    required
                  />
                </div>
                {errors.email && <p className="text-red-600 text-sm mt-2 ml-2">{errors.email}</p>}
              </motion.div>

              {/* Password */}
              <motion.div variants={fadeUp} initial="hidden" animate="visible" transition={{ delay: 0.2 }}>
                <label className="block text-lg font-semibold text-gray-700 mb-2">Password</label>
                <div className="relative">
                  <HiLockClosed className="absolute left-4 top-5 text-orange-600" size={24} />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className={`w-full pl-14 pr-16 py-5 border-2 rounded-2xl focus:outline-none text-lg transition ${
                      errors.password ? "border-red-500" : "border-orange-200 focus:border-orange-500"
                    }`}
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
                {errors.password && <p className="text-red-600 text-sm mt-2 ml-2">{errors.password}</p>}
              </motion.div>

              {/* Phone */}
              <motion.div variants={fadeUp} initial="hidden" animate="visible" transition={{ delay: 0.3 }}>
                <label className="block text-lg font-semibold text-gray-700 mb-2">Phone (Optional)</label>
                <div className="relative">
                  <HiPhone className="absolute left-4 top-5 text-orange-600" size={24} />
                  <input
                    type="text"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="Your phone number"
                    className={`w-full pl-14 pr-6 py-5 border-2 rounded-2xl focus:outline-none text-lg transition ${
                      errors.phone ? "border-red-500" : "border-orange-200 focus:border-orange-500"
                    }`}
                  />
                </div>
                {errors.phone && <p className="text-red-600 text-sm mt-2 ml-2">{errors.phone}</p>}
              </motion.div>

              {/* Role & Organization — unchanged */}
              <motion.div variants={fadeUp} initial="hidden" animate="visible" transition={{ delay: 0.4 }}>
                <label className="block text-lg font-semibold text-gray-700 mb-2">I am a...</label>
                <select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className="w-full px-6 py-5 border-2 border-orange-200 rounded-2xl focus:border-orange-500 focus:outline-none text-lg bg-white"
                >
                  <option value="donor">Food Donor</option>
                  <option value="receiver">Food Receiver</option>
                  <option value="volunteer">Volunteer</option>
                </select>
              </motion.div>

              {(form.role === "donor" || form.role === "volunteer") && (
                <motion.div variants={fadeUp} initial="hidden" animate="visible" transition={{ delay: 0.5 }}>
                  <label className="block text-lg font-semibold text-gray-700 mb-2">Organization (Optional)</label>
                  <input
                    type="text"
                    name="organization"
                    value={form.organization}
                    onChange={handleChange}
                    placeholder="Your organization name"
                    className="w-full px-6 py-5 border-2 border-orange-200 rounded-2xl focus:border-orange-500 focus:outline-none text-lg"
                  />
                </motion.div>
              )}

              {/* Submit */}
              <motion.button
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.6 }}
                type="submit"
                className="w-full py-6 mt-10 text-2xl font-bold text-white bg-gradient-to-r from-orange-600 to-amber-500 rounded-2xl shadow-2xl hover:shadow-3xl transition transform hover:scale-105"
              >
                Create Account
              </motion.button>

              <p className="text-center text-gray-600 mt-8">
                Already have an account?{" "}
                <span
                  onClick={() => navigate("/login")}
                  className="text-orange-700 font-bold hover:underline cursor-pointer"
                >
                  Login here
                </span>
              </p>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
}