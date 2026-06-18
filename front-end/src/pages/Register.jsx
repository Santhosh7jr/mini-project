import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/axios";

const getPasswordStrengthError = (password) => {
  const strongPasswordPattern =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;

  if (!strongPasswordPattern.test(password)) {
    return "Password is too weak. Please use at least 8 characters with uppercase, lowercase, number, and special character.";
  }

  return "";
};

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    avatar_url: "",
    role: "user",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const passwordStrengthError = form.password
    ? getPasswordStrengthError(form.password)
    : "";

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

      const weakPasswordMessage = getPasswordStrengthError(form.password);

      if (weakPasswordMessage) {
        setError(weakPasswordMessage);
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
    <div className="bg-gradient-to-br from-[#E9E5DF] to-[#EAF4FD] min-h-screen flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-[#FFFFFF] rounded-2xl border border-[#D0D7DE] p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#191919] mb-2">
              Join Karigo
            </h1>
            <p className="text-[#666666]">Create your account today</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-[#FDE7E9] border border-[#D93025] text-[#B24020] px-4 py-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-[#666666] text-sm font-medium mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full bg-[#E9E5DF] border border-[#D0D7DE] text-[#191919] px-4 py-3 rounded-lg focus:outline-none focus:border-[#0A66C2] transition"
              />
            </div>

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

            {/* Phone */}
            <div>
              <label className="block text-[#666666] text-sm font-medium mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="+91 98765 43210"
                className="w-full bg-[#E9E5DF] border border-[#D0D7DE] text-[#191919] px-4 py-3 rounded-lg focus:outline-none focus:border-[#0A66C2] transition"
              />
            </div>

            {/* Profile Picture */}
            <div>
              <label className="block text-[#666666] text-sm font-medium mb-2">
                Profile Picture URL
              </label>
              <input
                type="url"
                name="avatar_url"
                value={form.avatar_url}
                onChange={handleChange}
                placeholder="https://example.com/photo.jpg"
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
              {passwordStrengthError && (
                <p className="mt-2 text-xs text-[#B24020]">
                  {passwordStrengthError}
                </p>
              )}
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-[#666666] text-sm font-medium mb-2">
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
                    className="accent-[#0A66C2]"
                  />
                  <span className="text-[#666666]">Customer</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="role"
                    value="worker"
                    checked={form.role === "worker"}
                    onChange={handleChange}
                    className="accent-[#0A66C2]"
                  />
                  <span className="text-[#666666]">Service Provider</span>
                </label>
              </div>

              <p className="text-xs text-[#666666] mt-2">
                Admin accounts are managed internally
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#0A66C2] to-[#004182] text-white py-3 rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-50 mt-6"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#D0D7DE]"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-[#FFFFFF] text-[#666666]">
                Already have an account?
              </span>
            </div>
          </div>

          {/* Login Link */}
          <p className="text-center text-[#666666] text-sm">
            <Link
              to="/login"
              className="text-[#0A66C2] hover:text-[#004182] font-semibold"
            >
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
