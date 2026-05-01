import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

export default function Services() {
  const [services, setServices] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const res = await API.get("/services");
      setServices(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="bg-[#28364D] min-h-screen px-6 py-16">
      {/* HEADER */}
      <div className="text-center mb-16">
        <h1 className="text-3xl md:text-4xl font-semibold text-[#EEF1F6]">
          Our Services
        </h1>
        <p className="text-[#B2C0D7] mt-2">
          Professional services from trusted and verified experts
        </p>
      </div>

      {/* SERVICES LIST */}
      <div className="max-w-6xl mx-auto space-y-10">
        {services.map((service, index) => (
          <div
            key={service.id}
            className="bg-[#384B6B] border border-[#5875A7] rounded-2xl overflow-hidden flex flex-col md:flex-row"
          >
            {/* TEXT CONTENT */}
            <div className={`p-6 flex-1 ${index % 2 !== 0 ? "order-2" : ""}`}>
              <h2 className="text-xl md:text-2xl font-semibold text-[#EEF1F6] mb-2">
                {service.name}
              </h2>

              <p className="text-[#B2C0D7] mb-4">
                {service.description ||
                  "Professional service tailored to your needs"}
              </p>

              {/* FEATURES (fallback if backend doesn't provide) */}
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-[#B2C0D7] mb-4">
                {(
                  service.features || [
                    "Verified professionals",
                    "Affordable pricing",
                    "Quick service",
                    "Trusted by users",
                  ]
                ).map((item, i) => (
                  <li key={i}>✔ {item}</li>
                ))}
              </ul>

              {/* STATS */}
              <div className="flex flex-wrap gap-4 text-sm text-[#EEF1F6] mb-4">
                <span>⭐ {service.rating || "4.5"}</span>
                <span>{service.count || "100+"} professionals</span>
                <span>{service.price || "₹500 - ₹2000"}</span>
              </div>

              {/* BUTTON */}
              <button
                onClick={() => navigate(`/workers/${service.id}`)}
                className="bg-[#486089] text-[#EEF1F6] px-5 py-2 rounded-lg hover:bg-[#5875A7] transition"
              >
                Browse Professionals →
              </button>
            </div>

            {/* IMAGE */}
            <div className={`flex-1 ${index % 2 !== 0 ? "order-1" : ""}`}>
              <img
                src={
                  service.image ||
                  "https://images.unsplash.com/photo-1581578731548-c64695cc6952"
                }
                alt={service.name}
                className="w-full h-64 md:h-full object-cover"
              />
            </div>
          </div>
        ))}
      </div>

      {/* WHY CHOOSE US */}
      <div className="mt-20">
        <div
          className="max-w-6xl mx-auto rounded-2xl p-10 
                  bg-gradient-to-r from-[#384B6B] via-[#486089] to-[#5875A7]"
        >
          {/* Title */}
          <h2 className="text-2xl md:text-3xl font-semibold text-[#EEF1F6] text-center mb-10">
            Why Choose Karigo?
          </h2>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            {/* Item */}
            <div>
              <div className="text-4xl mb-3">✔️</div>
              <h3 className="text-[#EEF1F6] font-semibold">
                Verified Professionals
              </h3>
              <p className="text-[#B2C0D7] text-sm mt-2">
                All professionals are background checked and verified
              </p>
            </div>

            <div>
              <div className="text-4xl mb-3">⭐</div>
              <h3 className="text-[#EEF1F6] font-semibold">
                Quality Guaranteed
              </h3>
              <p className="text-[#B2C0D7] text-sm mt-2">
                Satisfaction guarantee on all services
              </p>
            </div>

            <div>
              <div className="text-4xl mb-3">🛡️</div>
              <h3 className="text-[#EEF1F6] font-semibold">
                Secure Transactions
              </h3>
              <p className="text-[#B2C0D7] text-sm mt-2">
                Safe and encrypted payment processing
              </p>
            </div>

            <div>
              <div className="text-4xl mb-3">⏱️</div>
              <h3 className="text-[#EEF1F6] font-semibold">24/7 Support</h3>
              <p className="text-[#B2C0D7] text-sm mt-2">
                Round-the-clock customer support
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
