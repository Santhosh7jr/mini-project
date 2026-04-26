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

      console.log(userId);
      const res = await API.get(`/bookings/user/${userId}`);
      console.log("Bookings:", res.data);

      setBookings(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">My Bookings</h1>

      {bookings.length === 0 ? (
        <p>No bookings yet</p>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div key={booking.id} className="border p-4 rounded shadow">
              <h2 className="text-lg font-semibold">
                Worker: {booking.worker_name || "Unknown"}
              </h2>

              <p>Location: {booking.location}</p>

              <p>
                Status:{" "}
                <span
                  className={
                    booking.status === "pending"
                      ? "text-yellow-500"
                      : booking.status === "accepted"
                        ? "text-blue-500"
                        : booking.status === "completed"
                          ? "text-green-600"
                          : "text-red-500"
                  }
                >
                  {booking.status}
                </span>
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
