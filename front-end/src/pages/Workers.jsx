import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/axios";

export default function Workers() {
  const { serviceId } = useParams();
  const [workers, setWorkers] = useState([]);

  const handleBooking = async (workerId) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));

      await API.post("/bookings", {
        user_id: user.id,
        worker_id: workerId,
        service_id: serviceId,
        location: "Default Location",
      });

      alert("Booking created!");
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        const res = await API.get(`/workers/service/${serviceId}`);
        setWorkers(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchWorkers();
  }, [serviceId]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Workers</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {workers.map((worker) => (
          <div key={worker.id} className="border p-4 rounded shadow">
            <h2 className="text-lg font-semibold">{worker.name}</h2>
            <p>Experience: {worker.experience} years</p>
            <p>Rating: {worker.rating}</p>
            <button
              className="bg-blue-500 text-white px-3 py-1 mt-2"
              onClick={() => handleBooking(worker.id)}
            >
              Book
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
