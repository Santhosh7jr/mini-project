import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

export default function Home() {
  const [services, setServices] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await API.get("/services");
        setServices(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchServices();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Services</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {services.map((service) => {
          return (
            <div
              key={service.id}
              onClick={() => navigate(`/workers/${service.id}`)}
              className="border p-4 rounded shadow hover:bg-gray-100 cursor-pointer"
            >
              <h2 className="text-lg">{service.name}</h2>
            </div>
          );
        })}
        <button
          onClick={() => navigate("/bookings")}
          className="mb-4 bg-green-500 text-white px-4 py-2"
        >
          My Bookings
        </button>
      </div>
    </div>
  );
}
