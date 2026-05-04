import { useEffect, useState } from "react";
import API from "../api/axios";

export default function Bookings() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    // ✅ Safety check
    if (!user || !user.id) {
      console.log("User not ready yet");
      return;
    }

    fetchBookings(user.id);
  }, []);

  // ✅ Fetch bookings
  const fetchBookings = async (userId) => {
    try {
      console.log("Fetching bookings for user:", userId);

      const res = await API.get("/bookings/user/" + userId);
      console.log("Bookings:", res.data);

      setBookings(res.data);
    } catch (err) {
      console.log("Error fetching bookings:", err);
    }
  };

  return (
    <div className="bg-[#28364D] min-h-screen px-6 py-16">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-[#EEF1F6]">
            My Bookings
          </h1>
          <p className="text-[#B2C0D7] mt-2">
            Track and manage all your service bookings
          </p>
        </div>

        {/* Bookings List */}
        {bookings.length === 0 ? (
          <div className="bg-[#384B6B] rounded-2xl border border-[#5875A7] p-12 text-center">
            <p className="text-[#B2C0D7] text-lg mb-4">No bookings yet</p>
            <p className="text-[#B2C0D7] text-sm mb-6">
              Start booking services to see them here
            </p>
            <a
              href="/find-workers"
              className="inline-block bg-[#7A3FE0] text-[#EEF1F6] px-6 py-2 rounded-lg hover:shadow-lg transition"
            >
              Browse Services
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-[#384B6B] rounded-xl border border-[#5875A7] p-6 hover:border-[#7A3FE0] transition"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  {/* Booking Info */}
                  <div className="flex-1">
                    <h2 className="text-lg font-semibold text-[#EEF1F6]">
                      👷 {booking.worker_name || "Unknown"}
                    </h2>
                    <p className="text-[#B2C0D7] text-sm mt-1">
                      📍 {booking.location}
                    </p>
                  </div>

                  {/* Status Badge */}
                  <div className="flex items-center gap-3">
                    <span className="text-[#B2C0D7] text-sm">Status:</span>
                    <span
                      className={`px-4 py-2 rounded-full text-sm font-semibold ${
                        booking.status === "pending"
                          ? "bg-yellow-500/20 text-yellow-300"
                          : booking.status === "accepted"
                            ? "bg-blue-500/20 text-blue-300"
                            : booking.status === "completed"
                              ? "bg-green-500/20 text-green-300"
                              : "bg-red-500/20 text-red-300"
                      }`}
                    >
                      {booking.status.charAt(0).toUpperCase() +
                        booking.status.slice(1)}
                    </span>
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
