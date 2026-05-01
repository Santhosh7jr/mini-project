import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const navLinkStyle = (path) =>
    `px-5 py-2 rounded-xl text-sm font-medium transition ${
      location.pathname === path
        ? "bg-[#1E293B]/60 text-white"
        : "text-[#B2C0D7] hover:text-white hover:bg-[#384B6B]"
    }`;

  return (
    <div
      className="w-full 
                    bg-gradient-to-r from-[#1E293B] to-[#0F172A]
                    border-b border-[#2A3A55]
                    px-6 py-3 
                    flex items-center justify-between"
    >
      {/* LEFT */}
      <div
        onClick={() => navigate("/")}
        className="flex items-center gap-2 cursor-pointer"
      >
        <div
          className="w-9 h-9 rounded-lg 
                        bg-gradient-to-br from-[#3B82F6] to-[#2563EB] 
                        flex items-center justify-center text-white font-bold"
        >
          K
        </div>

        <span className="text-[#EEF1F6] font-semibold text-lg">Karigo</span>
      </div>

      {/* CENTER LINKS */}
      <div className="flex items-center gap-2">
        <Link to="/" className={navLinkStyle("/")}>
          Home
        </Link>

        <Link to="/services" className={navLinkStyle("/services")}>
          Services
        </Link>

        <Link to="/workers" className={navLinkStyle("/workers")}>
          Find Workers
        </Link>

        <Link to="/bookings" className={navLinkStyle("/bookings")}>
          Bookings
        </Link>
      </div>

      {/* RIGHT PROFILE */}
      <div className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 px-5 py-2 rounded-full
                     bg-gradient-to-r from-[#3B82F6] to-[#2563EB]
                     text-white text-sm font-medium
                     shadow-md hover:shadow-lg
                     transition"
        >
          <span>👤</span>
          Profile
          <span className="text-xs">▾</span>
        </button>

        {open && (
          <div
            className="absolute right-0 mt-3 w-44 rounded-xl 
                          bg-[#1E293B] border border-[#2A3A55]
                          shadow-xl overflow-hidden"
          >
            <button
              onClick={() => navigate("/profile")}
              className="block w-full text-left px-4 py-2 hover:bg-[#5875A7]"
            >
              My Profile
            </button>

            <button
              onClick={() => navigate("/orders")}
              className="block w-full text-left px-4 py-2 hover:bg-[#5875A7]"
            >
              My Orders
            </button>

            <button className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/20">
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
