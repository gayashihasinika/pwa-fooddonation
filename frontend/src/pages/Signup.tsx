import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

export default function Signup() {
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

    if (!form.name.trim()) {
      toast.error("Name is required");
      return false;
    }
    if (!emailRegex.test(form.email)) {
      toast.error("Invalid email format");
      return false;
    }
    if (!passwordRegex.test(form.password)) {
      toast.error(
        "Password must be at least 8 characters and include uppercase, lowercase, and number"
      );
      return false;
    }
    if (form.phone && !phoneRegex.test(form.phone)) {
      toast.error("Phone must be 7-15 digits");
      return false;
    }
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
      setForm({ name: "", email: "", password: "", phone: "", role: "donor", organization: "" });
      setTimeout(() => navigate("/login"), 2000);
    } catch (err: any) {
      console.error(err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-300 to-blue-300">
      <Toaster position="top-center" />
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md flex flex-col gap-6"
      >
        <h1 className="text-3xl font-bold text-center text-gray-700">Sign Up</h1>

        {/* Name */}
        <div className="relative">
          <input
            type="text"
            id="name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder=" "
            required
            className="peer border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <label
            htmlFor="name"
            className="absolute left-3 top-3 text-gray-400 text-base transition-all
                       peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400
                       peer-focus:top-1 peer-focus:text-sm peer-focus:text-green-500
                       peer-valid:top-1 peer-valid:text-sm peer-valid:text-green-500"
          >
            Name
          </label>
        </div>

        {/* Email */}
        <div className="relative">
          <input
            type="email"
            id="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder=" "
            required
            className="peer border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <label
            htmlFor="email"
            className="absolute left-3 top-3 text-gray-400 text-base transition-all
                       peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400
                       peer-focus:top-1 peer-focus:text-sm peer-focus:text-green-500
                       peer-valid:top-1 peer-valid:text-sm peer-valid:text-green-500"
          >
            Email
          </label>
        </div>

        {/* Password */}
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder=" "
            required
            className="peer border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <label
            htmlFor="password"
            className="absolute left-3 top-3 text-gray-400 text-base transition-all
                       peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400
                       peer-focus:top-1 peer-focus:text-sm peer-focus:text-green-500
                       peer-valid:top-1 peer-valid:text-sm peer-valid:text-green-500"
          >
            Password
          </label>
          <span
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 text-gray-500 cursor-pointer text-sm select-none"
          >
            {showPassword ? "Hide" : "Show"}
          </span>
        </div>

        {/* Phone */}
        <div className="relative">
          <input
            type="text"
            id="phone"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            placeholder=" "
            className="peer border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <label
            htmlFor="phone"
            className="absolute left-3 top-3 text-gray-400 text-base transition-all
                       peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base
                       peer-focus:top-1 peer-focus:text-sm peer-focus:text-green-500"
          >
            Phone
          </label>
        </div>

        {/* Role */}
        <select
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
          className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
        >
          <option value="donor">Donor</option>
          <option value="receiver">Receiver</option>
          <option value="volunteer">Volunteer</option>
        </select>

        {/* Organization */}
        {(form.role === "donor" || form.role === "volunteer") && (
          <div className="relative">
            <input
              type="text"
              id="organization"
              value={form.organization}
              onChange={(e) => setForm({ ...form, organization: e.target.value })}
              placeholder=" "
              className="peer border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            <label
              htmlFor="organization"
              className="absolute left-3 top-3 text-gray-400 text-base transition-all
                         peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base
                         peer-focus:top-1 peer-focus:text-sm peer-focus:text-green-500"
            >
              Organization Name (Optional)
            </label>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          className="bg-green-500 text-white p-3 rounded-lg hover:bg-green-600 active:scale-95 transition transform"
        >
          Sign Up
        </button>

        {/* Redirect */}
        <p className="text-center text-gray-500 text-sm">
          Already have an account?{" "}
          <span
            className="text-blue-500 cursor-pointer hover:underline"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
      </form>
    </div>
  );
}
