import { useEffect, useState } from "react";
import API from "../api/axios";

export default function WorkerDashboard() {

  const [bookings, setBookings] = useState([]);

  const fetchBookings = async (workerId) => {
      try {
        const res = await API.get(`/bookings/worker/${workerId}`);
        setBookings(res.data);
      } catch (err) {
        console.log(err);
      }
    };

  useEffect(() => {

    const user = JSON.parse(localStorage.getItem("user"));

    if (!user || !user.id) return;

    fetchBookings(user.id);

  }, []);

  const updateStatus = async (bookingId, status) => {
      try {
        await API.patch(`/bookings/${bookingId}`, {status});
        fetchBookings(JSON.parse(localStorage.getItem("user")).id);
      } catch (err) {
        console.log(err);
      }
    };

    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Worker Dashboard</h1>

        {
          bookings.length === 0 ? (
            <p>No bookings assigned</p>
          ) : (
            <div className="space-y-4">
          {bookings.map((booking) => (
            <div key={booking.id} className="border p-4 rounded shadow">
              <h2 className="font-semibold">
                Customer: {booking.user_name}
              </h2>

              <p>Location: {booking.location}</p>
              <p>Status: {booking.status}</p>

              <div className="mt-2 space-x-2">
                <button
                  onClick={() => updateStatus(booking.id, "accepted")}
                  className="bg-green-500 text-white px-3 py-1"
                >
                  Accept
                </button>

                <button
                  onClick={() => updateStatus(booking.id, "rejected")}
                  className="bg-red-500 text-white px-3 py-1"
                >
                  Reject
                </button>

                <button
                  onClick={() => updateStatus(booking.id, "completed")}
                  className="bg-blue-500 text-white px-3 py-1"
                >
                  Complete
                </button>
              </div>
            </div>
          ))}
        </div>
          )
        }
      </div>
    );

}