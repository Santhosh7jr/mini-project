import { useEffect, useState } from "react";
import API from "../api/axios";
import { useParams } from "react-router-dom";
import WorkerCard from "../components/WorkerCard";

export default function FindWorkers() {
  const [workers, setWorkers] = useState([]);
  const [filteredWorkers, setFilteredWorkers] = useState([]);

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sort, setSort] = useState("top");

  const { serviceId } = useParams();

  // 🔄 Fetch workers
  useEffect(() => {
    fetchWorkers();
  }, []);

  const fetchWorkers = async () => {
    try {
      const res = await API.get("/workers");
      setWorkers(res.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  // 🔥 Optional: auto-select category based on serviceId
  useEffect(() => {
    if (serviceId) {
      const map = {
        1: "plumbing",
        2: "electrician",
        3: "painting",
        4: "cleaning",
      };

      setSelectedCategory(map[serviceId] || "all");
    } else {
      setSelectedCategory("all");
    }
  }, [serviceId]);

  // 🔍 FILTER + SORT LOGIC
  useEffect(() => {
    let temp = [...workers];

    // ✅ Filter by serviceId
    if (serviceId) {
      temp = temp.filter(
        (w) => String(w.serviceId) === String(serviceId)
      );
    }

    // 🔍 Search
    if (search) {
      temp = temp.filter((w) =>
        (w.name || "").toLowerCase().includes(search.toLowerCase()) ||
        (w.skill || "").toLowerCase().includes(search.toLowerCase())
      );
    }

    // 📂 Category filter
    if (selectedCategory !== "all") {
      temp = temp.filter(
        (w) => (w.service || "").toLowerCase() === selectedCategory
      );
    }

    // 🔽 Sorting
    if (sort === "top") {
      temp.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sort === "price") {
      temp.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sort === "experience") {
      temp.sort((a, b) => (b.experience || 0) - (a.experience || 0));
    }

    setFilteredWorkers(temp);
  }, [workers, search, selectedCategory, sort, serviceId]);

  return (
    <div className="bg-[#28364D] min-h-screen">

      {/* 🔥 HEADER */}
      <div className="bg-gradient-to-r from-[#384B6B] to-[#7A3FE0] py-16 px-6">

        <h1 className="text-3xl md:text-4xl text-center text-white font-semibold mb-8">
          Find Your Service Provider
        </h1>

        {/* 🔍 SEARCH + SORT */}
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-4">

          {/* Search */}
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search by name, skill, or specialty..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-white text-black outline-none"
            />
            <span className="absolute right-3 top-3">🔍</span>
          </div>

          {/* Sort */}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="px-4 py-3 rounded-lg bg-[#486089] text-white"
          >
            <option value="top">⭐ Top Rated</option>
            <option value="price">💰 Lowest Price</option>
            <option value="experience">📅 Most Experience</option>
          </select>

        </div>

        {/* 📂 CATEGORY FILTERS */}
        <div className="max-w-5xl mx-auto mt-6 flex flex-wrap gap-3">

          {["all", "plumbing", "electrician", "painting", "cleaning"].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full transition ${
                selectedCategory === cat
                  ? "bg-white text-[#28364D]"
                  : "bg-[#486089] text-white hover:bg-[#5875A7]"
              }`}
            >
              {cat === "all" ? "All Services" : cat}
            </button>
          ))}

        </div>
      </div>

      {/* 🔥 WORKERS LIST */}
      <div className="px-6 py-16">

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">

          {filteredWorkers.length > 0 ? (
            filteredWorkers.map((worker) => (
              <WorkerCard key={worker.id} worker={worker} />
            ))
          ) : (
            <p className="text-center text-[#B2C0D7] col-span-full">
              No workers found.
            </p>
          )}

        </div>

      </div>
    </div>
  );
}