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
      <div className="bg-[#FFFFFF] min-h-screen flex items-center justify-center text-[#191919] text-lg">
        ⏳ Loading your favorites...
      </div>
    );
  }

  // 🔹 ERROR
  if (error) {
    return (
      <div className="bg-[#FFFFFF] min-h-screen flex items-center justify-center text-[#B24020] text-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-[#E9E5DF] to-[#EAF4FD] min-h-screen px-6 py-16">
      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-[#191919]">
            ❤️ My Favorites
          </h1>
          <p className="text-[#666666] mt-2">
            Quickly access your saved professionals
          </p>
        </div>

        {/* EMPTY STATE */}
        {workers.length === 0 ? (
          <div className="bg-[#FFFFFF] border border-[#D0D7DE] rounded-2xl p-12 text-center shadow-md">
            <h2 className="text-xl text-[#191919] mb-3">
              No favorites yet
            </h2>
            <p className="text-[#666666] mb-6">
              Start exploring and save your favorite professionals
            </p>

            <button
              onClick={() => navigate("/find-workers")}
              className="bg-[#0A66C2] hover:bg-[#004182] px-6 py-2 rounded-lg text-white font-semibold transition"
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
                className="relative group bg-[#FFFFFF] border border-[#D0D7DE] rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
              >

                {/* REMOVE BUTTON */}
                <button
                  onClick={() => removeFavorite(worker.id)}
                  disabled={removingId === worker.id}
                  className="absolute top-3 right-3 z-10 bg-[#B24020] hover:bg-[#8F2C14] text-white px-3 py-1 text-xs rounded-full opacity-0 group-hover:opacity-100 transition"
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
