import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch {
    return null;
  }
};

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const [user, setUser] = useState(getStoredUser);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [avatarFailed, setAvatarFailed] = useState(false);

  const profileRef = useRef(null);

  const canAccessWorkerDashboard =
    user?.role === "worker" && !!user?.worker_is_approved;

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

  useEffect(() => {
    const syncUser = () => setUser(getStoredUser());

    window.addEventListener("storage", syncUser);
    window.addEventListener("user-updated", syncUser);

    return () => {
      window.removeEventListener("storage", syncUser);
      window.removeEventListener("user-updated", syncUser);
    };
  }, []);

  useEffect(() => {
    setAvatarFailed(false);
  }, [user?.avatar_url]);

  const navLink = (path) =>
    `px-4 py-2 rounded-lg text-sm font-medium transition ${
      location.pathname === path
        ? "bg-[#0A66C2] text-white"
        : "text-[#666666] hover:text-[#0A66C2] hover:bg-[#EAF4FD]"
    }`;

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    navigate("/login");
  };

  // 🔹 NOT LOGGED IN
  if (!user) {
    return (
      <div className="fixed top-0 left-0 right-0 z-50 bg-[#E9E5DF]/90 backdrop-blur-md border-b border-[#D0D7DE]/30 px-6 py-2 flex justify-between items-center shadow-lg">
        <div
          onClick={() => navigate("/")}
          className="text-[#191919] font-bold text-lg cursor-pointer"
        >
          Karigo
        </div>
        <div className="flex gap-4">
          <Link to="/login" className="text-[#666666] hover:text-[#0A66C2]">
            Login
          </Link>
          <Link to="/register" className="text-[#666666] hover:text-[#0A66C2]">
            Register
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* 🔥 NAVBAR */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-[#E9E5DF]/90 backdrop-blur-md border-b border-[#D0D7DE]/30 px-6 py-2 flex justify-between items-center shadow-lg">
        {/* LOGO */}
        <div
          onClick={() => navigate("/")}
          className="flex items-center gap-2 cursor-pointer"
        >
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#0A66C2] to-[#004182] flex items-center justify-center text-white font-bold">
            K
          </div>
          <span className="text-[#191919] font-bold text-lg">Karigo</span>
        </div>

        {/* DESKTOP NAV */}
        <div className="hidden md:flex gap-3">
          <Link to="/" className={navLink("/")}>
            Home
          </Link>
          <Link to="/services" className={navLink("/services")}>
            Services
          </Link>
          <Link to="/find-workers" className={navLink("/find-workers")}>
            Find
          </Link>

          {user.role === "user" && (
            <Link to="/orders" className={navLink("/orders")}>
              Orders
            </Link>
          )}

          {canAccessWorkerDashboard && (
            <Link to="/worker" className={navLink("/worker")}>
              Dashboard
            </Link>
          )}

          {user.role === "admin" && (
            <Link to="/admin" className={navLink("/admin")}>
              Admin
            </Link>
          )}
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-3">
          {/* MOBILE MENU */}
          <button
            onClick={() => setMobileOpen(true)}
            className="md:hidden text-xl text-[#191919]"
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
                bg-[#FFFFFF]
                border border-[#D0D7DE]/40
                hover:bg-[#EAF4FD]
                transition
              "
            >
              {user.avatar_url && !avatarFailed ? (
                <img
                  src={user.avatar_url}
                  alt={user.name}
                  className="w-8 h-8 rounded-full object-cover bg-[#0A66C2]"
                  onError={() => setAvatarFailed(true)}
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-[#0A66C2] flex items-center justify-center text-white text-sm font-semibold">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
              )}

              <span className="text-sm text-[#191919] hidden sm:block">
                {user.name?.split(" ")[0]}
              </span>
            </button>

            {/* DROPDOWN */}
            {profileOpen && (
              <div
                className="
                absolute right-0 mt-2 w-56
                bg-[#FFFFFF]
                border border-[#D0D7DE]/30
                rounded-xl shadow-lg overflow-hidden
                text-[#191919]
              "
              >
                <div className="px-4 py-3 border-b border-[#D0D7DE]/20">
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-[#666666] truncate">
                    {user.email}
                  </p>
                </div>

                <div className="flex flex-col text-sm">
                  <button
                    onClick={() => navigate("/profile")}
                    className="px-4 py-2 text-left hover:bg-[#EAF4FD]"
                  >
                    👤 Profile
                  </button>

                  {user.role === "user" && (
                    <>
                      <button
                        onClick={() => navigate("/favorites")}
                        className="px-4 py-2 text-left hover:bg-[#EAF4FD]"
                      >
                        ❤️ Favorites
                      </button>

                      <button
                        onClick={() => navigate("/orders")}
                        className="px-4 py-2 text-left hover:bg-[#EAF4FD]"
                      >
                        📦 Orders
                      </button>
                    </>
                  )}

                  {canAccessWorkerDashboard && (
                    <button
                      onClick={() => navigate("/worker")}
                      className="px-4 py-2 text-left hover:bg-[#EAF4FD]"
                    >
                      📊 Dashboard
                    </button>
                  )}

                  {user.role === "admin" && (
                    <button
                      onClick={() => navigate("/admin")}
                      className="px-4 py-2 text-left hover:bg-[#EAF4FD]"
                    >
                      🛡️ Admin Panel
                    </button>
                  )}

                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 text-left text-[#B24020] border-t border-[#D0D7DE]/20 hover:bg-[#FDE7E9]"
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

          <div className="w-64 bg-[#FFFFFF] p-6 border-l border-[#D0D7DE]/30">
            <div className="mb-6 text-[#191919] font-bold text-lg">Menu</div>

            <div className="flex flex-col gap-3 text-[#191919]">
              <Link to="/" onClick={() => setMobileOpen(false)}>
                Home
              </Link>
              <Link to="/services" onClick={() => setMobileOpen(false)}>
                Services
              </Link>
              <Link to="/find-workers" onClick={() => setMobileOpen(false)}>
                Find Workers
              </Link>

              {user.role === "user" && (
                <Link to="/orders" onClick={() => setMobileOpen(false)}>
                  Orders
                </Link>
              )}

              {canAccessWorkerDashboard && (
                <Link to="/worker" onClick={() => setMobileOpen(false)}>
                  Dashboard
                </Link>
              )}

              {user.role === "admin" && (
                <Link to="/admin" onClick={() => setMobileOpen(false)}>
                  Admin
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
