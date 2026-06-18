import { useEffect, useState } from "react";
import API from "../api/axios";
import { useParams, useNavigate } from "react-router-dom";
import { fallbackWorkerImage, resolveWorkerImage } from "../utils/workerImages";

const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch {
    return null;
  }
};

export default function FindWorkers() {
  const [workers, setWorkers] = useState([]);
  const [filteredWorkers, setFilteredWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sort, setSort] = useState("top");
  const [favorites, setFavorites] = useState([]);
  const [currentUser] = useState(getStoredUser);

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

  useEffect(() => {
    if (!currentUser || currentUser.role === "admin") {
      setFavorites([]);
      return;
    }

    const fetchFavorites = async () => {
      try {
        const res = await API.get("/favorites/my");
        setFavorites((res.data || []).map((worker) => worker.id));
      } catch (err) {
        console.log(err);
      }
    };

    fetchFavorites();
  }, [currentUser]);

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
    if (!currentUser) {
      navigate("/login");
      return;
    }

    if (currentUser.role === "admin") return;

    try {
      if (favorites.includes(workerId)) {
        await API.delete("/favorites", {
          data: { worker_id: workerId },
        });
        setFavorites(favorites.filter((id) => id !== workerId));
      } else {
        await API.post("/favorites", { worker_id: workerId });
        setFavorites([...favorites, workerId]);
      }
    } catch (err) {
      console.log(err);
    }
  };

  if (loading) {
    return (
      <div className="bg-[#E9E5DF] min-h-screen flex items-center justify-center">
        <div className="text-[#191919]">Loading workers...</div>
      </div>
    );
  }

  return (
    <div className="bg-[#E9E5DF] min-h-screen">
      {/* HEADER */}
      <div className="bg-gradient-to-r from-[#0A66C2] to-[#004182] py-16 px-6">
        <h1 className="text-3xl md:text-4xl text-center text-white font-bold mb-8">
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
              className="w-full px-4 py-3 rounded-lg bg-white text-[#191919] outline-none"
            />
            <span className="absolute right-3 top-3">🔍</span>
          </div>

          {/* Sort */}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="px-4 py-3 rounded-lg bg-[#EAF4FD] text-[#191919] font-semibold"
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
                  ? "bg-white text-[#0A66C2] font-semibold"
                  : "bg-[#EAF4FD] text-[#0A66C2] hover:bg-[#004182] hover:text-white"
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
                className="bg-[#FFFFFF] border border-[#D0D7DE] rounded-2xl overflow-hidden hover:shadow-lg transition"
              >
                {/* Image */}
                <div className="relative bg-[#EAF4FD]">
                  <img
                    src={resolveWorkerImage(worker)}
                    alt={worker.name}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      e.currentTarget.src = fallbackWorkerImage;
                    }}
                  />
                  {currentUser?.role !== "admin" && (
                    <button
                      onClick={() => toggleFavorite(worker.id)}
                      className={`absolute top-3 right-3 text-2xl transition ${
                        favorites.includes(worker.id)
                          ? "text-[#B24020]"
                          : "text-[#666666]"
                      }`}
                    >
                      ♥
                    </button>
                  )}
                </div>

                {/* Info */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-[#191919] mb-1">
                    {worker.name}
                  </h3>
                  <p className="text-[#0A66C2] font-semibold mb-3">
                    {worker.service_name || "Service Provider"}
                  </p>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-3">
                    <span>⭐</span>
                    <span className="text-[#191919] font-bold">
                      {worker.rating || 4.5}
                    </span>
                    <span className="text-[#666666] text-sm">
                      ({worker.reviews_count || 0})
                    </span>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-2 mb-4 pb-4 border-b border-[#D0D7DE]">
                    <div>
                      <p className="text-[#666666] text-xs">Experience</p>
                      <p className="text-[#191919] font-bold">
                        {worker.experience || 0} yrs
                      </p>
                    </div>
                    <div>
                      <p className="text-[#666666] text-xs">Jobs Done</p>
                      <p className="text-[#191919] font-bold">
                        {worker.jobs_completed || 0}
                      </p>
                    </div>
                  </div>

                  {/* Price & Buttons */}
                  <div className="mb-4">
                    <p className="text-2xl font-bold text-[#0A66C2] mb-3">
                      ₹{worker.price || "N/A"}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/worker/${worker.id}`)}
                      className="flex-1 bg-gradient-to-r from-[#0A66C2] to-[#004182] text-white py-2 rounded-lg font-semibold hover:shadow-lg transition"
                    >
                      View Profile
                    </button>
                    <button
                      onClick={() => navigate(`/worker/${worker.id}`)}
                      className="flex-1 bg-[#EAF4FD] text-[#0A66C2] py-2 rounded-lg font-semibold hover:bg-[#004182] hover:text-white transition"
                    >
                      Book
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-[#666666] text-lg mb-4">No workers found.</p>
              <button
                onClick={() => {
                  setSearch("");
                  setSelectedCategory("all");
                }}
                className="bg-[#0A66C2] text-white px-6 py-2 rounded-lg font-semibold"
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
