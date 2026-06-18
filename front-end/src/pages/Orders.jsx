import { useEffect, useState } from "react";
import API from "../api/axios";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [previousStatuses, setPreviousStatuses] = useState({});
  const [reviewOrder, setReviewOrder] = useState(null);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });
  const [reviewSaving, setReviewSaving] = useState(false);
  const [reviewError, setReviewError] = useState("");

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-[#E6F4EA] text-[#057642]";
      case "accepted":
        return "bg-[#EAF4FD] text-[#0A66C2]";
      case "pending":
        return "bg-[#FFF4CE] text-[#915907]";
      case "rejected":
        return "bg-[#FDE7E9] text-[#B24020]";
      default:
        return "bg-[#E9E5DF] text-[#666666]";
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

  const openReviewModal = (order) => {
    setReviewOrder(order);
    setReviewForm({
      rating: order.review_rating || 5,
      comment: order.review_comment || "",
    });
    setReviewError("");
  };

  const closeReviewModal = () => {
    setReviewOrder(null);
    setReviewForm({ rating: 5, comment: "" });
    setReviewError("");
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewError("");

    if (!reviewOrder) return;

    if (reviewOrder.status !== "completed") {
      setReviewError("You can rate a worker only after the work is completed.");
      return;
    }

    if (!reviewOrder.worker_id) {
      setReviewError("Worker information is missing for this order.");
      return;
    }

    try {
      setReviewSaving(true);
      const res = await API.post("/reviews", {
        worker_id: reviewOrder.worker_id,
        booking_id: reviewOrder.id,
        rating: Number(reviewForm.rating),
        comment: reviewForm.comment.trim() || null,
      });

      setOrders((prev) =>
        prev.map((order) =>
          order.id === reviewOrder.id
            ? {
                ...order,
                review_id: res.data.id,
                review_rating: res.data.rating,
                review_comment: res.data.comment,
              }
            : order,
        ),
      );

      if (selectedOrder?.id === reviewOrder.id) {
        setSelectedOrder((prev) =>
          prev
            ? {
                ...prev,
                review_id: res.data.id,
                review_rating: res.data.rating,
                review_comment: res.data.comment,
              }
            : prev,
        );
      }

      closeReviewModal();
    } catch (err) {
      setReviewError(
        err.response?.data?.message || "Unable to submit your review",
      );
    } finally {
      setReviewSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-[#E9E5DF] min-h-screen px-6 py-16 flex items-center justify-center">
        <div className="text-[#191919]">Loading your orders...</div>
      </div>
    );
  }

  return (
    <div className="bg-[#E9E5DF] min-h-screen px-6 py-16">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-[#191919]">
            My Orders
          </h1>
          <p className="text-[#666666] mt-2">
            Track and manage your service bookings
          </p>
        </div>

        {error && (
          <div className="bg-[#FDE7E9] border border-[#D93025] text-[#B24020] px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Orders List */}
        {orders.length === 0 ? (
          <div className="bg-[#FFFFFF] rounded-2xl border border-[#D0D7DE] p-12 text-center">
            <p className="text-[#666666] text-lg mb-4">No orders yet</p>
            <p className="text-[#666666] text-sm">
              Once you book a service, it will appear here
            </p>
            <a
              href="/services"
              className="inline-block bg-[#0A66C2] text-white px-6 py-2 rounded-lg hover:shadow-lg transition"
            >
              Browse Services
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-[#FFFFFF] rounded-xl border border-[#D0D7DE] p-6 hover:border-[#0A66C2] transition"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  {/* Order Info */}
                  <div className="flex-1">
                    <h3 className="text-[#191919] font-semibold text-lg mb-2">
                      {order.service_name || "Service"}
                    </h3>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-[#666666]">Worker</p>
                        <p className="text-[#191919] font-medium">
                          {order.worker_name || "N/A"}
                        </p>
                      </div>

                      <div>
                        <p className="text-[#666666]">Date</p>
                        <p className="text-[#191919] font-medium">
                          {order.booking_date
                            ? new Date(order.booking_date).toLocaleDateString()
                            : "Not set"}
                        </p>
                      </div>

                      <div>
                        <p className="text-[#666666]">Price</p>
                        <p className="text-[#191919] font-medium">
                          ₹{order.price || order.worker_price || "N/A"}
                        </p>
                      </div>

                      <div>
                        <p className="text-[#666666]">Status</p>
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
                      <button className="px-4 py-2 bg-[#915907] text-white rounded-lg text-sm hover:bg-[#6F4300] transition">
                        Pending
                      </button>
                    )}
                    {order.status === "accepted" && (
                      <button className="px-4 py-2 bg-[#0A66C2] text-white rounded-lg text-sm hover:bg-[#004182] transition">
                        Confirmed
                      </button>
                    )}
                    {order.status === "completed" && (
                      <button className="px-4 py-2 bg-[#057642] text-white rounded-lg text-sm hover:bg-[#004B1C] transition">
                        ✓ Complete
                      </button>
                    )}
                    {order.status === "completed" &&
                      (order.review_id ? (
                        <button
                          disabled
                          className="px-4 py-2 bg-[#E6F4EA] text-[#057642] rounded-lg text-sm cursor-not-allowed"
                        >
                          Rated
                        </button>
                      ) : (
                        <button
                          onClick={() => openReviewModal(order)}
                          className="px-4 py-2 bg-[#0A66C2] text-white rounded-lg text-sm hover:bg-[#004182] transition"
                        >
                          Rate Worker
                        </button>
                      ))}
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="px-4 py-2 bg-[#0A66C2] text-white rounded-lg text-sm hover:bg-[#004182] transition"
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
            <div className="bg-[#FFFFFF] rounded-2xl border border-[#D0D7DE] p-8 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
              {/* Close Button */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-[#191919]">
                  Booking Details
                </h2>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-[#666666] hover:text-[#191919] text-2xl"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-6">
                {/* Service Info */}
                <div className="bg-[#E9E5DF] rounded-lg p-4 border border-[#D0D7DE]">
                  <h3 className="text-[#0A66C2] font-semibold text-sm uppercase tracking-wide mb-3">
                    Service Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[#666666] text-xs">Service</p>
                      <p className="text-[#191919] font-medium">
                        {selectedOrder.service_name || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-[#666666] text-xs">Booking ID</p>
                      <p className="text-[#191919] font-medium">
                        #{selectedOrder.id}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Worker Info */}
                <div className="bg-[#E9E5DF] rounded-lg p-4 border border-[#D0D7DE]">
                  <h3 className="text-[#0A66C2] font-semibold text-sm uppercase tracking-wide mb-3">
                    Worker Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[#666666] text-xs">Name</p>
                      <p className="text-[#191919] font-medium">
                        {selectedOrder.worker_name || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-[#666666] text-xs">Rating</p>
                      <p className="text-[#191919] font-medium">
                        ⭐ {selectedOrder.rating || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Booking Details */}
                <div className="bg-[#E9E5DF] rounded-lg p-4 border border-[#D0D7DE]">
                  <h3 className="text-[#0A66C2] font-semibold text-sm uppercase tracking-wide mb-3">
                    Booking Details
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <p className="text-[#666666] text-sm">Date</p>
                      <p className="text-[#191919] font-medium">
                        {selectedOrder.booking_date
                          ? new Date(
                              selectedOrder.booking_date,
                            ).toLocaleDateString()
                          : "Not set"}
                      </p>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-[#666666] text-sm">Time</p>
                      <p className="text-[#191919] font-medium">
                        {selectedOrder.booking_time || "Not set"}
                      </p>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-[#666666] text-sm">Location</p>
                      <p className="text-[#191919] font-medium">
                        {selectedOrder.location || "Not specified"}
                      </p>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-[#D0D7DE]">
                      <p className="text-[#666666] text-sm">Price</p>
                      <p className="text-[#191919] font-bold text-lg">
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
                  <div className="bg-[#E9E5DF] rounded-lg p-4 border border-[#D0D7DE]">
                    <h3 className="text-[#0A66C2] font-semibold text-sm uppercase tracking-wide mb-2">
                      Description
                    </h3>
                    <p className="text-[#666666] text-sm">
                      {selectedOrder.description}
                    </p>
                  </div>
                )}

                {/* Status */}
                <div className="bg-[#E9E5DF] rounded-lg p-4 border border-[#D0D7DE]">
                  <h3 className="text-[#0A66C2] font-semibold text-sm uppercase tracking-wide mb-3">
                    Status
                  </h3>
                  <div className="flex items-center justify-between">
                    <span
                      className={`inline-block px-4 py-2 rounded-full text-sm font-semibold capitalize ${getStatusColor(selectedOrder.status)}`}
                    >
                      {selectedOrder.status}
                    </span>
                    <p className="text-[#666666] text-xs">
                      Booked on{" "}
                      {new Date(selectedOrder.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Close Button */}
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="w-full px-4 py-2 bg-[#0A66C2] text-white rounded-lg font-semibold hover:bg-[#004182] transition mt-4"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {reviewOrder && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-[#FFFFFF] rounded-2xl border border-[#D0D7DE] p-8 w-full max-w-lg">
              <div className="flex justify-between items-start gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-[#191919]">
                    Rate Worker
                  </h2>
                  <p className="text-[#666666] mt-1">
                    {reviewOrder.worker_name || "Worker"} for{" "}
                    {reviewOrder.service_name || "this service"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={closeReviewModal}
                  className="shrink-0 rounded-lg border border-[#D0D7DE] px-3 py-1.5 text-sm font-semibold text-[#0A66C2] hover:bg-[#EAF4FD] transition"
                >
                  Close
                </button>
              </div>

              <form onSubmit={handleReviewSubmit}>
                <div className="flex items-center gap-2 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() =>
                        setReviewForm((prev) => ({ ...prev, rating: star }))
                      }
                      className={`text-3xl transition ${
                        star <= reviewForm.rating
                          ? "text-[#915907]"
                          : "text-[#D0D7DE]"
                      }`}
                      aria-label={`${star} star rating`}
                    >
                      ★
                    </button>
                  ))}
                </div>

                <textarea
                  value={reviewForm.comment}
                  onChange={(e) =>
                    setReviewForm((prev) => ({
                      ...prev,
                      comment: e.target.value,
                    }))
                  }
                  placeholder="Write your feedback for this completed work"
                  className="w-full min-h-32 rounded-lg border border-[#D0D7DE] bg-[#E9E5DF] p-3 text-[#191919] focus:outline-none focus:border-[#0A66C2]"
                />

                {reviewError && (
                  <p className="mt-3 text-sm text-[#B24020]">
                    {reviewError}
                  </p>
                )}

                <div className="flex gap-3 mt-6">
                  <button
                    type="submit"
                    disabled={reviewSaving}
                    className="flex-1 bg-[#0A66C2] text-white py-2 rounded-lg font-semibold hover:bg-[#004182] disabled:opacity-60"
                  >
                    {reviewSaving ? "Submitting..." : "Submit Rating"}
                  </button>
                  <button
                    type="button"
                    onClick={closeReviewModal}
                    className="flex-1 bg-[#E9E5DF] text-[#0A66C2] py-2 rounded-lg font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
