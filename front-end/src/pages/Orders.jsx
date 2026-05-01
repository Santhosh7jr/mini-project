import { useEffect, useState } from "react";
import API from "../api/axios";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-500/20 text-green-300";
      case "accepted":
        return "bg-blue-500/20 text-blue-300";
      case "pending":
        return "bg-yellow-500/20 text-yellow-300";
      case "rejected":
        return "bg-red-500/20 text-red-300";
      default:
        return "bg-gray-500/20 text-gray-300";
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const token = localStorage.getItem("token");

        if (!user || !token) {
          setError("Please log in");
          setLoading(false);
          return;
        }

        const res = await API.get(`/bookings/user/${user.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(res.data || []);
      } catch (err) {
        console.log(err);
        setError("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="bg-[#28364D] min-h-screen px-6 py-16 flex items-center justify-center">
        <div className="text-[#EEF1F6]">Loading your orders...</div>
      </div>
    );
  }

  return (
    <div className="bg-[#28364D] min-h-screen px-6 py-16">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-[#EEF1F6]">
            My Orders
          </h1>
          <p className="text-[#B2C0D7] mt-2">
            Track and manage your service bookings
          </p>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Orders List */}
        {orders.length === 0 ? (
          <div className="bg-[#384B6B] rounded-2xl border border-[#5875A7] p-12 text-center">
            <p className="text-[#B2C0D7] text-lg mb-4">No orders yet</p>
            <p className="text-[#B2C0D7] text-sm mb-6">
              Start booking services to see them here
            </p>
            <a
              href="/services"
              className="inline-block bg-[#7A3FE0] text-[#EEF1F6] px-6 py-2 rounded-lg hover:shadow-lg transition"
            >
              Browse Services
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-[#384B6B] rounded-xl border border-[#5875A7] p-6 hover:border-[#7A3FE0] transition"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  {/* Order Info */}
                  <div className="flex-1">
                    <h3 className="text-[#EEF1F6] font-semibold text-lg mb-2">
                      {order.service_name || "Service"}
                    </h3>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-[#B2C0D7]">Worker</p>
                        <p className="text-[#EEF1F6] font-medium">
                          {order.worker_name || "N/A"}
                        </p>
                      </div>

                      <div>
                        <p className="text-[#B2C0D7]">Date</p>
                        <p className="text-[#EEF1F6] font-medium">
                          {order.booking_date
                            ? new Date(order.booking_date).toLocaleDateString()
                            : "Not set"}
                        </p>
                      </div>

                      <div>
                        <p className="text-[#B2C0D7]">Price</p>
                        <p className="text-[#EEF1F6] font-medium">
                          ₹{order.price || order.worker_price || "N/A"}
                        </p>
                      </div>

                      <div>
                        <p className="text-[#B2C0D7]">Status</p>
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusColor(order.status)}`}
                        >
                          {order.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 flex-col md:flex-row">
                    {order.status === "pending" && (
                      <button className="px-4 py-2 bg-yellow-600 text-white rounded-lg text-sm hover:bg-yellow-700 transition">
                        Pending
                      </button>
                    )}
                    {order.status === "accepted" && (
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition">
                        Confirmed
                      </button>
                    )}
                    {order.status === "completed" && (
                      <button className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition">
                        ✓ Complete
                      </button>
                    )}
                    <button className="px-4 py-2 bg-[#5875A7] text-[#EEF1F6] rounded-lg text-sm hover:bg-[#7A3FE0] transition">
                      View Details
                    </button>
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
