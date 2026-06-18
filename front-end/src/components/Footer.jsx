import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-[#FFFFFF] text-[#666666] px-6 py-6 mt-10 border-t border-[#D0D7DE]">
      
      <div className="flex flex-col md:flex-row justify-between items-center text-sm">

        {/* Left */}
        <div className="mb-3 md:mb-0">
          © {new Date().getFullYear()} Karigo
        </div>

        {/* Right */}
        <div className="flex space-x-6">
          <Link to="/privacy" className="hover:text-[#0A66C2] cursor-pointer transition">
            Privacy
          </Link>

          <Link to="/terms" className="hover:text-[#0A66C2] cursor-pointer transition">
            Terms
          </Link>
        </div>

      </div>
    </footer>
  );
}
