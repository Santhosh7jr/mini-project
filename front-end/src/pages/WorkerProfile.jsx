import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";

export default function WorkerProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [worker, setWorker] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("about");
  const [isFavorite, setIsFavorite] = useState(false);
  const [showBooking, setShowBooking] = useState(false);
  const [bookingData, setBookingData] = useState({
    booking_date: "",
    booking_time: "",
    location: "",
    description: "",
  });

  useEffect(() => {
    fetchWorkerProfile();
  }, [id]);

  const fetchWorkerProfile = async () => {
    try {
      const workerRes = await API.get(`/workers/${id}`);
      setWorker(workerRes.data);

      const reviewsRes = await API.get(`/reviews/worker/${id}`);
      setReviews(reviewsRes.data || []);

      const user = JSON.parse(localStorage.getItem("user"));
      if (user) {
        const favRes = await API.get(`/favorites/check/${user.id}/${id}`);
        setIsFavorite(favRes.data.isFavorite);
      }

      setLoading(false);
    } catch (err) {
      console.log(err);
      setError("Failed to load worker profile");
      setLoading(false);
    }
  };

  const handleBooking = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const token = localStorage.getItem("token");

      if (!user || !token) {
        alert("Please log in to book");
        navigate("/login");
        return;
      }

      const res = await API.post(
        "/bookings",
        {
          user_id: user.id,
          worker_id: worker.id,
          service_id: worker.service_id,
          ...bookingData,
          price: worker.price,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      alert("Booking successful!");
      setShowBooking(false);
      navigate("/orders");
    } catch (err) {
      alert("Booking failed: " + (err.response?.data?.message || "Try again"));
    }
  };

  const toggleFavorite = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const token = localStorage.getItem("token");

      if (!user) {
        navigate("/login");
        return;
      }

      if (isFavorite) {
        await API.delete("/favorites", {
          headers: { Authorization: `Bearer ${token}` },
          data: { user_id: user.id, worker_id: worker.id },
        });
      } else {
        await API.post(
          "/favorites",
          { user_id: user.id, worker_id: worker.id },
          { headers: { Authorization: `Bearer ${token}` } },
        );
      }

      setIsFavorite(!isFavorite);
    } catch (err) {
      console.log(err);
    }
  };

  if (loading) {
    return (
      <div className="bg-[#28364D] min-h-screen flex items-center justify-center">
        <div className="text-[#EEF1F6]">Loading profile...</div>
      </div>
    );
  }

  if (!worker) {
    return (
      <div className="bg-[#28364D] min-h-screen flex items-center justify-center">
        <div className="text-[#EEF1F6]">Worker not found</div>
      </div>
    );
  }

  return (
    <div className="bg-[#28364D] min-h-screen px-6 py-12">
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="bg-[#384B6B] rounded-2xl border border-[#5875A7] overflow-hidden mb-8">
          <div className="flex flex-col md:flex-row gap-8 p-8">
            {/* Image */}
            <div className="md:w-1/3">
              <img
                src={worker.image || "https://via.placeholder.com/300"}
                alt={worker.name}
                className="w-full h-64 object-cover rounded-xl"
              />
            </div>

            {/* Info */}
            <div className="md:w-2/3">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-[#EEF1F6]">
                    {worker.name}
                  </h1>
                  <p className="text-[#7A3FE0] font-semibold">
                    {worker.service_name || "Service Provider"}
                  </p>
                </div>
                <button
                  onClick={toggleFavorite}
                  className={`text-3xl transition ${isFavorite ? "text-red-500" : "text-[#B2C0D7]"}`}
                >
                  ♥
                </button>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">⭐</span>
                <span className="text-[#EEF1F6] font-bold">
                  {worker.rating || 4.5}
                </span>
                <span className="text-[#B2C0D7]">
                  ({worker.reviews_count || 0} reviews)
                </span>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-6 py-4 border-t border-b border-[#5875A7]">
                <div>
                  <p className="text-[#B2C0D7] text-sm">Experience</p>
                  <p className="text-[#EEF1F6] font-bold text-lg">
                    {worker.experience || 0} years
                  </p>
                </div>
                <div>
                  <p className="text-[#B2C0D7] text-sm">Jobs Done</p>
                  <p className="text-[#EEF1F6] font-bold text-lg">
                    {worker.jobs_completed || 0}
                  </p>
                </div>
                <div>
                  <p className="text-[#B2C0D7] text-sm">Response Time</p>
                  <p className="text-[#EEF1F6] font-bold text-lg">
                    {worker.response_time || "1 hour"}
                  </p>
                </div>
              </div>

              {/* Location & Price */}
              <div className="space-y-2 mb-6">
                <p className="text-[#EEF1F6]">
                  📍 {worker.location || "Location not provided"}
                </p>
                <p className="text-2xl font-bold text-[#7A3FE0]">
                  ₹{worker.price || "N/A"}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 flex-wrap">
                <button
                  onClick={() => setShowBooking(true)}
                  className="flex-1 bg-gradient-to-r from-[#7A3FE0] to-[#5875A7] text-[#EEF1F6] py-3 rounded-lg font-semibold hover:shadow-lg transition"
                >
                  📅 Book Now
                </button>
                <button className="flex-1 bg-[#486089] text-[#EEF1F6] py-3 rounded-lg font-semibold hover:bg-[#5875A7] transition">
                  📞 Call Now
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-[#384B6B] rounded-2xl border border-[#5875A7] overflow-hidden">
          {/* Tab Headers */}
          <div className="flex border-b border-[#5875A7]">
            <button
              onClick={() => setActiveTab("about")}
              className={`flex-1 py-4 font-semibold transition ${
                activeTab === "about"
                  ? "bg-[#5875A7] text-[#EEF1F6]"
                  : "text-[#B2C0D7] hover:text-[#EEF1F6]"
              }`}
            >
              About
            </button>
            <button
              onClick={() => setActiveTab("reviews")}
              className={`flex-1 py-4 font-semibold transition ${
                activeTab === "reviews"
                  ? "bg-[#5875A7] text-[#EEF1F6]"
                  : "text-[#B2C0D7] hover:text-[#EEF1F6]"
              }`}
            >
              Reviews ({reviews.length})
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-8">
            {activeTab === "about" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-[#EEF1F6] font-bold text-lg mb-2">
                    Description
                  </h3>
                  <p className="text-[#B2C0D7]">
                    {worker.description ||
                      "Professional service provider with years of experience"}
                  </p>
                </div>

                <div>
                  <h3 className="text-[#EEF1F6] font-bold text-lg mb-2">
                    Skills
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {["Plumbing", "Repairs", "Installation", "Maintenance"].map(
                      (skill) => (
                        <span
                          key={skill}
                          className="bg-[#5875A7] text-[#EEF1F6] px-4 py-2 rounded-full text-sm"
                        >
                          {skill}
                        </span>
                      ),
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-[#EEF1F6] font-bold text-lg mb-2">
                    Contact
                  </h3>
                  <p className="text-[#EEF1F6]">
                    Phone: {worker.phone || "Available on chat"}
                  </p>
                </div>
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="space-y-4">
                {reviews.length === 0 ? (
                  <p className="text-[#B2C0D7]">
                    No reviews yet. Be the first to review!
                  </p>
                ) : (
                  reviews.map((review) => (
                    <div
                      key={review.id}
                      className="border-b border-[#5875A7] pb-4"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="text-[#EEF1F6] font-semibold">
                            {review.user_name}
                          </p>
                          <p className="text-[#B2C0D7] text-sm">
                            {"⭐".repeat(review.rating)}
                          </p>
                        </div>
                        <p className="text-[#B2C0D7] text-sm">
                          {new Date(review.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <p className="text-[#B2C0D7]">{review.comment}</p>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {/* Booking Modal */}
        {showBooking && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-[#384B6B] rounded-2xl border border-[#5875A7] p-8 w-full max-w-md">
              <h2 className="text-2xl font-bold text-[#EEF1F6] mb-6">
                Book Service
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-[#B2C0D7] text-sm font-medium mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    value={bookingData.booking_date}
                    onChange={(e) =>
                      setBookingData({
                        ...bookingData,
                        booking_date: e.target.value,
                      })
                    }
                    className="w-full bg-[#28364D] border border-[#5875A7] text-[#EEF1F6] px-4 py-2 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-[#B2C0D7] text-sm font-medium mb-2">
                    Time
                  </label>
                  <input
                    type="time"
                    value={bookingData.booking_time}
                    onChange={(e) =>
                      setBookingData({
                        ...bookingData,
                        booking_time: e.target.value,
                      })
                    }
                    className="w-full bg-[#28364D] border border-[#5875A7] text-[#EEF1F6] px-4 py-2 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-[#B2C0D7] text-sm font-medium mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    placeholder="Your address"
                    value={bookingData.location}
                    onChange={(e) =>
                      setBookingData({
                        ...bookingData,
                        location: e.target.value,
                      })
                    }
                    className="w-full bg-[#28364D] border border-[#5875A7] text-[#EEF1F6] px-4 py-2 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-[#B2C0D7] text-sm font-medium mb-2">
                    Description
                  </label>
                  <textarea
                    placeholder="Tell us more about the service..."
                    value={bookingData.description}
                    onChange={(e) =>
                      setBookingData({
                        ...bookingData,
                        description: e.target.value,
                      })
                    }
                    className="w-full bg-[#28364D] border border-[#5875A7] text-[#EEF1F6] px-4 py-2 rounded-lg"
                    rows="3"
                  />
                </div>

                <div className="flex gap-4 mt-6">
                  <button
                    onClick={handleBooking}
                    className="flex-1 bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition"
                  >
                    Confirm Booking
                  </button>
                  <button
                    onClick={() => setShowBooking(false)}
                    className="flex-1 bg-[#486089] text-[#EEF1F6] py-2 rounded-lg font-semibold hover:bg-[#5875A7] transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
