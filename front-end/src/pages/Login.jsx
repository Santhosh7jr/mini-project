import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/axios";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (!form.email || !form.password) {
        setError("Please fill in all fields");
        setLoading(false);
        return;
      }

      const res = await API.post("/auth/login", form);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      const role = res.data.user.role;
      const isApprovedWorker = !!res.data.user.worker_is_approved;

      if (role === "admin") navigate("/admin");
      else if (role === "worker" && isApprovedWorker) navigate("/worker");
      else navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-[#E9E5DF] to-[#EAF4FD] min-h-screen flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-[#FFFFFF] rounded-2xl border border-[#D0D7DE] p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#191919] mb-2">Karigo</h1>
            <p className="text-[#666666]">Welcome back to the platform</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-[#FDE7E9] border border-[#D93025] text-[#B24020] px-4 py-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-[#666666] text-sm font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full bg-[#E9E5DF] border border-[#D0D7DE] text-[#191919] px-4 py-3 rounded-lg focus:outline-none focus:border-[#0A66C2] transition"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-[#666666] text-sm font-medium mb-2">
                Password
              </label>
              <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full bg-[#E9E5DF] border border-[#D0D7DE] text-[#191919] px-4 py-3 pr-12 rounded-lg focus:outline-none focus:border-[#0A66C2] transition"
              />
                <button
                  type="button"
                  onClick={() => setShowPassword((visible) => !visible)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#666666] hover:text-[#0A66C2] transition"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                    aria-hidden="true"
                  >
                    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
                    <circle cx="12" cy="12" r="3" />
                    {showPassword && <path d="m3 3 18 18" />}
                  </svg>
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#0A66C2] to-[#004182] text-white py-3 rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#D0D7DE]"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-[#FFFFFF] text-[#666666]">
                New to Karigo?
              </span>
            </div>
          </div>

          {/* Register Link */}
          <p className="text-center text-[#666666] text-sm">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-[#0A66C2] hover:text-[#004182] font-semibold"
            >
              Register here
            </Link>
          </p>

          {/* Demo Credentials */}
          <div className="mt-6 pt-6 border-t border-[#D0D7DE]">
            <p className="text-[#666666] text-xs mb-2">Demo credentials:</p>
            <p className="text-[#666666] text-xs">Email: demo@karigo.com</p>
            <p className="text-[#666666] text-xs">Password: demo123</p>
          </div>
        </div>
      </div>
    </div>
  );
}
