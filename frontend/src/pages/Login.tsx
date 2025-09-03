import { useState} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

export default function Login() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: "", password: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    // Redirect if already logged in
    /*useEffect(() => {
        const token = localStorage.getItem("auth_token");
        const role = localStorage.getItem("user_role");
        if (token && role) {
            redirectUser(role);
        }
    }, [navigate]);*/

    // Handle login
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await axios.post(
                "http://127.0.0.1:8001/api/login",
                form,
                { headers: { "Content-Type": "application/json" } }
            );

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

    // Helper: redirect based on role
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
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-300 to-blue-300">
            <Toaster position="top-center" />
            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md flex flex-col gap-6"
            >
                <h1 className="text-3xl font-bold text-center text-gray-700">Login</h1>

                {/* Email Field */}
                <div className="relative">
                    <input
                        type="email"
                        id="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        required
                        placeholder=" "
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

                {/* Password Field */}
                <div className="relative">
                    <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                        required
                        placeholder=" "
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

                {/* Remember Me */}
                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        id="rememberMe"
                        checked={rememberMe}
                        onChange={() => setRememberMe(!rememberMe)}
                        className="h-4 w-4 accent-green-500"
                    />
                    <label htmlFor="rememberMe" className="text-gray-600 text-sm">
                        Remember Me
                    </label>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="bg-green-500 text-white p-3 rounded-lg hover:bg-green-600 active:scale-95 transition transform"
                >
                    Login
                </button>

                {/* Redirect to Signup */}
                <p className="text-center text-gray-500 text-sm">
                    Don&apos;t have an account?{" "}
                    <span
                        className="text-blue-500 cursor-pointer hover:underline"
                        onClick={() => navigate("/signup")}
                    >
                        Sign Up
                    </span>
                </p>
            </form>
        </div>
    );
}
