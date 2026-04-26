import { useEffect, useState } from "react";
import API from "../api/axios";

export default function AdminDashboard() {

  const [workers, setWorkers] = useState([]);

  useEffect(() => {
    fetchWorkers();
  });

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
    try{
      await API.delete(`/workers/${id}`);
      fetchWorkers();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Panel</h1>

      {workers.map((worker) => (
        <div key={worker.id} className="border p-4 mb-3 rounded shadow">
          <h2 className="font-semibold">{worker.name}</h2>

          <p>Experience: {worker.experience} years</p>
          <p>Rating: {worker.rating}</p>

          <p>
            Status:{" "}
            {worker.is_approved ? "Approved" : "Pending"}
          </p>

          <div className="mt-2 space-x-2">
            {!worker.is_approved && (
              <button
                onClick={() => approveWorker(worker.id)}
                className="bg-green-500 text-white px-3 py-1"
              >
                Approve
              </button>
            )}

            <button
              onClick={() => deleteWorker(worker.id)}
              className="bg-red-500 text-white px-3 py-1"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );

}