import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
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
    <div className="bg-[#384B6B] border border-[#5875A7] rounded-2xl overflow-hidden hover:bg-[#486089] transition">
      {/* Image */}
      <div className="relative overflow-hidden group">
        <img
          src={workerAvatars[worker.image?.split("/").pop()] || worker.image}
          alt={worker.name}
          className="w-full h-48 object-cover transform transition duration-500 group-hover:scale-110 bg-[#486089]"
        />

        {/* Available */}
        {worker.available && (
          <span className="absolute top-3 right-3 bg-green-500 text-white text-xs px-3 py-1 rounded-full">
            ✓ Available
          </span>
        )}

        {/* ❤️ Like (Top Rated Only) */}
        {worker.rating >= 4.5 && (
          <button
            onClick={toggleLike}
            className="absolute top-3 left-3 text-xl bg-[#28364D]/70 backdrop-blur px-2 py-1 rounded-full transition transform hover:scale-110"
          >
            <span className={liked ? "text-red-500" : "text-white"}>❤️</span>
          </button>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-lg font-semibold text-[#EEF1F6]">{worker.name}</h3>

        <p className="text-sm text-[#7A3FE0] font-semibold">
          {worker.service_name || "Service Provider"}
        </p>

        <div className="flex items-center gap-2 mt-3 text-sm text-[#EEF1F6]">
          ⭐ {worker.rating || 4.5} ({worker.reviews_count || 0} reviews)
        </div>

        <div className="text-sm text-[#B2C0D7] mt-2">
          📅 {worker.experience || 0} years experience •{" "}
          {worker.jobs_completed || 0} jobs done
        </div>

        <div className="bg-[#28364D] rounded-lg p-3 mt-4 border border-[#5875A7]">
          <span className="text-xl font-semibold text-[#EEF1F6]">
            ₹{worker.price || "N/A"}
          </span>
          <span className="text-sm text-[#B2C0D7] ml-2">per service</span>
        </div>

        <div className="flex gap-3 mt-5">
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
  );
}
