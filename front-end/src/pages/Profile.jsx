import { useEffect, useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = () => {
    localStorage.setItem("user", JSON.stringify(formData));
    setUser(formData);
    setEditing(false);
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await API.get("/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
        setFormData(res.data);
        setLoading(false);
      } catch {
        setError("Failed to load profile");
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="bg-[#28364D] min-h-screen flex items-center justify-center">
        <div className="text-[#EEF1F6] text-lg">Loading profile...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-[#28364D] min-h-screen flex items-center justify-center">
        <div className="text-[#EEF1F6]">Please log in to view your profile</div>
      </div>
    );
  }

  return (
    <div className="bg-[#28364D] min-h-screen px-6 py-16">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#EEF1F6]">My Profile</h1>
          <p className="text-[#B2C0D7] mt-2">Manage your account information</p>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="bg-[#384B6B] rounded-2xl border border-[#5875A7] p-8">
          <div className="flex justify-center mb-8">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#7A3FE0] to-[#5875A7] flex items-center justify-center text-[#EEF1F6] text-4xl font-bold shadow-lg">
              {user.name?.charAt(0).toUpperCase() || "U"}
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-[#B2C0D7] text-sm font-medium mb-2">
                Full Name
              </label>
              {editing ? (
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-[#28364D] border border-[#5875A7] text-[#EEF1F6] px-4 py-2 rounded-lg focus:outline-none focus:border-[#7A3FE0]"
                />
              ) : (
                <p className="text-[#EEF1F6] text-lg">{user.name}</p>
              )}
            </div>

            <div>
              <label className="block text-[#B2C0D7] text-sm font-medium mb-2">
                Email
              </label>
              <p className="text-[#EEF1F6] text-lg">{user.email}</p>
              <p className="text-[#B2C0D7] text-xs mt-1">
                Email cannot be changed
              </p>
            </div>

            <div>
              <label className="block text-[#B2C0D7] text-sm font-medium mb-2">
                Phone Number
              </label>
              {editing ? (
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone || ""}
                  onChange={handleChange}
                  placeholder="+1 (555) 000-0000"
                  className="w-full bg-[#28364D] border border-[#5875A7] text-[#EEF1F6] px-4 py-2 rounded-lg focus:outline-none focus:border-[#7A3FE0]"
                />
              ) : (
                <p className="text-[#EEF1F6] text-lg">
                  {user.phone || "Not provided"}
                </p>
              )}
            </div>

            <div>
              <label className="block text-[#B2C0D7] text-sm font-medium mb-2">
                Account Type
              </label>
              <p className="text-[#EEF1F6] text-lg capitalize">
                {user.role === "user" ? "🛍️ Customer" : "🛠️ Service Provider"}
              </p>
            </div>

            <div>
              <label className="block text-[#B2C0D7] text-sm font-medium mb-2">
                Member Since
              </label>
              <p className="text-[#EEF1F6] text-lg">
                {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="flex gap-4 mt-8 pt-8 border-t border-[#5875A7]">
            {!editing ? (
              <>
                <button
                  onClick={() => setEditing(true)}
                  className="flex-1 bg-gradient-to-r from-[#7A3FE0] to-[#5875A7] text-[#EEF1F6] py-3 rounded-lg font-semibold hover:shadow-lg transition"
                >
                  ✏️ Edit Profile
                </button>
                <button
                  onClick={() => navigate("/")}
                  className="flex-1 bg-[#486089] text-[#EEF1F6] py-3 rounded-lg font-semibold hover:bg-[#5875A7] transition"
                >
                  Go Back
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleSave}
                  className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
                >
                  ✓ Save Changes
                </button>
                <button
                  onClick={() => {
                    setEditing(false);
                    setFormData(user);
                  }}
                  className="flex-1 bg-[#486089] text-[#EEF1F6] py-3 rounded-lg font-semibold hover:bg-[#5875A7] transition"
                >
                  ✕ Cancel
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
