import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function WorkerCard({ worker }) {
  const [liked, setLiked] = useState(false);
  const navigate = useNavigate();

  // Load liked state from localStorage
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("favorites")) || [];
    setLiked(stored.includes(worker.id));
  }, [worker.id]);

  const toggleLike = () => {
    let stored = JSON.parse(localStorage.getItem("favorites")) || [];

    if (stored.includes(worker.id)) {
      stored = stored.filter((id) => id !== worker.id);
      setLiked(false);
    } else {
      stored.push(worker.id);
      setLiked(true);
    }

    localStorage.setItem("favorites", JSON.stringify(stored));
  };

  return (
    <div className="bg-[#384B6B] border border-[#5875A7] rounded-2xl overflow-hidden hover:bg-[#486089] transition">
      {/* Image */}
      <div className="relative overflow-hidden group">
        <img
          src={worker.image}
          alt={worker.name}
          className="w-full h-48 object-cover transform transition duration-500 group-hover:scale-110"
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

        <p className="text-sm text-[#B2C0D7] mt-1">
          {worker.role} with {worker.experience} years of experience.
        </p>

        <p className="text-sm text-[#B2C0D7] mt-2">{worker.description}</p>

        <div className="flex items-center gap-2 mt-3 text-sm text-[#EEF1F6]">
          ⭐ {worker.rating} ({worker.reviews} reviews)
        </div>

        <div className="text-sm text-[#B2C0D7] mt-2">
          📅 {worker.experience} years experience
        </div>

        <div className="bg-[#28364D] rounded-lg p-3 mt-4 border border-[#5875A7]">
          <span className="text-xl font-semibold text-[#EEF1F6]">
            ₹{worker.price}
          </span>
          <span className="text-sm text-[#B2C0D7] ml-2">per service</span>
        </div>

        <div className="flex gap-3 mt-5">
          <button
            onClick={() => navigate(`/worker/${worker.id}`)}
            className="flex-1 bg-[#EEF1F6] text-[#28364D] py-2 rounded-lg hover:bg-[#D0D8E6] transition"
          >
            View Profile
          </button>

          <button className="flex-1 border border-[#5875A7] text-[#EEF1F6] py-2 rounded-lg hover:bg-[#486089] transition">
            Book
          </button>
        </div>
      </div>
    </div>
  );
}
