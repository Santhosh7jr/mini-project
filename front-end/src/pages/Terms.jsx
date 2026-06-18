export default function Terms() {
  return (
    <div className="bg-[#E9E5DF] min-h-screen px-6 py-16">
      <div className="max-w-4xl mx-auto bg-[#FFFFFF] border border-[#D0D7DE] rounded-2xl p-8 shadow-md">
        <h1 className="text-3xl md:text-4xl font-bold text-[#191919] mb-4">
          Terms of Service
        </h1>
        <p className="text-[#666666] mb-8">
          These terms describe the basic rules for using Karigo as a customer,
          worker, or administrator.
        </p>

        <div className="space-y-6 text-[#666666]">
          <section>
            <h2 className="text-xl font-semibold text-[#191919] mb-2">
              Platform Use
            </h2>
            <p>
              Users must provide accurate account information and use Karigo
              only for lawful service booking and worker management purposes.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#191919] mb-2">
              Bookings
            </h2>
            <p>
              Customers are responsible for entering correct booking details.
              Workers should respond professionally and keep booking statuses
              accurate.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#191919] mb-2">
              Worker Accounts
            </h2>
            <p>
              Worker access may require administrator approval. Karigo may
              reject or remove worker profiles that provide misleading
              information.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#191919] mb-2">
              User Responsibility
            </h2>
            <p>
              Users should treat others respectfully, avoid misuse of the
              platform, and keep their login credentials secure.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
