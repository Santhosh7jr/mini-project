import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import { fallbackWorkerImage, resolveWorkerImage } from "../utils/workerImages";

export default function WorkerCard({ worker }) {
  const [liked, setLiked] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    checkFavorite();
  }, [worker.id]);

  const checkFavorite = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return;

    try {
      const res = await API.get(`/favorites/check/${worker.id}`);
      setLiked(res.data.isFavorite);
    } catch (err) {
      console.log(err);
    }
  };

  const toggleLike = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    if (!user) {
      navigate("/login");
      return;
    }

    try {
      if (liked) {
        await API.delete("/favorites", {
          data: { worker_id: worker.id },
        });
      } else {
        await API.post("/favorites", {
          worker_id: worker.id,
        });
      }
      setLiked(!liked);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="bg-[#FFFFFF] border border-[#D0D7DE] rounded-2xl overflow-hidden hover:bg-[#EAF4FD] transition">
      {/* Image */}
      <div className="relative overflow-hidden group">
        <img
          src={resolveWorkerImage(worker)}
          alt={worker.name}
          className="w-full h-48 object-cover transform transition duration-500 group-hover:scale-110 bg-[#EAF4FD]"
          onError={(e) => {
            e.currentTarget.src = fallbackWorkerImage;
          }}
        />

        {/* Available */}
        {worker.available && (
          <span className="absolute top-3 right-3 bg-[#057642] text-white text-xs px-3 py-1 rounded-full">
            ✓ Available
          </span>
        )}

        {/* ❤️ Like (Top Rated Only) */}
        {worker.rating >= 4.5 && (
          <button
            onClick={toggleLike}
            className="absolute top-3 left-3 text-xl bg-[#E9E5DF]/70 backdrop-blur px-2 py-1 rounded-full transition transform hover:scale-110"
          >
            <span className={liked ? "text-[#B24020]" : "text-[#666666]"}>❤️</span>
          </button>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-lg font-semibold text-[#191919]">{worker.name}</h3>

        <p className="text-sm text-[#0A66C2] font-semibold">
          {worker.service_name || "Service Provider"}
        </p>

        <div className="flex items-center gap-2 mt-3 text-sm text-[#191919]">
          ⭐ {worker.rating || 4.5} ({worker.reviews_count || 0} reviews)
        </div>

        <div className="text-sm text-[#666666] mt-2">
          📅 {worker.experience || 0} years experience •{" "}
          {worker.jobs_completed || 0} jobs done
        </div>

        <div className="bg-[#E9E5DF] rounded-lg p-3 mt-4 border border-[#D0D7DE]">
          <span className="text-xl font-semibold text-[#191919]">
            ₹{worker.price || "N/A"}
          </span>
          <span className="text-sm text-[#666666] ml-2">per service</span>
        </div>

        <div className="flex gap-3 mt-5">
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
  );
}
