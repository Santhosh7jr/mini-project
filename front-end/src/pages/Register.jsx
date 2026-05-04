import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/axios";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "user",
  });
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
      if (!form.name || !form.email || !form.password) {
        setError("Please fill in all required fields");
        setLoading(false);
        return;
      }

      const res = await API.post("/auth/register", form);

      // Automatically log in after registration
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
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
            <h1 className="text-3xl font-bold text-[#EEF1F6] mb-2">
              Join Karigo
            </h1>
            <p className="text-[#B2C0D7]">Create your account today</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-[#B2C0D7] text-sm font-medium mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full bg-[#28364D] border border-[#5875A7] text-[#EEF1F6] px-4 py-3 rounded-lg focus:outline-none focus:border-[#7A3FE0] transition"
              />
            </div>

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

            {/* Phone */}
            <div>
              <label className="block text-[#B2C0D7] text-sm font-medium mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="+1 (555) 000-0000"
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

            {/* Role Selection */}
            <div>
              <label className="block text-[#B2C0D7] text-sm font-medium mb-2">
                Account Type
              </label>

              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="role"
                    value="user"
                    checked={form.role === "user"}
                    onChange={handleChange}
                    className="accent-[#7A3FE0]"
                  />
                  <span className="text-[#B2C0D7]">Customer</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="role"
                    value="worker"
                    checked={form.role === "worker"}
                    onChange={handleChange}
                    className="accent-[#7A3FE0]"
                  />
                  <span className="text-[#B2C0D7]">Service Provider</span>
                </label>
              </div>

              <p className="text-xs text-[#B2C0D7] mt-2">
                Admin accounts are managed internally
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#5875A7] to-[#7A3FE0] text-[#EEF1F6] py-3 rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-50 mt-6"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#5875A7]"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-[#384B6B] text-[#B2C0D7]">
                Already have an account?
              </span>
            </div>
          </div>

          {/* Login Link */}
          <p className="text-center text-[#B2C0D7] text-sm">
            <Link
              to="/login"
              className="text-[#7A3FE0] hover:text-[#9D5BFF] font-semibold"
            >
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
