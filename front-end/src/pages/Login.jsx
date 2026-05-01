import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/axios";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
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

      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-[#28364D] to-[#384B6B] min-h-screen flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-[#384B6B] rounded-2xl border border-[#5875A7] p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#EEF1F6] mb-2">Karigo</h1>
            <p className="text-[#B2C0D7]">Welcome back to the platform</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-[#B2C0D7] text-sm font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full bg-[#28364D] border border-[#5875A7] text-[#EEF1F6] px-4 py-3 rounded-lg focus:outline-none focus:border-[#7A3FE0] transition"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-[#B2C0D7] text-sm font-medium mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full bg-[#28364D] border border-[#5875A7] text-[#EEF1F6] px-4 py-3 rounded-lg focus:outline-none focus:border-[#7A3FE0] transition"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#5875A7] to-[#7A3FE0] text-[#EEF1F6] py-3 rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#5875A7]"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-[#384B6B] text-[#B2C0D7]">
                New to Karigo?
              </span>
            </div>
          </div>

          {/* Register Link */}
          <p className="text-center text-[#B2C0D7] text-sm">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-[#7A3FE0] hover:text-[#9D5BFF] font-semibold"
            >
              Register here
            </Link>
          </p>

          {/* Demo Credentials */}
          <div className="mt-6 pt-6 border-t border-[#5875A7]">
            <p className="text-[#B2C0D7] text-xs mb-2">Demo credentials:</p>
            <p className="text-[#B2C0D7] text-xs">Email: demo@karigo.com</p>
            <p className="text-[#B2C0D7] text-xs">Password: demo123</p>
          </div>
        </div>
      </div>
    </div>
  );
}
