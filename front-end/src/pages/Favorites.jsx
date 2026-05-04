import { useEffect, useState } from "react";
import API from "../api/axios";
import WorkerCard from "../components/WorkerCard";
import { useNavigate } from "react-router-dom";

export default function Favorites() {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [removingId, setRemovingId] = useState(null);

  const navigate = useNavigate();

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const res = await API.get("/favorites/my");
      setWorkers(res.data);
    } catch (err) {
      setError("Failed to load favorites");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  // 🔥 REMOVE FAVORITE (Optimistic UI)
  const removeFavorite = async (workerId) => {
    setRemovingId(workerId);

    // instant UI update
    setWorkers((prev) => prev.filter((w) => w.id !== workerId));

    try {
      await API.delete("/favorites", {
        data: { worker_id: workerId },
      });
    } catch (err) {
      console.log(err);
      fetchFavorites(); // rollback if failed
    } finally {
      setRemovingId(null);
    }
  };

  // 🔹 LOADING
  if (loading) {
    return (
      <div className="bg-[#1e293b] min-h-screen flex items-center justify-center text-white text-lg">
        ⏳ Loading your favorites...
      </div>
    );
  }

  // 🔹 ERROR
  if (error) {
    return (
      <div className="bg-[#1e293b] min-h-screen flex items-center justify-center text-red-400 text-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-[#1e293b] to-[#0f172a] min-h-screen px-6 py-16">
      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-white">
            ❤️ My Favorites
          </h1>
          <p className="text-gray-400 mt-2">
            Quickly access your saved professionals
          </p>
        </div>

        {/* EMPTY STATE */}
        {workers.length === 0 ? (
          <div className="bg-[#1e293b] border border-gray-700 rounded-2xl p-12 text-center shadow-md">
            <h2 className="text-xl text-white mb-3">
              No favorites yet
            </h2>
            <p className="text-gray-400 mb-6">
              Start exploring and save your favorite professionals
            </p>

            <button
              onClick={() => navigate("/find-workers")}
              className="bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded-lg text-white font-semibold transition"
            >
              🔍 Find Workers
            </button>
          </div>
        ) : (

          /* GRID */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {workers.map((worker) => (
              <div
                key={worker.id}
                className="relative group bg-[#1e293b] border border-gray-700 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
              >

                {/* REMOVE BUTTON */}
                <button
                  onClick={() => removeFavorite(worker.id)}
                  disabled={removingId === worker.id}
                  className="absolute top-3 right-3 z-10 bg-red-600 hover:bg-red-700 text-white px-3 py-1 text-xs rounded-full opacity-0 group-hover:opacity-100 transition"
                >
                  {removingId === worker.id ? "..." : "Remove"}
                </button>

                {/* WORKER CARD */}
                <WorkerCard worker={worker} />

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}