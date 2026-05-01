export default function Footer() {
  return (
    <footer className="bg-black text-white/70 px-6 py-6 mt-10 border-t border-white/10">
      
      <div className="flex flex-col md:flex-row justify-between items-center text-sm">

        {/* Left */}
        <div className="mb-3 md:mb-0">
          © {new Date().getFullYear()} Karigo
        </div>

        {/* Right */}
        <div className="flex space-x-6">
          <span className="hover:text-white cursor-pointer transition">
            Privacy
          </span>

          <span className="hover:text-white cursor-pointer transition">
            Terms
          </span>
        </div>

      </div>
    </footer>
  );
}