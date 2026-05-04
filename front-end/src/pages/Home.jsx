import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import WorkerCard from "../components/WorkerCard";
import API from "../api/axios";
import plumbingImg from "../assets/services/plumbing.svg";
import electricalImg from "../assets/services/electrical.svg";
import paintingImg from "../assets/services/painting.svg";
import cleaningImg from "../assets/services/cleaning.svg";
import carpentryImg from "../assets/services/carpentry.svg";
import hvacImg from "../assets/services/hvac.svg";
import vehicleImg from "../assets/services/vehicle.svg";
import securityImg from "../assets/services/security.svg";

const serviceImages = {
  1: plumbingImg,
  2: electricalImg,
  3: paintingImg,
  4: cleaningImg,
  5: carpentryImg,
  6: hvacImg,
  7: vehicleImg,
  8: securityImg,
};

export default function Home() {
  const navigate = useNavigate();

  const [services, setServices] = useState([]);
  const [topWorkers, setTopWorkers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({});

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("user"));
    setUser(u);

    const loadData = async () => {
      try {
        const [sRes, wRes] = await Promise.all([
          API.get("/services"),
          API.get("/workers"),
        ]);

        setServices(sRes.data || []);

        const sorted = (wRes.data || []).sort(
          (a, b) => (b.rating || 0) - (a.rating || 0)
        );

        setTopWorkers(sorted.slice(0, 6));

        // 🔥 ROLE BASED STATS
        if (u?.role === "worker") {
          const bRes = await API.get(`/bookings/worker/${u.id}`);
          setStats({ totalBookings: bRes.data.length });
        }

        if (u?.role === "admin") {
          setStats({ totalWorkers: wRes.data.length });
        }

      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <div className="bg-[#28364D] min-h-screen">

      {/* 🔥 ROLE BASED HEADER */}
      {user && (
        <div className="bg-[#28364D] px-6 pt-10 pb-4 max-w-7xl mx-auto">

          {/* USER */}
          {user.role === "user" && (
            <>
              <h1 className="text-3xl font-bold text-white">
                Welcome, {user.name}
              </h1>
              <p className="text-[#B2C0D7] mt-2">
                Find trusted professionals for your needs
              </p>
            </>
          )}

          {/* WORKER */}
          {user.role === "worker" && (
            <div className="bg-[#384B6B] p-6 rounded-xl border border-[#5875A7] mb-6">
              <h2 className="text-xl text-white mb-2">Worker Dashboard</h2>
              <p className="text-[#B2C0D7]">
                Total Bookings:{" "}
                <span className="text-[#EEF1F6] font-semibold">
                  {stats.totalBookings || 0}
                </span>
              </p>

              <button
                onClick={() => navigate("/worker")}
                className="mt-4 bg-[#7A3FE0] px-5 py-2 rounded-lg"
              >
                Go to Dashboard
              </button>
            </div>
          )}

          {/* ADMIN */}
          {user.role === "admin" && (
            <div className="bg-[#384B6B] p-6 rounded-xl border border-[#5875A7] mb-6">
              <h2 className="text-xl text-white mb-2">Admin Overview</h2>
              <p className="text-[#B2C0D7]">
                Total Workers:{" "}
                <span className="text-[#EEF1F6] font-semibold">
                  {stats.totalWorkers || 0}
                </span>
              </p>

              <button
                onClick={() => navigate("/admin")}
                className="mt-4 bg-[#7A3FE0] px-5 py-2 rounded-lg"
              >
                Open Admin Panel
              </button>
            </div>
          )}
        </div>
      )}

      {/* HERO */}
      <div className="bg-[#384B6B] text-[#EEF1F6] py-28 px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-semibold mb-6">
          Find Your Perfect Service
        </h1>

        <p className="text-[#B2C0D7] max-w-xl mx-auto mb-10 text-lg">
          Connect with verified professionals near you. Fast, reliable, and hassle-free.
        </p>

        <div className="flex justify-center gap-4 flex-wrap">
          <button
            onClick={() => navigate("/services")}
            className="bg-[#EEF1F6] text-[#28364D] px-6 py-2 rounded-full"
          >
            Browse Services
          </button>

          <button
            onClick={() => navigate("/learnmore")}
            className="border border-[#5875A7] px-6 py-2 rounded-full"
          >
            Learn More
          </button>
        </div>
      </div>

      {/* SERVICES */}
      <div className="py-16 px-6 max-w-7xl mx-auto">
        <h2 className="text-2xl text-white mb-6">Services</h2>

        {loading ? (
          <div className="text-white">Loading...</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {services.map((s) => (
              <button
                key={s.id}
                onClick={() => navigate(`/find-workers/${s.id}`)}
                className="bg-[#384B6B] p-6 rounded-xl"
              >
                <img src={serviceImages[s.id]} className="w-12 mx-auto mb-2" />
                <h3 className="text-white text-center">{s.name}</h3>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* TOP WORKERS */}
      <div className="py-20 px-6 max-w-7xl mx-auto">
        <h2 className="text-2xl text-white mb-8">⭐ Top Workers</h2>

        <div className="grid md:grid-cols-3 gap-8">
          {topWorkers.map((worker) => (
            <WorkerCard key={worker.id} worker={worker} />
          ))}
        </div>
      </div>
    </div>
  );
}