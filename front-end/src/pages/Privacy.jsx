export default function Privacy() {
  return (
    <div className="bg-[#E9E5DF] min-h-screen px-6 py-16">
      <div className="max-w-4xl mx-auto bg-[#FFFFFF] border border-[#D0D7DE] rounded-2xl p-8 shadow-md">
        <h1 className="text-3xl md:text-4xl font-bold text-[#191919] mb-4">
          Privacy Policy
        </h1>
        <p className="text-[#666666] mb-8">
          Karigo respects your privacy and protects the information you share
          while using the platform.
        </p>

        <div className="space-y-6 text-[#666666]">
          <section>
            <h2 className="text-xl font-semibold text-[#191919] mb-2">
              Information We Collect
            </h2>
            <p>
              We collect account details such as your name, email, phone number,
              role, profile image, booking details, and service-related
              information needed to connect customers with workers.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#191919] mb-2">
              How We Use Information
            </h2>
            <p>
              Your information is used to create and manage accounts, process
              bookings, display worker profiles, manage favorites, and improve
              the service experience.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#191919] mb-2">
              Data Sharing
            </h2>
            <p>
              Booking and profile information may be shared between customers,
              workers, and administrators only where needed to provide the
              requested service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#191919] mb-2">
              Account Security
            </h2>
            <p>
              Passwords are stored securely. You should use a strong password
              and avoid sharing your login details with others.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
