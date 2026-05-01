import { useNavigate } from "react-router-dom";
import { workers } from "../data/workers";
import WorkerCard from "../components/WorkerCard";
import { bestValueWorkers } from "../data/workers";
import API from "../api/axios";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="bg-[#28364D] min-h-screen">
      {/* HERO */}
      <div className="bg-[#384B6B] text-[#EEF1F6] py-28 px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight mb-6">
          Find Your Perfect Service
        </h1>

        <p className="text-[#B2C0D7] max-w-xl mx-auto mb-10 text-lg">
          Connect with verified professionals near you. Fast, reliable, and
          hassle-free.
        </p>

        <div className="flex justify-center gap-4 flex-wrap">
          <button
            onClick={() => navigate("/services")}
            className="bg-[#EEF1F6] text-[#28364D] px-6 py-2 rounded-full font-medium hover:bg-[#D0D8E6] transition"
          >
            Browse Services
          </button>

          <button className="border border-[#5875A7] px-6 py-2 rounded-full text-[#B2C0D7] hover:bg-[#486089] hover:text-[#EEF1F6] transition">
            Learn More
          </button>
        </div>
      </div>

      {/* STATS */}
      <div className="bg-[#486089] py-16 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { value: "500+", label: "Workers" },
            { value: "10k+", label: "Jobs Done" },
            { value: "4.8★", label: "Rating" },
            { value: "24/7", label: "Support" },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-[#384B6B] border border-[#5875A7] rounded-xl py-6 px-4 text-center transition hover:bg-[#5875A7]"
            >
              <h2 className="text-xl md:text-2xl font-semibold text-[#EEF1F6]">
                {item.value}
              </h2>

              <p className="text-sm text-[#B2C0D7] mt-1">{item.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* HOW IT WORKS */}
      <div className="bg-[#28364D] py-20 px-6">
        <h2 className="text-2xl md:text-3xl font-semibold text-[#EEF1F6] text-center mb-12">
          How It Works
        </h2>

        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              step: "1",
              title: "Search",
              desc: "Find the perfect service provider for your needs",
            },
            {
              step: "2",
              title: "Book",
              desc: "Schedule a time that works for you",
            },
            {
              step: "3",
              title: "Complete",
              desc: "Enjoy quality service with guarantee",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-[#384B6B] border border-[#5875A7] rounded-xl p-6 text-center transition hover:bg-[#5875A7]"
            >
              <h3 className="text-3xl font-bold text-[#EEF1F6] mb-3">
                {item.step}
              </h3>

              <h4 className="text-lg font-semibold text-[#EEF1F6]">
                {item.title}
              </h4>

              <p className="text-sm text-[#B2C0D7] mt-2">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="h-5 bg-white" />

      {/* TOP WORKERS */}
      <div className="bg-[#28364D] py-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-2xl md:text-3xl font-semibold text-[#EEF1F6]">
                ⭐ Top Rated Workers
              </h2>
              <p className="text-[#B2C0D7] mt-1">
                Handpicked professionals with excellent reviews
              </p>
            </div>

            <button className="bg-[#486089] text-[#EEF1F6] px-5 py-2 rounded-lg hover:bg-[#5875A7] transition">
              View All
            </button>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {workers.map((worker) => (
              <WorkerCard key={worker.id} worker={worker} />
            ))}
          </div>
        </div>
      </div>

      <div className="h-5 bg-white" />

      {/* BEST VALUE */}
      <div className="bg-[#28364D] py-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-2xl md:text-3xl font-semibold text-[#EEF1F6]">
                💰 Best Value
              </h2>
              <p className="text-[#B2C0D7] mt-1">
                Premium quality at the best prices
              </p>
            </div>

            <button className="bg-[#486089] text-[#EEF1F6] px-5 py-2 rounded-lg hover:bg-[#5875A7] transition">
              View All
            </button>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {bestValueWorkers.map((worker) => (
              <WorkerCard key={worker.id} worker={worker} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
