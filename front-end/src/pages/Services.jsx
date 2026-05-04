import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

// LOCAL IMAGES
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

export default function Services() {
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
    <div className="bg-[#28364D] min-h-screen px-6 py-16">
      {/* HEADER */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-[#EEF1F6] mb-3">
          Our Services
        </h1>
        <p className="text-[#B2C0D7] text-lg max-w-2xl mx-auto">
          Professional services from trusted experts. Browse our comprehensive
          range of offerings.
        </p>
      </div>

      {/* SERVICES GRID */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
        {services.map((service) => {
          const image = serviceImages[service.id];

          return (
            <div
              key={service.id}
              className="
                group
                bg-[#384B6B]
                border border-[#5875A7]
                rounded-2xl overflow-hidden
                transition duration-300
                hover:border-[#7A3FE0]
                hover:shadow-2xl
                hover:-translate-y-2
                flex flex-col h-full
              "
            >
              {/* IMAGE CONTAINER */}
              <div className="relative w-full h-64 overflow-hidden bg-[#486089]">
                <img
                  src={image}
                  alt={service.name}
                  className="
                    w-full h-full object-cover
                    transition duration-500
                    group-hover:scale-110
                  "
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#28364D] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-300"></div>
              </div>

              {/* CONTENT */}
              <div className="p-6 flex-1 flex flex-col">
                <h2 className="text-2xl font-bold text-[#EEF1F6] mb-3">
                  {service.name}
                </h2>

                <p className="text-[#B2C0D7] text-sm mb-4 flex-1">
                  {service.description ||
                    "Professional service tailored to your needs"}
                </p>

                {/* FEATURES */}
                <ul className="grid grid-cols-1 gap-2 text-sm text-[#B2C0D7] mb-5">
                  {(
                    service.features || [
                      "Verified professionals",
                      "Affordable pricing",
                      "Quick service",
                      "Trusted by users",
                    ]
                  )
                    .slice(0, 3)
                    .map((item, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="text-[#7A3FE0] font-bold">✓</span>
                        <span>{item}</span>
                      </li>
                    ))}
                </ul>

                {/* STATS */}
                <div className="grid grid-cols-3 gap-3 mb-5 text-center py-3 border-y border-[#486089]">
                  <div>
                    <p className="text-[#7A3FE0] font-bold text-lg">⭐</p>
                    <p className="text-[#EEF1F6] text-xs font-medium">
                      {service.rating || "4.5"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[#7A3FE0] font-bold text-lg">👥</p>
                    <p className="text-[#EEF1F6] text-xs font-medium">
                      {service.count || "100+"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[#7A3FE0] font-bold text-lg">₹</p>
                    <p className="text-[#EEF1F6] text-xs font-medium">
                      {service.price || "500+"}
                    </p>
                  </div>
                </div>

                {/* BUTTON */}
                <button
                  onClick={() => navigate(`/find-workers/${service.id}`)}
                  className="
                    w-full
                    bg-gradient-to-r from-[#7A3FE0] to-[#5875A7]
                    text-white font-semibold py-3 px-4 rounded-lg
                    hover:from-[#9D5BFF] hover:to-[#7A94B8]
                    hover:shadow-lg
                    transition duration-200
                    transform
                  "
                >
                  Browse Professionals →
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* WHY SECTION */}
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#EEF1F6] mb-3">
            Why Choose Karigo?
          </h2>
          <p className="text-[#B2C0D7] text-lg">
            Experience the difference with our platform
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-[#384B6B] border border-[#5875A7] rounded-xl p-8 text-center hover:border-[#7A3FE0] transition group cursor-pointer hover:-translate-y-1">
            <div className="text-5xl mb-4 group-hover:scale-110 transition">
              ✔️
            </div>
            <p className="text-white font-bold text-lg mb-2">Verified</p>
            <p className="text-[#B2C0D7] text-sm">
              All professionals are thoroughly verified and vetted
            </p>
          </div>

          <div className="bg-[#384B6B] border border-[#5875A7] rounded-xl p-8 text-center hover:border-[#7A3FE0] transition group cursor-pointer hover:-translate-y-1">
            <div className="text-5xl mb-4 group-hover:scale-110 transition">
              ⭐
            </div>
            <p className="text-white font-bold text-lg mb-2">Quality</p>
            <p className="text-[#B2C0D7] text-sm">
              Guaranteed quality service with proven track records
            </p>
          </div>

          <div className="bg-[#384B6B] border border-[#5875A7] rounded-xl p-8 text-center hover:border-[#7A3FE0] transition group cursor-pointer hover:-translate-y-1">
            <div className="text-5xl mb-4 group-hover:scale-110 transition">
              🛡️
            </div>
            <p className="text-white font-bold text-lg mb-2">Secure</p>
            <p className="text-[#B2C0D7] text-sm">
              Your data and transactions are completely safe
            </p>
          </div>

          <div className="bg-[#384B6B] border border-[#5875A7] rounded-xl p-8 text-center hover:border-[#7A3FE0] transition group cursor-pointer hover:-translate-y-1">
            <div className="text-5xl mb-4 group-hover:scale-110 transition">
              ⏱️
            </div>
            <p className="text-white font-bold text-lg mb-2">Fast</p>
            <p className="text-[#B2C0D7] text-sm">
              Quick response and booking within minutes
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
