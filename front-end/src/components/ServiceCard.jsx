export default function ServiceCard({ service, reverse }) {
  return (
    <div className="bg-[#384B6B] border border-[#5875A7] rounded-2xl overflow-hidden flex flex-col md:flex-row">

      {/* LEFT / RIGHT CONTENT */}
      <div className={`p-6 flex-1 ${reverse ? "order-2" : ""}`}>

        <h2 className="text-xl font-semibold text-[#EEF1F6] mb-2">
          {service.title}
        </h2>

        <p className="text-[#B2C0D7] mb-4">
          {service.description}
        </p>

        {/* Features */}
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-[#B2C0D7] mb-4">
          {service.features.map((item, i) => (
            <li key={i}>✔ {item}</li>
          ))}
        </ul>

        {/* Stats */}
        <div className="flex gap-6 text-sm text-[#EEF1F6] mb-4">
          <span>⭐ {service.rating}</span>
          <span>{service.professionals}+ professionals</span>
          <span>{service.price}</span>
        </div>

        {/* Button */}
        <button className="bg-[#486089] text-[#EEF1F6] px-5 py-2 rounded-lg hover:bg-[#5875A7] transition">
          Browse Professionals →
        </button>
      </div>

      {/* IMAGE */}
      <div className={`flex-1 ${reverse ? "order-1" : ""}`}>
        <img
          src={service.image}
          alt={service.title}
          className="w-full h-full object-cover"
        />
      </div>

    </div>
  );
}