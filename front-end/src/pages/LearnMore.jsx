import { useNavigate } from "react-router-dom";

export default function LearnMore() {
  const navigate = useNavigate();

  return (
    <div className="bg-[#28364D] min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#384B6B] to-[#9D4FE0] py-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-[#EEF1F6] mb-6">
            How Karigo Works
          </h1>
          <p className="text-[#B2C0D7] text-lg md:text-xl mb-8 max-w-3xl mx-auto">
            Connect with verified professionals in minutes. Book, pay, and get
            your work done hassle-free.
          </p>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-[#EEF1F6] text-center mb-12">
            Why Choose Karigo?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {[
              {
                icon: "✓",
                title: "Verified Professionals",
                desc: "All service providers are verified and have proven track records with authentic reviews from real customers.",
              },
              {
                icon: "⚡",
                title: "Fast & Reliable",
                desc: "Book services in minutes. Get matched with the best professional available in your area.",
              },
              {
                icon: "🛡️",
                title: "Secure & Safe",
                desc: "Your transactions are secure. We protect both customers and service providers with insurance coverage.",
              },
              {
                icon: "💰",
                title: "Transparent Pricing",
                desc: "No hidden charges. See exactly what you'll pay before booking. Compare prices easily.",
              },
              {
                icon: "📱",
                title: "Easy to Use",
                desc: "User-friendly app design. Book, track, and manage your services all in one place.",
              },
              {
                icon: "⭐",
                title: "Quality Guaranteed",
                desc: "Rate and review professionals. Only top-rated service providers stay on the platform.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-[#384B6B] border border-[#5875A7] rounded-xl p-6 text-center hover:shadow-lg transition"
              >
                <div className="text-4xl mb-3">{item.icon}</div>
                <h3 className="text-xl font-semibold text-[#EEF1F6] mb-2">
                  {item.title}
                </h3>
                <p className="text-[#B2C0D7]">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Step by Step */}
      <div className="bg-[#384B6B] px-6 py-16">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-[#EEF1F6] text-center mb-12">
            Get Started in 4 Easy Steps
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                step: "1",
                title: "Sign Up",
                desc: "Create your account in just 2 minutes with email and phone number.",
              },
              {
                step: "2",
                title: "Search Services",
                desc: "Browse our categories and find the service you need. Check ratings and reviews.",
              },
              {
                step: "3",
                title: "Book Professional",
                desc: "Select your preferred service provider, choose date and time, and confirm booking.",
              },
              {
                step: "4",
                title: "Get Work Done",
                desc: "Professional arrives on time. Track live, pay securely, and leave a review.",
              },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#9D4FE0] to-[#5875A7] flex items-center justify-center text-white font-bold text-2xl mb-4 mx-auto">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold text-[#EEF1F6] mb-2">
                  {item.title}
                </h3>
                <p className="text-[#B2C0D7] text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="px-6 py-16">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-[#9D4FE0] to-[#5875A7] rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold text-[#EEF1F6] mb-4">
            Ready to Experience Better Service?
          </h2>
          <p className="text-[#B2C0D7] mb-8 text-lg">
            Join thousands of satisfied customers. Book your first service
            today!
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => navigate("/find-workers")}
              className="bg-[#EEF1F6] text-[#28364D] px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition"
            >
              Find Service Providers
            </button>
            <button
              onClick={() => navigate("/")}
              className="border-2 border-[#EEF1F6] text-[#EEF1F6] px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition"
            >
              Go Back Home
            </button>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="px-6 py-16 bg-[#384B6B]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-[#EEF1F6] text-center mb-12">
            Frequently Asked Questions
          </h2>

          <div className="space-y-4">
            {[
              {
                q: "Is it safe to book on Karigo?",
                a: "Yes! All professionals are verified and background checked. We use secure payment processing and have insurance for all transactions.",
              },
              {
                q: "What if I need to cancel my booking?",
                a: "You can cancel up to 2 hours before the appointment. A service fee may apply depending on the cancellation time.",
              },
              {
                q: "How are prices determined?",
                a: "Prices are based on service type, duration, location, and professional's experience. You see the full price before confirming.",
              },
              {
                q: "Can I reschedule my booking?",
                a: "Yes! You can reschedule up to 24 hours before the appointment at no additional cost, subject to availability.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-[#28364D] border border-[#5875A7] rounded-lg p-6"
              >
                <h3 className="text-lg font-semibold text-[#EEF1F6] mb-2">
                  {item.q}
                </h3>
                <p className="text-[#B2C0D7]">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="px-6 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-[#EEF1F6] mb-6">Need Help?</h2>
          <p className="text-[#B2C0D7] text-lg mb-8">
            Our customer support team is available 24/7 to assist you.
          </p>
          <div className="flex flex-wrap justify-center gap-8">
            <div className="bg-[#384B6B] border border-[#5875A7] rounded-lg p-6 flex-1 min-w-[200px]">
              <div className="text-3xl mb-2">📞</div>
              <p className="text-[#B2C0D7] font-semibold">Call Us</p>
              <p className="text-[#EEF1F6] text-lg">7019827091</p>
            </div>
            <div className="bg-[#384B6B] border border-[#5875A7] rounded-lg p-6 flex-1 min-w-[200px]">
              <div className="text-3xl mb-2">📧</div>
              <p className="text-[#B2C0D7] font-semibold">Email Us</p>
              <p className="text-[#EEF1F6] text-lg">support@karigo.com</p>
            </div>
            <div className="bg-[#384B6B] border border-[#5875A7] rounded-lg p-6 flex-1 min-w-[200px]">
              <div className="text-3xl mb-2">💬</div>
              <p className="text-[#B2C0D7] font-semibold">Chat With Us</p>
              <p className="text-[#EEF1F6] text-lg">9 AM - 9 PM Daily</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
