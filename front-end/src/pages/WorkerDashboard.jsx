import { useCallback, useEffect, useState } from "react";
import API from "../api/axios";

const emptyProfileForm = {
  service_id: "",
  image: "",
  price: "500",
  location: "",
  description: "",
  experience: "0",
};

export default function WorkerDashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const [profileMissing, setProfileMissing] = useState(false);
  const [services, setServices] = useState([]);
  const [profileForm, setProfileForm] = useState(emptyProfileForm);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileError, setProfileError] = useState("");

  const inputClass =
    "w-full bg-[#E9E5DF] border border-[#D0D7DE] rounded-lg px-4 py-3 text-[#191919] focus:outline-none focus:border-[#0A66C2]";

  const loadServices = useCallback(async () => {
    try {
      const res = await API.get("/services");
      const serviceData = res.data || [];

      setServices(serviceData);
      setProfileForm((prev) => ({
        ...prev,
        service_id: prev.service_id || String(serviceData[0]?.id || ""),
      }));
    } catch (err) {
      console.log(err);
      setProfileError("Unable to load services");
    }
  }, []);

  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      setProfileError("");
      setProfileMissing(false);

      const res = await API.get("/bookings/worker/my");
      setBookings(res.data || []);
    } catch (err) {
      const message = err.response?.data?.message;

      if (
        err.response?.status === 404 &&
        message === "Worker profile not found"
      ) {
        setBookings([]);
        setProfileMissing(true);
        await loadServices();
        return;
      }

      setError(message || "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  }, [loadServices]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.id) {
      setLoading(false);
      return;
    }

    fetchBookings();
  }, [fetchBookings]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({ ...prev, [name]: value }));
    setProfileError("");
  };

  const handleCreateProfile = async (e) => {
    e.preventDefault();

    if (!profileForm.service_id || !profileForm.price) {
      setProfileError("Service and price are required");
      return;
    }

    try {
      setProfileSaving(true);
      setProfileError("");

      await API.post("/workers", {
        service_id: Number(profileForm.service_id),
        image: profileForm.image.trim() || null,
        price: Number(profileForm.price),
        location: profileForm.location.trim() || null,
        description: profileForm.description.trim() || null,
        experience: Number(profileForm.experience || 0),
      });

      await fetchBookings();
    } catch (err) {
      setProfileError(err.response?.data?.message || "Failed to create profile");
    } finally {
      setProfileSaving(false);
    }
  };

  const updateStatus = async (bookingId, status) => {
    setUpdatingId(bookingId);

    setBookings((prev) =>
      prev.map((booking) =>
        booking.id === bookingId ? { ...booking, status } : booking,
      ),
    );

    try {
      await API.patch(`/bookings/${bookingId}`, { status });
    } catch (err) {
      console.log(err);
      fetchBookings();
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusBadge = (status) => {
    const base = "px-3 py-1 rounded-full text-xs font-semibold";

    switch (status) {
      case "pending":
        return `${base} bg-[#FFF4CE] text-[#915907]`;
      case "accepted":
        return `${base} bg-[#E6F4EA] text-[#057642]`;
      case "completed":
        return `${base} bg-[#EAF4FD] text-[#0A66C2]`;
      case "rejected":
        return `${base} bg-[#FDE7E9] text-[#B24020]`;
      default:
        return base;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-[#191919] text-lg">
        Loading dashboard...
      </div>
    );
  }

  if (profileMissing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#E9E5DF] to-[#EAF4FD] px-6 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-[#191919]">Worker Dashboard</h1>
            <p className="text-[#666666] mt-2">
              Complete your worker profile before managing bookings.
            </p>
          </div>

          <form
            onSubmit={handleCreateProfile}
            className="bg-[#FFFFFF] border border-[#D0D7DE] rounded-xl p-6 shadow-md space-y-5"
          >
            {profileError && (
              <div className="bg-[#FDE7E9] border border-[#F4B8B2] text-[#B24020] px-4 py-3 rounded-lg text-sm">
                {profileError}
              </div>
            )}

            <div>
              <label className="block text-[#666666] text-sm font-medium mb-2">
                Service
              </label>
              <select
                name="service_id"
                value={profileForm.service_id}
                onChange={handleProfileChange}
                className={inputClass}
                disabled={services.length === 0}
              >
                {services.length === 0 ? (
                  <option value="">No services available</option>
                ) : (
                  services.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.name}
                    </option>
                  ))
                )}
              </select>
            </div>

            <div>
              <label className="block text-[#666666] text-sm font-medium mb-2">
                Profile Picture URL
              </label>
              <input
                type="url"
                name="image"
                value={profileForm.image}
                onChange={handleProfileChange}
                className={inputClass}
                placeholder="https://example.com/work-photo.jpg"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-[#666666] text-sm font-medium mb-2">
                  Base Price
                </label>
                <input
                  type="number"
                  name="price"
                  min="1"
                  value={profileForm.price}
                  onChange={handleProfileChange}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-[#666666] text-sm font-medium mb-2">
                  Experience (In Years)
                </label>
                <input
                  type="number"
                  name="experience"
                  min="0"
                  value={profileForm.experience}
                  onChange={handleProfileChange}
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label className="block text-[#666666] text-sm font-medium mb-2">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={profileForm.location}
                onChange={handleProfileChange}
                className={inputClass}
                placeholder="Your service area"
              />
            </div>

            <div>
              <label className="block text-[#666666] text-sm font-medium mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={profileForm.description}
                onChange={handleProfileChange}
                className={`${inputClass} min-h-28 resize-y`}
                placeholder="Short summary of your experience"
              />
            </div>

            <button
              type="submit"
              disabled={profileSaving || services.length === 0}
              className="w-full bg-[#0A66C2] hover:bg-[#004182] disabled:opacity-50 text-white px-5 py-3 rounded-lg font-semibold transition"
            >
              {profileSaving ? "Saving..." : "Save Worker Profile"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center mt-20 text-[#B24020] text-lg">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E9E5DF] to-[#EAF4FD] px-6 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-[#191919]">Worker Dashboard</h1>
          <p className="text-[#666666] mt-2">
            Manage and track your service bookings
          </p>
        </div>

        {bookings.length === 0 ? (
          <div className="bg-[#FFFFFF] border border-[#D0D7DE] rounded-xl p-12 text-center">
            <p className="text-[#666666] text-lg">No bookings available yet</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-[#FFFFFF] border border-[#D0D7DE] rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300"
              >
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                  <div>
                    <h2 className="text-lg font-semibold text-[#191919]">
                      {booking.user_name}
                    </h2>
                    <p className="text-[#666666] text-sm mt-1">
                      {booking.location || "Location not provided"}
                    </p>

                    <div className="mt-2">
                      <span className={getStatusBadge(booking.status)}>
                        {booking.status.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2 flex-wrap">
                    {booking.status === "pending" && (
                      <>
                        <button
                          disabled={updatingId === booking.id}
                          onClick={() => updateStatus(booking.id, "accepted")}
                          className="bg-[#057642] hover:bg-[#004B1C] disabled:opacity-50 text-white px-4 py-2 rounded-lg font-semibold transition"
                        >
                          Accept
                        </button>
                        <button
                          disabled={updatingId === booking.id}
                          onClick={() => updateStatus(booking.id, "rejected")}
                          className="bg-[#B24020] hover:bg-[#8F2C14] disabled:opacity-50 text-white px-4 py-2 rounded-lg font-semibold transition"
                        >
                          Reject
                        </button>
                      </>
                    )}

                    {booking.status === "accepted" && (
                      <button
                        disabled={updatingId === booking.id}
                        onClick={() => updateStatus(booking.id, "completed")}
                        className="bg-[#0A66C2] hover:bg-[#004182] disabled:opacity-50 text-white px-4 py-2 rounded-lg font-semibold transition"
                      >
                        Mark as Completed
                      </button>
                    )}

                    {booking.status === "completed" && (
                      <span className="text-[#0A66C2] font-semibold">
                        Job Completed
                      </span>
                    )}

                    {booking.status === "rejected" && (
                      <span className="text-[#B24020] font-semibold">
                        Request Rejected
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
