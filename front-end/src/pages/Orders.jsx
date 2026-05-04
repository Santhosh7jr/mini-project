import { useEffect, useState } from "react";
import API from "../api/axios";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [previousStatuses, setPreviousStatuses] = useState({});

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
    const userData = localStorage.getItem("user");

    if (!userData) {
      console.log("No user in localStorage");
      setLoading(false);
      return;
    }

    const parsedUser = JSON.parse(userData);

    console.log("Parsed user:", parsedUser); // 🔍 DEBUG

    if (!parsedUser || !parsedUser.id) {
      console.log("User ID missing ❌");
      setLoading(false);
      return;
    }

    fetchOrders(parsedUser.id);
  }, []);

  const fetchOrders = async (userId) => {
    if (!userId) {
      console.log("Invalid userId ❌");
      setLoading(false);
      return;
    }

    try {
      const res = await API.get(`/bookings/user/${userId}`);
      setOrders(res.data || []);
      setLoading(false);
    } catch (err) {
      console.log("Orders error:", err);
      setError("Failed to load orders");
      setLoading(false);
    }
  };

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
            <p className="text-[#B2C0D7] text-sm">
              Once you book a service, it will appear here
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
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="px-4 py-2 bg-[#5875A7] text-[#EEF1F6] rounded-lg text-sm hover:bg-[#7A3FE0] transition"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Details Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-[#384B6B] rounded-2xl border border-[#5875A7] p-8 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
              {/* Close Button */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-[#EEF1F6]">
                  Booking Details
                </h2>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-[#B2C0D7] hover:text-[#EEF1F6] text-2xl"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-6">
                {/* Service Info */}
                <div className="bg-[#28364D] rounded-lg p-4 border border-[#486089]">
                  <h3 className="text-[#7A3FE0] font-semibold text-sm uppercase tracking-wide mb-3">
                    Service Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[#B2C0D7] text-xs">Service</p>
                      <p className="text-[#EEF1F6] font-medium">
                        {selectedOrder.service_name || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-[#B2C0D7] text-xs">Booking ID</p>
                      <p className="text-[#EEF1F6] font-medium">
                        #{selectedOrder.id}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Worker Info */}
                <div className="bg-[#28364D] rounded-lg p-4 border border-[#486089]">
                  <h3 className="text-[#7A3FE0] font-semibold text-sm uppercase tracking-wide mb-3">
                    Worker Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[#B2C0D7] text-xs">Name</p>
                      <p className="text-[#EEF1F6] font-medium">
                        {selectedOrder.worker_name || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-[#B2C0D7] text-xs">Rating</p>
                      <p className="text-[#EEF1F6] font-medium">
                        ⭐ {selectedOrder.rating || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Booking Details */}
                <div className="bg-[#28364D] rounded-lg p-4 border border-[#486089]">
                  <h3 className="text-[#7A3FE0] font-semibold text-sm uppercase tracking-wide mb-3">
                    Booking Details
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <p className="text-[#B2C0D7] text-sm">Date</p>
                      <p className="text-[#EEF1F6] font-medium">
                        {selectedOrder.booking_date
                          ? new Date(
                              selectedOrder.booking_date,
                            ).toLocaleDateString()
                          : "Not set"}
                      </p>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-[#B2C0D7] text-sm">Time</p>
                      <p className="text-[#EEF1F6] font-medium">
                        {selectedOrder.booking_time || "Not set"}
                      </p>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-[#B2C0D7] text-sm">Location</p>
                      <p className="text-[#EEF1F6] font-medium">
                        {selectedOrder.location || "Not specified"}
                      </p>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-[#486089]">
                      <p className="text-[#B2C0D7] text-sm">Price</p>
                      <p className="text-[#EEF1F6] font-bold text-lg">
                        ₹
                        {selectedOrder.price ||
                          selectedOrder.worker_price ||
                          "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Description */}
                {selectedOrder.description && (
                  <div className="bg-[#28364D] rounded-lg p-4 border border-[#486089]">
                    <h3 className="text-[#7A3FE0] font-semibold text-sm uppercase tracking-wide mb-2">
                      Description
                    </h3>
                    <p className="text-[#B2C0D7] text-sm">
                      {selectedOrder.description}
                    </p>
                  </div>
                )}

                {/* Status */}
                <div className="bg-[#28364D] rounded-lg p-4 border border-[#486089]">
                  <h3 className="text-[#7A3FE0] font-semibold text-sm uppercase tracking-wide mb-3">
                    Status
                  </h3>
                  <div className="flex items-center justify-between">
                    <span
                      className={`inline-block px-4 py-2 rounded-full text-sm font-semibold capitalize ${getStatusColor(selectedOrder.status)}`}
                    >
                      {selectedOrder.status}
                    </span>
                    <p className="text-[#B2C0D7] text-xs">
                      Booked on{" "}
                      {new Date(selectedOrder.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Close Button */}
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="w-full px-4 py-2 bg-[#7A3FE0] text-[#EEF1F6] rounded-lg font-semibold hover:bg-[#9D5BFF] transition mt-4"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
