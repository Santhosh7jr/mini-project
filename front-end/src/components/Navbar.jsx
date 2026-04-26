import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  if (!user) return null;

  return (
    <div className="bg-gray-800 text-white p-4 flex justify-between">
      <h1 className="font-bold">Karigo</h1>

      <div className="space-x-4">
        <Link to="/">Home</Link>

        {user.role === "user" && <Link to="/bookings">Bookings</Link>}
        {user.role === "worker" && <Link to="/worker">Dashboard</Link>}
        {user.role === "admin" && <Link to="/admin">Admin</Link>}

        <button onClick={logout} className="bg-red-500 px-2 py-1">
          Logout
        </button>
      </div>
    </div>
  );
}