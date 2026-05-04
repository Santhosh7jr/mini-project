import { useEffect, useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({});
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await API.put(
        "/auth/update",
        {
          name: formData.name,
          phone: formData.phone,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      // update UI
      setUser(res.data);
      setEditing(false);

      // update localStorage (VERY IMPORTANT)
      const updatedUser = {
        ...JSON.parse(localStorage.getItem("user")),
        ...res.data,
      };

      localStorage.setItem("user", JSON.stringify(updatedUser));
    } catch (err) {
      console.log(err);
      alert("Update failed");
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const localUser = localStorage.getItem("user");

        if (!token || !localUser) {
          setLoading(false);
          return;
        }

        try {
          const res = await API.get("/auth/me", {
            headers: { Authorization: `Bearer ${token}` },
          });

          setUser(res.data);
          setFormData(res.data);
        } catch {
          const fallback = JSON.parse(localUser);
          setUser(fallback);
          setFormData(fallback);
        }

        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="bg-[#28364D] min-h-screen flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-[#28364D] min-h-screen flex items-center justify-center text-white">
        Please login
      </div>
    );
  }

  return (
    <div className="bg-[#28364D] min-h-screen px-6 py-12">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* 🔥 PROFILE HEADER */}
        <div className="bg-gradient-to-r from-[#384B6B] to-[#486089] rounded-2xl p-6 flex flex-col md:flex-row items-center gap-6">
          {/* Avatar */}
          <div className="w-24 h-24 rounded-full bg-[#7A3FE0] flex items-center justify-center text-white text-3xl font-bold shadow-lg">
            {user.name?.charAt(0).toUpperCase()}
          </div>

          {/* Info */}
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-2xl font-semibold text-[#EEF1F6]">
              {user.name}
            </h2>
            <p className="text-[#B2C0D7]">{user.email}</p>

            <div className="mt-2 text-sm text-[#B2C0D7]">
              {user.role === "user" ? "🛍️ Customer" : "🛠️ Worker"}
            </div>
          </div>

          {/* Action */}
          <button
            onClick={() => setEditing(!editing)}
            className="bg-[#7A3FE0] px-5 py-2 rounded-lg text-white hover:bg-[#9D5BFF] transition"
          >
            {editing ? "Cancel" : "Edit"}
          </button>
        </div>

        {/* 🔥 ACCOUNT DETAILS */}
        <div className="bg-[#384B6B] rounded-2xl p-6 border border-[#5875A7]">
          <h3 className="text-lg font-semibold text-white mb-6">
            Account Details
          </h3>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Name */}
            <div>
              <label className="text-[#B2C0D7] text-sm">Full Name</label>
              {editing ? (
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full mt-1 bg-[#28364D] border border-[#5875A7] p-2 rounded-lg text-white"
                />
              ) : (
                <p className="text-white mt-1">{user.name}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="text-[#B2C0D7] text-sm">Phone</label>
              {editing ? (
                <input
                  name="phone"
                  value={formData.phone || ""}
                  onChange={handleChange}
                  className="w-full mt-1 bg-[#28364D] border border-[#5875A7] p-2 rounded-lg text-white"
                />
              ) : (
                <p className="text-white mt-1">
                  {user.phone || "Not provided"}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="text-[#B2C0D7] text-sm">Email</label>
              <p className="text-white mt-1">{user.email}</p>
            </div>

            {/* Member */}
            <div>
              <label className="text-[#B2C0D7] text-sm">Member Since</label>
              <p className="text-white mt-1">
                {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          {editing && (
            <div className="flex gap-4 mt-6">
              <button
                onClick={handleSave}
                className="flex-1 bg-green-600 py-2 rounded-lg text-white hover:bg-green-700"
              >
                Save Changes
              </button>

              <button
                onClick={() => setEditing(false)}
                className="flex-1 bg-[#486089] py-2 rounded-lg text-white"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        {/* 🔥 QUICK ACTIONS */}
        <div className="grid md:grid-cols-3 gap-6">
          <div
            onClick={() => navigate("/orders")}
            className="bg-[#384B6B] p-5 rounded-xl border border-[#5875A7] hover:bg-[#486089] cursor-pointer"
          >
            <h4 className="text-white font-semibold">📦 Orders</h4>
            <p className="text-[#B2C0D7] text-sm">View your bookings</p>
          </div>

          <div className="bg-[#384B6B] p-5 rounded-xl border border-[#5875A7] hover:bg-[#486089] cursor-pointer">
            <h4
              onClick={() => navigate("/favorites")}
              className="text-white font-semibold"
            >
              ❤️ Favorites
            </h4>
            <p className="text-[#B2C0D7] text-sm">Saved workers</p>
          </div>

          <div className="bg-[#384B6B] p-5 rounded-xl border border-[#5875A7] hover:bg-[#486089] cursor-pointer">
            <h4
              onClick={() => alert("Settings coming soon")}
              className="text-white font-semibold"
            >
              ⚙️ Settings
            </h4>
            <p className="text-[#B2C0D7] text-sm">Manage account</p>
          </div>
        </div>
      </div>
    </div>
  );
}
