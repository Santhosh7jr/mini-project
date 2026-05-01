import { useEffect, useState } from "react";
import API from "../api/axios";

export default function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await API.get("/users/me");
      setUser(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  if (!user) {
    return <div className="text-white p-10">Loading...</div>;
  }

  return (
    <div className="bg-[#28364D] min-h-screen px-6 py-16">

      <div className="max-w-4xl mx-auto bg-[#384B6B] p-8 rounded-2xl border border-[#5875A7]">

        <h1 className="text-2xl text-[#EEF1F6] font-semibold mb-6">
          My Profile
        </h1>

        <div className="space-y-4 text-[#EEF1F6]">

          <div>
            <p className="text-[#B2C0D7] text-sm">Name</p>
            <p className="text-lg">{user.name}</p>
          </div>

          <div>
            <p className="text-[#B2C0D7] text-sm">Email</p>
            <p className="text-lg">{user.email}</p>
          </div>

          <div>
            <p className="text-[#B2C0D7] text-sm">Phone</p>
            <p className="text-lg">{user.phone || "Not provided"}</p>
          </div>

          <div>
            <p className="text-[#B2C0D7] text-sm">Role</p>
            <p className="text-lg capitalize">{user.role}</p>
          </div>

        </div>

      </div>
    </div>
  );
}