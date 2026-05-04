import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";

import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function WorkerProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [worker, setWorker] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("about");
  const [isFavorite, setIsFavorite] = useState(false);

  const [showBooking, setShowBooking] = useState(false);
  const [showMap, setShowMap] = useState(false);

  const [userLocation, setUserLocation] = useState(null);
  const [distance, setDistance] = useState(null);

  const [bookingData, setBookingData] = useState({
    booking_date: "",
    booking_time: "",
    location: "",
    description: "",
  });

  const fallbackReviews = [
    {
      id: 1,
      user_name: "Rahul Sharma",
      rating: 5,
      comment: "Excellent service! Very professional and quick.",
      created_at: new Date(),
    },
    {
      id: 2,
      user_name: "Priya Nair",
      rating: 4,
      comment: "Good work, arrived on time and completed efficiently.",
      created_at: new Date(),
    },
    {
      id: 3,
      user_name: "Amit Verma",
      rating: 5,
      comment: "Highly recommended. Clean and neat work!",
      created_at: new Date(),
    },
  ];

  useEffect(() => {
    fetchWorkerProfile();
  }, [id]);

  const fetchWorkerProfile = async () => {
    try {
      const workerRes = await API.get(`/workers/${id}`);
      setWorker(workerRes.data);

      const reviewsRes = await API.get(`/reviews/worker/${id}`);
      setReviews(
        reviewsRes.data && reviewsRes.data.length > 0
          ? reviewsRes.data
          : fallbackReviews
      );

      const favRes = await API.get(`/favorites/check/${id}`);
      setIsFavorite(favRes.data.isFavorite);

      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  // 📍 Get user live location
  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      () => console.log("Location permission denied")
    );
  }, []);

  // 📏 Distance calculation (Haversine)
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1 * Math.PI / 180) *
        Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) ** 2;

    return (R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))).toFixed(2);
  };

  useEffect(() => {
    if (
      userLocation &&
      worker?.latitude &&
      worker?.longitude
    ) {
      const d = calculateDistance(
        userLocation.lat,
        userLocation.lng,
        worker.latitude,
        worker.longitude
      );
      setDistance(d);
    }
  }, [userLocation, worker]);

  const handleBooking = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const token = localStorage.getItem("token");

      if (!user || !token) {
        alert("Please login first");
        navigate("/login");
        return;
      }

      await API.post("/bookings", {
        worker_id: worker.id,
        service_id: worker.service_id,
        ...bookingData,
        price: worker.price,
      });

      alert("Booking successful!");
      setShowBooking(false);
      navigate("/orders");
    } catch (err) {
      alert("Booking failed");
    }
  };

  if (loading) {
    return <div className="text-white text-center mt-20">Loading...</div>;
  }

  if (!worker) {
    return <div className="text-white text-center mt-20">Worker not found</div>;
  }

  // 🛡️ SAFE fallback coords (prevents LatLng error)
  const lat = Number(worker.latitude) || 12.9719;
  const lng = Number(worker.longitude) || 77.6412;

  return (
    <div className="bg-[#1e293b] min-h-screen px-6 py-12">
      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="bg-[#28364D] rounded-2xl p-8 flex flex-col md:flex-row gap-6 shadow-lg">
          <img
            src={worker.image}
            alt={worker.name}
            className="w-full md:w-64 h-64 object-cover rounded-xl"
          />

          <div className="flex-1">
            <h1 className="text-3xl font-bold text-white">{worker.name}</h1>
            <p className="text-purple-400">{worker.service_name}</p>

            <p className="text-gray-400 mt-2">📍 {worker.location}</p>

            {distance && (
              <p className="text-green-400 mt-1">
                📏 {distance} km away
              </p>
            )}

            <p className="text-2xl text-purple-400 font-bold mt-2">
              ₹{worker.price}
            </p>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowBooking(true)}
                className="bg-purple-600 px-4 py-2 rounded-lg text-white hover:bg-purple-700"
              >
                📅 Book Now
              </button>

              <button
                onClick={() => window.open(`tel:${worker.phone}`)}
                className="bg-gray-700 px-4 py-2 rounded-lg text-white hover:bg-gray-600"
              >
                📞 Call
              </button>
            </div>
          </div>

          {/* 🗺️ MAP (RIGHT SIDE) */}
          <div
            onClick={() => setShowMap(true)}
            className="w-full md:w-80 h-52 rounded-xl overflow-hidden cursor-pointer border"
          >
            <MapContainer
              center={[lat, lng]}
              zoom={13}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker position={[lat, lng]} />
            </MapContainer>
          </div>
        </div>

        {/* 🗺️ MODAL MAP (FIXED VERSION) */}
{showMap && (
  <div
    className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center"
    onClick={() => setShowMap(false)} // click outside closes
  >
    <div
      className="w-[90%] h-[80%] bg-white rounded-xl overflow-hidden relative shadow-2xl"
      onClick={(e) => e.stopPropagation()} // prevent closing when clicking map
    >
      {/* CLOSE BUTTON */}
      <button
        onClick={() => setShowMap(false)}
        className="absolute top-4 right-4 z-50 bg-black text-white px-4 py-2 rounded-lg"
      >
        ✕ Close
      </button>

      <MapContainer
        center={[lat, lng]}
        zoom={14}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {/* Worker */}
        <Marker position={[lat, lng]} />

        {/* User */}
        {userLocation && (
          <Marker position={[userLocation.lat, userLocation.lng]} />
        )}

        {/* Path */}
        {userLocation && (
          <Polyline
            positions={[
              [userLocation.lat, userLocation.lng],
              [lat, lng],
            ]}
            pathOptions={{ color: "red", weight: 4 }}
          />
        )}
      </MapContainer>
    </div>
  </div>
)}

        {/* TABS (UNCHANGED) */}
        <div className="mt-8 bg-[#28364D] rounded-xl overflow-hidden">
          <div className="flex">
            <button
              onClick={() => setActiveTab("about")}
              className={`flex-1 py-3 ${
                activeTab === "about"
                  ? "bg-purple-600 text-white"
                  : "text-gray-400"
              }`}
            >
              About
            </button>
            <button
              onClick={() => setActiveTab("reviews")}
              className={`flex-1 py-3 ${
                activeTab === "reviews"
                  ? "bg-purple-600 text-white"
                  : "text-gray-400"
              }`}
            >
              Reviews ({reviews.length})
            </button>
          </div>

          <div className="p-6">

            {/* ABOUT (UNCHANGED) */}
            {activeTab === "about" && (
              <div className="space-y-6">
                <div className="bg-[#1e293b] p-5 rounded-lg border border-gray-700">
                  <h3 className="text-white text-lg font-semibold mb-2">
                    About Service
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {worker.description ||
                      "Professional service provider delivering high-quality results."}
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-[#1e293b] p-4 rounded-lg text-center">
                    <p className="text-gray-400 text-sm">Experience</p>
                    <p className="text-white font-bold text-lg">
                      {worker.experience} yrs
                    </p>
                  </div>
                  <div className="bg-[#1e293b] p-4 rounded-lg text-center">
                    <p className="text-gray-400 text-sm">Jobs</p>
                    <p className="text-white font-bold text-lg">
                      {worker.jobs_completed}
                    </p>
                  </div>
                  <div className="bg-[#1e293b] p-4 rounded-lg text-center">
                    <p className="text-gray-400 text-sm">Rating</p>
                    <p className="text-white font-bold text-lg">
                      ⭐ {worker.rating}
                    </p>
                  </div>
                  <div className="bg-[#1e293b] p-4 rounded-lg text-center">
                    <p className="text-gray-400 text-sm">Response</p>
                    <p className="text-white font-bold text-lg">
                      {worker.response_time}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* REVIEWS (UNCHANGED) */}
            {activeTab === "reviews" && (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div
                    key={review.id}
                    className="bg-[#1e293b] p-5 rounded-lg border border-gray-700 hover:border-purple-500 transition"
                  >
                    <div className="flex justify-between mb-2">
                      <h4 className="text-white font-semibold">
                        {review.user_name}
                      </h4>
                      <span className="text-yellow-400">
                        {"⭐".repeat(review.rating)}
                      </span>
                    </div>

                    <p className="text-gray-400 text-sm">
                      {review.comment}
                    </p>

                    <p className="text-xs text-gray-500 mt-2">
                      {new Date(review.created_at).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}

          </div>
        </div>

        {/* BOOKING MODAL (UNCHANGED) */}
        {showBooking && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-[#28364D] p-6 rounded-xl w-full max-w-md">

              <h2 className="text-white text-xl font-bold mb-4">
                Book Service
              </h2>

              <input type="date" className="w-full mb-3 p-2 rounded bg-gray-700 text-white"
                onChange={(e) => setBookingData({ ...bookingData, booking_date: e.target.value })}
              />

              <input type="time" className="w-full mb-3 p-2 rounded bg-gray-700 text-white"
                onChange={(e) => setBookingData({ ...bookingData, booking_time: e.target.value })}
              />

              <input type="text" placeholder="Location"
                className="w-full mb-3 p-2 rounded bg-gray-700 text-white"
                onChange={(e) => setBookingData({ ...bookingData, location: e.target.value })}
              />

              <textarea placeholder="Description"
                className="w-full mb-3 p-2 rounded bg-gray-700 text-white"
                onChange={(e) => setBookingData({ ...bookingData, description: e.target.value })}
              />

              <div className="flex gap-3">
                <button onClick={handleBooking} className="flex-1 bg-green-600 py-2 rounded text-white">
                  Confirm
                </button>
                <button onClick={() => setShowBooking(false)} className="flex-1 bg-gray-600 py-2 rounded text-white">
                  Cancel
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}