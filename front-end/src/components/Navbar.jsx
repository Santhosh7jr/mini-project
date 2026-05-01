import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  // Get user from localStorage (synchronously to avoid effect issues)
  const userData = localStorage.getItem("user");
  let user = null;
  if (userData) {
    try {
      user = JSON.parse(userData);
    } catch (e) {
      console.error("Error parsing user data:", e);
    }
  }

  const navLinkStyle = (path) =>
    `px-5 py-2 rounded-xl text-sm font-medium transition ${
      location.pathname === path
        ? "bg-[#5875A7] text-[#EEF1F6]"
        : "text-[#B2C0D7] hover:text-[#EEF1F6] hover:bg-[#486089]"
    }`;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (!user) {
    return (
      <div className="w-full bg-gradient-to-r from-[#28364D] to-[#384B6B] border-b border-[#5875A7] px-6 py-4 flex items-center justify-between sticky top-0 z-50 shadow-lg">
        <div
          onClick={() => navigate("/")}
          className="flex items-center gap-2 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#7A3FE0] to-[#5875A7] flex items-center justify-center text-white font-bold text-lg group-hover:shadow-lg transition">
            K
          </div>
          <span className="text-[#EEF1F6] font-bold text-xl">Karigo</span>
        </div>
        <div className="flex gap-2">
          <Link
            to="/login"
            className="px-4 py-2 text-[#B2C0D7] hover:text-[#EEF1F6]"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="px-4 py-2 bg-[#7A3FE0] text-[#EEF1F6] rounded-lg hover:shadow-lg"
          >
            Register
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-gradient-to-r from-[#28364D] to-[#384B6B] border-b border-[#5875A7] px-6 py-4 flex items-center justify-between sticky top-0 z-50 shadow-lg">
      {/* LEFT - LOGO */}
      <div
        onClick={() => navigate("/")}
        className="flex items-center gap-2 cursor-pointer group"
      >
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#7A3FE0] to-[#5875A7] flex items-center justify-center text-white font-bold text-lg group-hover:shadow-lg transition">
          K
        </div>
        <span className="text-[#EEF1F6] font-bold text-xl">Karigo</span>
      </div>

      {/* CENTER - NAVIGATION */}
      <div className="hidden md:flex items-center gap-1">
        <Link to="/" className={navLinkStyle("/")}>
          Home
        </Link>
        <Link to="/services" className={navLinkStyle("/services")}>
          Services
        </Link>
        <Link to="/workers" className={navLinkStyle("/workers")}>
          Find Workers
        </Link>
        {user.role === "user" && (
          <Link to="/bookings" className={navLinkStyle("/bookings")}>
            My Bookings
          </Link>
        )}
        {user.role === "worker" && (
          <Link to="/worker" className={navLinkStyle("/worker")}>
            Dashboard
          </Link>
        )}
      </div>

      {/* RIGHT - PROFILE DROPDOWN */}
      <div className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#7A3FE0] to-[#5875A7] text-[#EEF1F6] text-sm font-medium hover:shadow-lg transition"
        >
          <span>👤</span>
          {user.name?.split(" ")[0] || "Account"}
          <span className={`text-xs transition ${open ? "rotate-180" : ""}`}>
            ▾
          </span>
        </button>

        {open && (
          <div className="absolute right-0 mt-2 w-56 rounded-xl bg-[#384B6B] border border-[#5875A7] shadow-2xl overflow-hidden">
            {/* User Info */}
            <div className="px-4 py-3 border-b border-[#5875A7] bg-[#486089]">
              <p className="text-[#EEF1F6] font-semibold">{user.name}</p>
              <p className="text-[#B2C0D7] text-xs">{user.email}</p>
              <p className="text-[#7A3FE0] text-xs font-semibold mt-1 capitalize">
                {user.role === "user" ? "Customer" : "Service Provider"}
              </p>
            </div>

            {/* Menu Items */}
            <div className="py-2">
              <button
                onClick={() => {
                  navigate("/profile");
                  setOpen(false);
                }}
                className="block w-full text-left px-4 py-2 text-[#EEF1F6] hover:bg-[#5875A7] transition"
              >
                👤 My Profile
              </button>

              {user.role === "user" && (
                <button
                  onClick={() => {
                    navigate("/orders");
                    setOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-[#EEF1F6] hover:bg-[#5875A7] transition"
                >
                  📦 My Orders
                </button>
              )}

              {user.role === "worker" && (
                <button
                  onClick={() => {
                    navigate("/worker");
                    setOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-[#EEF1F6] hover:bg-[#5875A7] transition"
                >
                  📊 Dashboard
                </button>
              )}

              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-red-400 hover:bg-red-500/20 transition border-t border-[#5875A7] mt-2"
              >
                🚪 Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
