import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const profileRef = useRef(null);

  const user = JSON.parse(localStorage.getItem("user"));

  // 🔥 CLOSE DROPDOWN ON OUTSIDE CLICK
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navLink = (path) =>
    `px-4 py-2 rounded-lg text-sm font-medium transition ${
      location.pathname === path
        ? "bg-[#5875A7] text-white"
        : "text-[#B2C0D7] hover:text-white hover:bg-[#486089]"
    }`;

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // 🔹 NOT LOGGED IN
  if (!user) {
    return (
      <div className="sticky top-0 z-50 bg-[#28364D] px-6 py-4 flex justify-between items-center border-b border-[#5875A7]/30">
        <div
          onClick={() => navigate("/")}
          className="text-white font-bold text-lg cursor-pointer"
        >
          Karigo
        </div>
        <div className="flex gap-4">
          <Link to="/login" className="text-[#B2C0D7] hover:text-white">
            Login
          </Link>
          <Link to="/register" className="text-[#B2C0D7] hover:text-white">
            Register
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* 🔥 NAVBAR */}
      <div className="sticky top-0 z-50 bg-[#28364D]/95 backdrop-blur-md border-b border-[#5875A7]/30 px-6 py-4 flex justify-between items-center">

        {/* LOGO */}
        <div
          onClick={() => navigate("/")}
          className="flex items-center gap-2 cursor-pointer"
        >
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#7A3FE0] to-[#5875A7] flex items-center justify-center text-white font-bold">
            K
          </div>
          <span className="text-[#EEF1F6] font-bold text-lg">
            Karigo
          </span>
        </div>

        {/* DESKTOP NAV */}
        <div className="hidden md:flex gap-3">

          <Link to="/" className={navLink("/")}>Home</Link>
          <Link to="/services" className={navLink("/services")}>Services</Link>
          <Link to="/find-workers" className={navLink("/find-workers")}>Find</Link>

          {user.role === "user" && (
            <Link to="/orders" className={navLink("/orders")}>Orders</Link>
          )}

          {user.role === "worker" && (
            <Link to="/worker" className={navLink("/worker")}>Dashboard</Link>
          )}

          {user.role === "admin" && (
            <Link to="/admin" className={navLink("/admin")}>Admin</Link>
          )}
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-3">

          {/* MOBILE MENU */}
          <button
            onClick={() => setMobileOpen(true)}
            className="md:hidden text-xl text-white"
          >
            ☰
          </button>

          {/* PROFILE */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="
                flex items-center gap-2
                px-3 py-2
                rounded-lg
                bg-[#384B6B]
                border border-[#5875A7]/40
                hover:bg-[#486089]
                transition
              "
            >
              <div className="w-8 h-8 rounded-full bg-[#7A3FE0] flex items-center justify-center text-white text-sm font-semibold">
                {user.name?.charAt(0).toUpperCase()}
              </div>

              <span className="text-sm text-[#EEF1F6] hidden sm:block">
                {user.name?.split(" ")[0]}
              </span>

              <span className="text-xs text-[#B2C0D7]">▼</span>
            </button>

            {/* DROPDOWN */}
            {profileOpen && (
              <div className="
                absolute right-0 mt-2 w-56
                bg-[#2E3B55]
                border border-[#5875A7]/30
                rounded-xl shadow-lg overflow-hidden
                text-[#EEF1F6]
              ">

                <div className="px-4 py-3 border-b border-[#5875A7]/20">
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-[#B2C0D7] truncate">
                    {user.email}
                  </p>
                </div>

                <div className="flex flex-col text-sm">

                  <button onClick={() => navigate("/profile")} className="px-4 py-2 text-left hover:bg-[#384B6B]">
                    👤 Profile
                  </button>

                  {user.role === "user" && (
                    <>
                      <button onClick={() => navigate("/favorites")} className="px-4 py-2 text-left hover:bg-[#384B6B]">
                        ❤️ Favorites
                      </button>

                      <button onClick={() => navigate("/orders")} className="px-4 py-2 text-left hover:bg-[#384B6B]">
                        📦 Orders
                      </button>
                    </>
                  )}

                  {user.role === "worker" && (
                    <button onClick={() => navigate("/worker")} className="px-4 py-2 text-left hover:bg-[#384B6B]">
                      📊 Dashboard
                    </button>
                  )}

                  {user.role === "admin" && (
                    <button onClick={() => navigate("/admin")} className="px-4 py-2 text-left hover:bg-[#384B6B]">
                      🛡️ Admin Panel
                    </button>
                  )}

                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 text-left text-red-400 border-t border-[#5875A7]/20 hover:bg-red-500/10"
                  >
                    🚪 Logout
                  </button>

                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 🔥 MOBILE SIDEBAR */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex">

          <div
            className="flex-1 bg-black/50"
            onClick={() => setMobileOpen(false)}
          />

          <div className="w-64 bg-[#384B6B] p-6 border-l border-[#5875A7]/30">

            <div className="mb-6 text-white font-bold text-lg">
              Menu
            </div>

            <div className="flex flex-col gap-3 text-[#EEF1F6]">

              <Link to="/" onClick={() => setMobileOpen(false)}>Home</Link>
              <Link to="/services" onClick={() => setMobileOpen(false)}>Services</Link>
              <Link to="/find-workers" onClick={() => setMobileOpen(false)}>Find Workers</Link>

              {user.role === "user" && (
                <Link to="/orders" onClick={() => setMobileOpen(false)}>Orders</Link>
              )}

              {user.role === "worker" && (
                <Link to="/worker" onClick={() => setMobileOpen(false)}>Dashboard</Link>
              )}

              {user.role === "admin" && (
                <Link to="/admin" onClick={() => setMobileOpen(false)}>Admin</Link>
              )}

            </div>
          </div>
        </div>
      )}
    </>
  );
}