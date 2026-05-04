import { useEffect, useState } from "react";
import API from "../api/axios";

export default function AdminDashboard() {
  const [workers, setWorkers] = useState([]);

  useEffect(() => {
    fetchWorkers();
  }, []);

  const fetchWorkers = async () => {
    try {
      const res = await API.get("/workers");
      setWorkers(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const approveWorker = async (id) => {
    try {
      await API.patch(`/workers/approve/${id}`);
      fetchWorkers();
    } catch (err) {
      console.log(err);
    }
  };

  const deleteWorker = async (id) => {
    try {
      await API.delete(`/workers/${id}`);
      fetchWorkers();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="bg-[#28364D] min-h-screen px-6 py-16">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-[#EEF1F6]">
            🛡️ Admin Panel
          </h1>
          <p className="text-[#B2C0D7] mt-2">
            Manage and approve service providers
          </p>
        </div>

        {/* Workers List */}
        {workers.length === 0 ? (
          <div className="bg-[#384B6B] rounded-2xl border border-[#5875A7] p-12 text-center">
            <p className="text-[#B2C0D7] text-lg">No workers to manage</p>
          </div>
        ) : (
          <div className="space-y-4">
            {workers.map((worker) => (
              <div
                key={worker.id}
                className="bg-[#384B6B] rounded-xl border border-[#5875A7] p-6 hover:border-[#7A3FE0] transition"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  {/* Worker Info */}
                  <div className="flex-1">
                    <h2 className="text-lg font-semibold text-[#EEF1F6]">
                      👷 {worker.name}
                    </h2>
                    <div className="grid grid-cols-3 gap-4 mt-3 text-sm">
                      <div>
                        <p className="text-[#B2C0D7]">Experience</p>
                        <p className="text-[#EEF1F6] font-semibold">
                          {worker.experience || 0} years
                        </p>
                      </div>
                      <div>
                        <p className="text-[#B2C0D7]">Rating</p>
                        <p className="text-[#EEF1F6] font-semibold">
                          ⭐ {worker.rating || 0}
                        </p>
                      </div>
                      <div>
                        <p className="text-[#B2C0D7]">Status</p>
                        <p
                          className={`font-semibold ${
                            worker.is_approved
                              ? "text-green-400"
                              : "text-yellow-400"
                          }`}
                        >
                          {worker.is_approved ? "✓ Approved" : "⏳ Pending"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 flex-wrap md:flex-nowrap">
                    {!worker.is_approved && (
                      <button
                        onClick={() => approveWorker(worker.id)}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition"
                      >
                        ✓ Approve
                      </button>
                    )}
                    <button
                      onClick={() => deleteWorker(worker.id)}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition"
                    >
                      🗑️ Delete
                    </button>
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
