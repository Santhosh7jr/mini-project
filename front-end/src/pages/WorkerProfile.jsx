import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/axios";

export default function WorkerProfile() {
  const { id } = useParams();
  const [worker, setWorker] = useState(null);

  useEffect(() => {
    const fetchWorker = async () => {
      try {
        const res = await API.get(`/workers/${id}`);
        setWorker(res.data);
        console.log(worker);
      } catch (err) {
        console.log(err);
      }
    };
    fetchWorker();
  }, [id]);

  if (!worker) {
    return <div className="text-white p-10">Loading...</div>;
  }

  return (
    <div className="bg-[#28364D] min-h-screen">
      {/* HEADER */}
      <div className="bg-gradient-to-r from-[#384B6B] to-[#7A3FE0] px-6 py-12">
        <div className="max-w-6xl mx-auto flex gap-10 items-center">
          {/* IMAGE */}
          <div className="relative">
            <img
              src={worker.image}
              alt={worker.name}
              className="w-40 h-40 object-cover rounded-2xl border-4 border-white"
            />

            <span className="absolute bottom-2 left-2 bg-green-500 text-white px-3 py-1 rounded-full text-sm">
              ● Available
            </span>
          </div>

          {/* INFO */}
          <div className="text-white">
            <h1 className="text-4xl font-semibold">{worker.name}</h1>
            <p className="text-lg text-[#D0D8E6]">{worker.service}</p>
            <p className="text-sm mt-1">📍 {worker.location || "India"}</p>

            {/* STATS */}
            <div className="mt-6 flex gap-6">
              <div>
                ⭐ {worker.rating} ({worker.reviews} reviews)
              </div>
              <div>⏱ {worker.responseTime || "30 mins"}</div>
            </div>

            {/* CARDS */}
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="bg-[#384B6B] p-4 rounded-xl">
                <p className="text-sm text-[#B2C0D7]">Experience</p>
                <p className="text-xl font-semibold">
                  {worker.experience}+ yrs
                </p>
              </div>

              <div className="bg-[#384B6B] p-4 rounded-xl">
                <p className="text-sm text-[#B2C0D7]">Rate</p>
                <p className="text-xl font-semibold">₹{worker.price}</p>
              </div>

              <div className="bg-[#384B6B] p-4 rounded-xl">
                <p className="text-sm text-[#B2C0D7]">Jobs Done</p>
                <p className="text-xl font-semibold">{worker.jobs || 100}+</p>
              </div>
            </div>

            {/* BUTTONS */}
            <div className="mt-6 flex gap-4">
              <button className="bg-white text-[#28364D] px-6 py-2 rounded-full">
                📅 Book Now
              </button>

              <button className="border border-white px-6 py-2 rounded-full">
                📞 Call Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
