import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";
import { fallbackWorkerImage, resolveWorkerImage } from "../utils/workerImages";

import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch {
    return null;
  }
};

export default function WorkerProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [worker, setWorker] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("about");
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteSaving, setFavoriteSaving] = useState(false);
  const [currentUser] = useState(getStoredUser);

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

  useEffect(() => {
    fetchWorkerProfile();
  }, [id]);

  const fetchWorkerProfile = async () => {
    try {
      const workerRes = await API.get(`/workers/${id}`);
      setWorker(workerRes.data);

      const reviewsRes = await API.get(`/reviews/worker/${id}`);
      setReviews(reviewsRes.data || []);

      if (currentUser && currentUser.role !== "admin") {
        try {
          const favRes = await API.get(`/favorites/check/${id}`);
          setIsFavorite(!!favRes.data.isFavorite);
        } catch (err) {
          console.log(err);
          setIsFavorite(false);
        }
      } else {
        setIsFavorite(false);
      }

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

  const toggleFavorite = async () => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    if (currentUser.role === "admin" || !worker) return;

    const nextFavorite = !isFavorite;

    try {
      setFavoriteSaving(true);
      setIsFavorite(nextFavorite);

      if (nextFavorite) {
        await API.post("/favorites", { worker_id: worker.id });
      } else {
        await API.delete("/favorites", {
          data: { worker_id: worker.id },
        });
      }
    } catch (err) {
      console.log(err);
      setIsFavorite(!nextFavorite);
      alert("Unable to update favorite");
    } finally {
      setFavoriteSaving(false);
    }
  };

  if (loading) {
    return <div className="text-[#191919] text-center mt-20">Loading...</div>;
  }

  if (!worker) {
    return <div className="text-[#191919] text-center mt-20">Worker not found</div>;
  }

  // 🛡️ SAFE fallback coords (prevents LatLng error)
  const lat = Number(worker.latitude) || 12.9719;
  const lng = Number(worker.longitude) || 77.6412;

  return (
    <div className="bg-[#FFFFFF] min-h-screen px-6 py-12">
      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="relative bg-[#E9E5DF] rounded-2xl p-8 flex flex-col md:flex-row items-start gap-6 shadow-lg">
          {currentUser?.role !== "admin" && (
            <button
              onClick={toggleFavorite}
              disabled={favoriteSaving}
              aria-pressed={isFavorite}
              title={isFavorite ? "Remove from favorites" : "Add to favorites"}
              className={`absolute top-4 left-4 z-[1000] h-11 w-11 rounded-full border border-[#D0D7DE] bg-[#FFFFFF]/90 text-2xl shadow-lg backdrop-blur transition hover:scale-105 disabled:opacity-60 ${
                isFavorite ? "text-[#B24020]" : "text-[#666666]"
              }`}
            >
              ♥
            </button>
          )}

          <img
            src={resolveWorkerImage(worker)}
            alt={worker.name}
            className="w-full md:w-64 h-64 object-cover rounded-xl"
            onError={(e) => {
              e.currentTarget.src = fallbackWorkerImage;
            }}
          />

          <div className="flex-1">
            <h1 className="text-3xl font-bold text-[#191919]">{worker.name}</h1>
            <p className="text-[#0A66C2]">{worker.service_name}</p>

            <p className="text-[#666666] mt-2">📍 {worker.location}</p>

            {distance && (
              <p className="text-[#057642] mt-1">
                📏 {distance} km away
              </p>
            )}

            <p className="text-2xl text-[#0A66C2] font-bold mt-2">
              ₹{worker.price}
            </p>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowBooking(true)}
                className="bg-[#0A66C2] px-4 py-2 rounded-lg text-white hover:bg-[#004182]"
              >
                📅 Book Now
              </button>

              <button
                onClick={() => window.open(`tel:${worker.phone}`)}
                className="bg-[#E9E5DF] px-4 py-2 rounded-lg text-[#0A66C2] hover:bg-[#DCE6F1]"
              >
                📞 Call
              </button>
            </div>
          </div>

          {/* 🗺️ MAP (RIGHT SIDE) */}
          <div
            onClick={() => setShowMap(true)}
            className="relative z-0 w-full md:w-80 h-64 shrink-0 rounded-xl overflow-hidden cursor-pointer border border-[#D0D7DE] bg-[#EAF4FD]"
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
    className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
    onClick={() => setShowMap(false)} // click outside closes
  >
    <div
      className="w-full max-w-5xl h-[85vh] bg-white rounded-xl overflow-hidden relative shadow-2xl"
      onClick={(e) => e.stopPropagation()} // prevent closing when clicking map
    >
      {/* CLOSE BUTTON */}
      <button
        onClick={() => setShowMap(false)}
        className="absolute top-4 right-4 z-[10000] bg-[#0A66C2] text-white px-4 py-2 rounded-lg hover:bg-[#004182] transition"
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
            pathOptions={{ color: "#0A66C2", weight: 4 }}
          />
        )}
      </MapContainer>
    </div>
  </div>
)}

        {/* TABS (UNCHANGED) */}
        <div className="mt-8 bg-[#E9E5DF] rounded-xl overflow-hidden">
          <div className="flex">
            <button
              onClick={() => setActiveTab("about")}
              className={`flex-1 py-3 ${
                activeTab === "about"
                  ? "bg-[#0A66C2] text-white"
                  : "text-[#666666]"
              }`}
            >
              About
            </button>
            <button
              onClick={() => setActiveTab("reviews")}
              className={`flex-1 py-3 ${
                activeTab === "reviews"
                  ? "bg-[#0A66C2] text-white"
                  : "text-[#666666]"
              }`}
            >
              Reviews ({reviews.length})
            </button>
          </div>

          <div className="p-6">

            {/* ABOUT (UNCHANGED) */}
            {activeTab === "about" && (
              <div className="space-y-6">
                <div className="bg-[#FFFFFF] p-5 rounded-lg border border-[#D0D7DE]">
                  <h3 className="text-[#191919] text-lg font-semibold mb-2">
                    About Service
                  </h3>
                  <p className="text-[#666666] text-sm leading-relaxed">
                    {worker.description ||
                      "Professional service provider delivering high-quality results."}
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-[#FFFFFF] p-4 rounded-lg text-center">
                    <p className="text-[#666666] text-sm">Experience</p>
                    <p className="text-[#191919] font-bold text-lg">
                      {worker.experience} yrs
                    </p>
                  </div>
                  <div className="bg-[#FFFFFF] p-4 rounded-lg text-center">
                    <p className="text-[#666666] text-sm">Jobs</p>
                    <p className="text-[#191919] font-bold text-lg">
                      {worker.jobs_completed}
                    </p>
                  </div>
                  <div className="bg-[#FFFFFF] p-4 rounded-lg text-center">
                    <p className="text-[#666666] text-sm">Rating</p>
                    <p className="text-[#191919] font-bold text-lg">
                      ⭐ {worker.rating}
                    </p>
                  </div>
                  <div className="bg-[#FFFFFF] p-4 rounded-lg text-center">
                    <p className="text-[#666666] text-sm">Response</p>
                    <p className="text-[#191919] font-bold text-lg">
                      {worker.response_time}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* REVIEWS (UNCHANGED) */}
            {activeTab === "reviews" && (
              <div className="space-y-4">
                {reviews.length === 0 && (
                  <div className="bg-[#FFFFFF] p-5 rounded-lg border border-[#D0D7DE]">
                    <p className="text-[#666666]">
                      No reviews yet.
                    </p>
                  </div>
                )}

                {reviews.map((review) => (
                  <div
                    key={review.id}
                    className="bg-[#FFFFFF] p-5 rounded-lg border border-[#D0D7DE] hover:border-[#0A66C2] transition"
                  >
                    <div className="flex justify-between mb-2">
                      <h4 className="text-[#191919] font-semibold">
                        {review.user_name}
                      </h4>
                      <span className="text-[#915907]">
                        {"⭐".repeat(review.rating)}
                      </span>
                    </div>

                    <p className="text-[#666666] text-sm">
                      {review.comment}
                    </p>

                    <p className="text-xs text-[#86888A] mt-2">
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
            <div className="bg-[#E9E5DF] p-6 rounded-xl w-full max-w-md">

              <h2 className="text-[#191919] text-xl font-bold mb-4">
                Book Service
              </h2>

              <input type="date" className="w-full mb-3 p-2 rounded bg-[#E9E5DF] text-[#191919]"
                onChange={(e) => setBookingData({ ...bookingData, booking_date: e.target.value })}
              />

              <input type="time" className="w-full mb-3 p-2 rounded bg-[#E9E5DF] text-[#191919]"
                onChange={(e) => setBookingData({ ...bookingData, booking_time: e.target.value })}
              />

              <input type="text" placeholder="Location"
                className="w-full mb-3 p-2 rounded bg-[#E9E5DF] text-[#191919]"
                onChange={(e) => setBookingData({ ...bookingData, location: e.target.value })}
              />

              <textarea placeholder="Description"
                className="w-full mb-3 p-2 rounded bg-[#E9E5DF] text-[#191919]"
                onChange={(e) => setBookingData({ ...bookingData, description: e.target.value })}
              />

              <div className="flex gap-3">
                <button onClick={handleBooking} className="flex-1 bg-[#057642] py-2 rounded text-white">
                  Confirm
                </button>
                <button onClick={() => setShowBooking(false)} className="flex-1 bg-[#666666] py-2 rounded text-white">
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
