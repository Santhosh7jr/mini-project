import { useEffect, useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({});
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [avatarFailed, setAvatarFailed] = useState(false);

  const navigate = useNavigate();

  const getWorkerRequestTone = (status) => {
    if (status === "approved") {
      return {
        badge: "bg-[#E6F4EA] text-[#057642] border-[#B6E2C5]",
        title: "Approved",
        message: "Your worker access is active. You can open the worker dashboard.",
      };
    }

    if (status === "rejected") {
      return {
        badge: "bg-[#FDE7E9] text-[#B24020] border-[#F4B8B2]",
        title: "Rejected",
        message:
          "Your worker request was rejected by admin. You can continue using the app as a customer.",
      };
    }

    return {
      badge: "bg-[#FFF4CE] text-[#915907] border-[#E9D08A]",
      title: "Pending Approval",
      message:
        "Your worker request has been sent to admin. You will get worker access after approval.",
    };
  };

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
          avatar_url: formData.avatar_url || null,
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
        ...JSON.parse(localStorage.getItem("user") || "{}"),
        ...res.data,
      };

      localStorage.setItem("user", JSON.stringify(updatedUser));
      window.dispatchEvent(new Event("user-updated"));
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
          localStorage.setItem("user", JSON.stringify(res.data));
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

  useEffect(() => {
    setAvatarFailed(false);
  }, [user?.avatar_url]);

  if (loading) {
    return (
      <div className="bg-[#E9E5DF] min-h-screen flex items-center justify-center text-[#191919]">
        Loading...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-[#E9E5DF] min-h-screen flex items-center justify-center text-[#191919]">
        Please login
      </div>
    );
  }

  return (
    <div className="bg-[#E9E5DF] min-h-screen px-6 py-12">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* 🔥 PROFILE HEADER */}
        <div className="bg-gradient-to-r from-[#0A66C2] to-[#004182] rounded-2xl p-6 flex flex-col md:flex-row items-center gap-6">
          {/* Avatar */}
          {user.avatar_url && !avatarFailed ? (
            <img
              src={user.avatar_url}
              alt={user.name}
              className="w-24 h-24 rounded-full object-cover bg-[#0A66C2] shadow-lg border border-[#D0D7DE]"
              onError={() => setAvatarFailed(true)}
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-[#0A66C2] flex items-center justify-center text-white text-3xl font-bold shadow-lg">
              {user.name?.charAt(0).toUpperCase()}
            </div>
          )}

          {/* Info */}
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-2xl font-semibold text-white">
              {user.name}
            </h2>
            <p className="text-[#EAF4FD]">{user.email}</p>

            <div className="mt-2 text-sm text-[#EAF4FD]">
              {user.role === "user" ? "🛍️ Customer" : "🛠️ Worker"}
            </div>
            {user.role === "worker" && (
              <div
                className={`inline-flex mt-3 items-center gap-2 px-3 py-1 rounded-full text-xs border ${
                  getWorkerRequestTone(user.worker_request_status).badge
                }`}
              >
                <span>Worker Request</span>
                <span className="uppercase tracking-wide">
                  {user.worker_request_status || "pending"}
                </span>
              </div>
            )}
          </div>

          {/* Action */}
          <button
            onClick={() => setEditing(!editing)}
            className="bg-[#0A66C2] px-5 py-2 rounded-lg text-white hover:bg-[#004182] transition"
          >
            {editing ? "Cancel" : "Edit"}
          </button>
        </div>

        {user.role === "worker" && (
          <div className="relative overflow-hidden bg-[#FFFFFF] border border-[#D0D7DE] rounded-2xl p-6">
            <div className="absolute -top-16 -right-16 h-40 w-40 rounded-full bg-[#0A66C2]/20 blur-2xl" />
            <div className="relative">
              <p className="text-xs uppercase tracking-[0.2em] text-[#666666] mb-2">
                Worker Verification
              </p>
              <h3 className="text-2xl font-semibold text-[#191919] mb-2">
                {getWorkerRequestTone(user.worker_request_status).title}
              </h3>
              <p className="text-[#666666] max-w-2xl">
                {getWorkerRequestTone(user.worker_request_status).message}
              </p>
            </div>
          </div>
        )}

        {/* 🔥 ACCOUNT DETAILS */}
        <div className="bg-[#FFFFFF] rounded-2xl p-6 border border-[#D0D7DE]">
          <h3 className="text-lg font-semibold text-[#191919] mb-6">
            Account Details
          </h3>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Name */}
            <div>
              <label className="text-[#666666] text-sm">Full Name</label>
              {editing ? (
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full mt-1 bg-[#E9E5DF] border border-[#D0D7DE] p-2 rounded-lg text-[#191919]"
                />
              ) : (
                <p className="text-[#191919] mt-1">{user.name}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="text-[#666666] text-sm">Phone</label>
              {editing ? (
                <input
                  name="phone"
                  value={formData.phone || ""}
                  onChange={handleChange}
                  className="w-full mt-1 bg-[#E9E5DF] border border-[#D0D7DE] p-2 rounded-lg text-[#191919]"
                />
              ) : (
                <p className="text-[#191919] mt-1">
                  {user.phone || "Not provided"}
                </p>
              )}
            </div>

            {/* Profile Picture */}
            <div>
              <label className="text-[#666666] text-sm">
                Profile Picture URL
              </label>
              {editing ? (
                <input
                  name="avatar_url"
                  type="url"
                  value={formData.avatar_url || ""}
                  onChange={handleChange}
                  placeholder="https://example.com/photo.jpg"
                  className="w-full mt-1 bg-[#E9E5DF] border border-[#D0D7DE] p-2 rounded-lg text-[#191919]"
                />
              ) : (
                <p className="text-[#191919] mt-1 break-all">
                  {user.avatar_url || "Not provided"}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="text-[#666666] text-sm">Email</label>
              <p className="text-[#191919] mt-1">{user.email}</p>
            </div>

            {/* Member */}
            <div>
              <label className="text-[#666666] text-sm">Member Since</label>
              <p className="text-[#191919] mt-1">
                {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          {editing && (
            <div className="flex gap-4 mt-6">
              <button
                onClick={handleSave}
                className="flex-1 bg-[#057642] py-2 rounded-lg text-white hover:bg-[#004B1C]"
              >
                Save Changes
              </button>

              <button
                onClick={() => setEditing(false)}
                className="flex-1 bg-[#EAF4FD] py-2 rounded-lg text-[#0A66C2]"
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
            className="bg-[#FFFFFF] p-5 rounded-xl border border-[#D0D7DE] hover:bg-[#EAF4FD] cursor-pointer"
          >
            <h4 className="text-[#191919] font-semibold">📦 Orders</h4>
            <p className="text-[#666666] text-sm">View your bookings</p>
          </div>

          <div className="bg-[#FFFFFF] p-5 rounded-xl border border-[#D0D7DE] hover:bg-[#EAF4FD] cursor-pointer">
            <h4
              onClick={() => navigate("/favorites")}
              className="text-[#191919] font-semibold"
            >
              ❤️ Favorites
            </h4>
            <p className="text-[#666666] text-sm">Saved workers</p>
          </div>

          <div className="bg-[#FFFFFF] p-5 rounded-xl border border-[#D0D7DE] hover:bg-[#EAF4FD] cursor-pointer">
            <h4
              onClick={() => alert("Settings coming soon")}
              className="text-[#191919] font-semibold"
            >
              ⚙️ Settings
            </h4>
            <p className="text-[#666666] text-sm">Manage account</p>
          </div>
        </div>
      </div>
    </div>
  );
}
