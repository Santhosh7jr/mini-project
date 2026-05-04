import { useEffect, useState } from "react";
import API from "../api/axios";

export default function WorkerDashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await API.get("/bookings/worker/my");
      setBookings(res.data);
    } catch (err) {
      setError("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.id) return;
    fetchBookings();
  }, []);

  const updateStatus = async (bookingId, status) => {
    setUpdatingId(bookingId);

    // 🔥 Optimistic update
    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId ? { ...b, status } : b
      )
    );

    try {
      await API.patch(`/bookings/${bookingId}`, { status });
    } catch (err) {
      console.log(err);
      fetchBookings(); // rollback
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusBadge = (status) => {
    const base = "px-3 py-1 rounded-full text-xs font-semibold";

    switch (status) {
      case "pending":
        return `${base} bg-yellow-500/20 text-yellow-400`;
      case "accepted":
        return `${base} bg-green-500/20 text-green-400`;
      case "completed":
        return `${base} bg-blue-500/20 text-blue-400`;
      case "rejected":
        return `${base} bg-red-500/20 text-red-400`;
      default:
        return base;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-white text-lg">
        ⏳ Loading dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center mt-20 text-red-400 text-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1e293b] to-[#0f172a] px-6 py-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-white">
            Worker Dashboard
          </h1>
          <p className="text-gray-400 mt-2">
            Manage and track your service bookings
          </p>
        </div>

        {/* Empty State */}
        {bookings.length === 0 ? (
          <div className="bg-[#1e293b] border border-gray-700 rounded-xl p-12 text-center">
            <p className="text-gray-400 text-lg">
              No bookings available yet 🚀
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-[#1e293b] border border-gray-700 rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300"
              >
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                  
                  {/* Left Section */}
                  <div>
                    <h2 className="text-lg font-semibold text-white">
                      👤 {booking.user_name}
                    </h2>
                    <p className="text-gray-400 text-sm mt-1">
                      📍 {booking.location}
                    </p>

                    <div className="mt-2">
                      <span className={getStatusBadge(booking.status)}>
                        {booking.status.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 flex-wrap">
                    {booking.status === "pending" && (
                      <>
                        <button
                          disabled={updatingId === booking.id}
                          onClick={() =>
                            updateStatus(booking.id, "accepted")
                          }
                          className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg font-semibold transition"
                        >
                          Accept
                        </button>
                        <button
                          disabled={updatingId === booking.id}
                          onClick={() =>
                            updateStatus(booking.id, "rejected")
                          }
                          className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg font-semibold transition"
                        >
                          Reject
                        </button>
                      </>
                    )}

                    {booking.status === "accepted" && (
                      <button
                        disabled={updatingId === booking.id}
                        onClick={() =>
                          updateStatus(booking.id, "completed")
                        }
                        className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg font-semibold transition"
                      >
                        Mark as Completed
                      </button>
                    )}

                    {booking.status === "completed" && (
                      <span className="text-blue-400 font-semibold">
                        🎉 Job Completed
                      </span>
                    )}

                    {booking.status === "rejected" && (
                      <span className="text-red-400 font-semibold">
                        ❌ Request Rejected
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}