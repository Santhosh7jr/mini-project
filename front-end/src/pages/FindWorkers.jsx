import { useEffect, useState } from "react";
import API from "../api/axios";
import { useParams, useNavigate } from "react-router-dom";
import worker1 from "../assets/workers/worker1.svg";
import worker2 from "../assets/workers/worker2.svg";
import worker3 from "../assets/workers/worker3.svg";
import worker4 from "../assets/workers/worker4.svg";
import worker5 from "../assets/workers/worker5.svg";

const workerAvatars = {
  "worker1.svg": worker1,
  "worker2.svg": worker2,
  "worker3.svg": worker3,
  "worker4.svg": worker4,
  "worker5.svg": worker5,
};

export default function FindWorkers() {
  const [workers, setWorkers] = useState([]);
  const [filteredWorkers, setFilteredWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sort, setSort] = useState("top");
  const [favorites, setFavorites] = useState([]);

  const { serviceId } = useParams();
  const navigate = useNavigate();

  // Fetch workers
  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        const res = await API.get("/workers");
        setWorkers(res.data || []);
        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    };
    fetchWorkers();
  }, []);

  // Auto-select category based on serviceId
  useEffect(() => {
    if (serviceId) {
      setSelectedCategory(serviceId);
    } else {
      setSelectedCategory("all");
    }
  }, [serviceId]);

  // Filter + sort logic
  useEffect(() => {
    let temp = [...workers];

    if (serviceId) {
      temp = temp.filter((w) => String(w.service_id) === String(serviceId));
    }

    if (search) {
      temp = temp.filter(
        (w) =>
          (w.name || "").toLowerCase().includes(search.toLowerCase()) ||
          (w.service_name || "").toLowerCase().includes(search.toLowerCase()),
      );
    }

    if (selectedCategory !== "all") {
      temp = temp.filter(
        (w) => String(w.service_id) === String(selectedCategory),
      );
    }

    if (sort === "top") {
      temp.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sort === "price") {
      temp.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sort === "experience") {
      temp.sort((a, b) => (b.experience || 0) - (a.experience || 0));
    }

    setFilteredWorkers(temp);
  }, [workers, search, selectedCategory, sort, serviceId]);

  const toggleFavorite = async (workerId) => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    if (!user) {
      navigate("/login");
      return;
    }

    try {
      if (favorites.includes(workerId)) {
        await API.delete("/favorites", {
          headers: { Authorization: `Bearer ${token}` },
          data: { worker_id: workerId },
        });
        setFavorites(favorites.filter((id) => id !== workerId));
      } else {
        await API.post("/bookings", {
          worker_id: workerId,
          service_id: serviceId,
          location: "Default Location",
        });
        setFavorites([...favorites, workerId]);
      }
    } catch (err) {
      console.log(err);
    }
  };

  if (loading) {
    return (
      <div className="bg-[#28364D] min-h-screen flex items-center justify-center">
        <div className="text-[#EEF1F6]">Loading workers...</div>
      </div>
    );
  }

  return (
    <div className="bg-[#28364D] min-h-screen">
      {/* HEADER */}
      <div className="bg-gradient-to-r from-[#384B6B] to-[#7A3FE0] py-16 px-6">
        <h1 className="text-3xl md:text-4xl text-center text-[#EEF1F6] font-bold mb-8">
          Find Your Service Provider
        </h1>

        {/* SEARCH + SORT */}
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-4 mb-6">
          {/* Search */}
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search by name or service..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-white text-[#28364D] outline-none"
            />
            <span className="absolute right-3 top-3">🔍</span>
          </div>

          {/* Sort */}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="px-4 py-3 rounded-lg bg-[#486089] text-[#EEF1F6] font-semibold"
          >
            <option value="top">⭐ Top Rated</option>
            <option value="price">💰 Lowest Price</option>
            <option value="experience">📅 Most Experience</option>
          </select>
        </div>

        {/* CATEGORY FILTERS */}
        <div className="max-w-5xl mx-auto flex flex-wrap gap-3">
          {[
            { id: "all", name: "All Services" },
            { id: "1", name: "Plumbing" },
            { id: "2", name: "Electrical" },
            { id: "3", name: "Painting" },
            { id: "4", name: "Cleaning" },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full transition ${
                selectedCategory === cat.id
                  ? "bg-white text-[#7A3FE0] font-semibold"
                  : "bg-[#486089] text-[#EEF1F6] hover:bg-[#5875A7]"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* WORKERS LIST */}
      <div className="px-6 py-16">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredWorkers.length > 0 ? (
            filteredWorkers.map((worker) => (
              <div
                key={worker.id}
                className="bg-[#384B6B] border border-[#5875A7] rounded-2xl overflow-hidden hover:shadow-lg transition"
              >
                {/* Image */}
                <div className="relative bg-[#486089]">
                  <img
                    src={
                      workerAvatars[worker.image?.split("/").pop()] ||
                      worker.image
                    }
                    alt={worker.name}
                    className="w-full h-48 object-cover"
                  />
                  <button
                    onClick={() => toggleFavorite(worker.id)}
                    className={`absolute top-3 right-3 text-2xl transition ${
                      favorites.includes(worker.id)
                        ? "text-red-500"
                        : "text-[#B2C0D7]"
                    }`}
                  >
                    ♥
                  </button>
                </div>

                {/* Info */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-[#EEF1F6] mb-1">
                    {worker.name}
                  </h3>
                  <p className="text-[#7A3FE0] font-semibold mb-3">
                    {worker.service_name || "Service Provider"}
                  </p>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-3">
                    <span>⭐</span>
                    <span className="text-[#EEF1F6] font-bold">
                      {worker.rating || 4.5}
                    </span>
                    <span className="text-[#B2C0D7] text-sm">
                      ({worker.reviews_count || 0})
                    </span>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-2 mb-4 pb-4 border-b border-[#5875A7]">
                    <div>
                      <p className="text-[#B2C0D7] text-xs">Experience</p>
                      <p className="text-[#EEF1F6] font-bold">
                        {worker.experience || 0} yrs
                      </p>
                    </div>
                    <div>
                      <p className="text-[#B2C0D7] text-xs">Jobs Done</p>
                      <p className="text-[#EEF1F6] font-bold">
                        {worker.jobs_completed || 0}
                      </p>
                    </div>
                  </div>

                  {/* Price & Buttons */}
                  <div className="mb-4">
                    <p className="text-2xl font-bold text-[#7A3FE0] mb-3">
                      ₹{worker.price || "N/A"}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/worker/${worker.id}`)}
                      className="flex-1 bg-gradient-to-r from-[#7A3FE0] to-[#5875A7] text-[#EEF1F6] py-2 rounded-lg font-semibold hover:shadow-lg transition"
                    >
                      View Profile
                    </button>
                    <button
                      onClick={() => navigate(`/worker/${worker.id}`)}
                      className="flex-1 bg-[#486089] text-[#EEF1F6] py-2 rounded-lg font-semibold hover:bg-[#5875A7] transition"
                    >
                      Book
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-[#B2C0D7] text-lg mb-4">No workers found.</p>
              <button
                onClick={() => {
                  setSearch("");
                  setSelectedCategory("all");
                }}
                className="bg-[#7A3FE0] text-[#EEF1F6] px-6 py-2 rounded-lg font-semibold"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
