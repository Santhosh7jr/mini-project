import { useEffect, useState } from "react";
import API from "../api/axios";

export default function AdminDashboard() {
  const [pendingWorkers, setPendingWorkers] = useState([]);
  const [approvedWorkers, setApprovedWorkers] = useState([]);
  const [registeredUsers, setRegisteredUsers] = useState([]);
  const [tab, setTab] = useState("pending");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWorkers();
  }, []);

  const fetchWorkers = async () => {
    try {
      setLoading(true);
      // Get pending worker registrations
      const pendingRes = await API.get("/workers/approval/pending");
      setPendingWorkers(pendingRes.data || []);

      // Get all approved workers
      const allRes = await API.get("/workers");
      setApprovedWorkers(
        (allRes.data || []).filter((w) => w.is_approved !== false),
      );

      const usersRes = await API.get("/auth/users");
      setRegisteredUsers(usersRes.data || []);

      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  const approveWorker = async (id) => {
    if (!window.confirm("Approve this worker?")) return;
    try {
      await API.patch(`/workers/approval/approve/${id}`);
      fetchWorkers();
    } catch (err) {
      alert("Error approving worker: " + err.response?.data?.message);
    }
  };

  const rejectWorker = async (id) => {
    if (
      !window.confirm("Reject this worker application?")
    )
      return;
    try {
      await API.delete(`/workers/approval/reject/${id}`);
      fetchWorkers();
    } catch (err) {
      alert("Error rejecting worker: " + err.response?.data?.message);
    }
  };

  return (
    <div className="bg-[#E9E5DF] min-h-screen px-6 py-16">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-[#191919]">
            🛡️ Admin Panel
          </h1>
          <p className="text-[#666666] mt-2">
            Manage users and worker approvals
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-4 mb-8 border-b border-[#D0D7DE]">
          <button
            onClick={() => setTab("users")}
            className={`px-4 py-3 font-semibold transition ${
              tab === "users"
                ? "border-b-2 border-[#0A66C2] text-[#0A66C2]"
                : "text-[#666666] hover:text-[#191919]"
            }`}
          >
            👥 Registered Users ({registeredUsers.length})
          </button>
          <button
            onClick={() => setTab("pending")}
            className={`px-4 py-3 font-semibold transition ${
              tab === "pending"
                ? "border-b-2 border-[#0A66C2] text-[#0A66C2]"
                : "text-[#666666] hover:text-[#191919]"
            }`}
          >
            📋 Pending Approvals ({pendingWorkers.length})
          </button>
          <button
            onClick={() => setTab("approved")}
            className={`px-4 py-3 font-semibold transition ${
              tab === "approved"
                ? "border-b-2 border-[#0A66C2] text-[#0A66C2]"
                : "text-[#666666] hover:text-[#191919]"
            }`}
          >
            ✓ Approved Workers ({approvedWorkers.length})
          </button>
        </div>

        {loading ? (
          <div className="text-center text-[#666666]">Loading...</div>
        ) : tab === "users" ? (
          <div>
            {registeredUsers.length === 0 ? (
              <div className="bg-[#FFFFFF] rounded-2xl border border-[#D0D7DE] p-12 text-center">
                <p className="text-[#666666] text-lg">No users registered yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {registeredUsers.map((user) => (
                  <div
                    key={user.id}
                    className="bg-[#FFFFFF] rounded-xl border border-[#D0D7DE]/40 p-6 hover:border-[#0A66C2] transition"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                      <div>
                        <p className="text-[#666666] text-xs">Name</p>
                        <p className="text-[#191919] font-semibold">
                          {user.name}
                        </p>
                      </div>
                      <div>
                        <p className="text-[#666666] text-xs">Email</p>
                        <p className="text-[#191919]">{user.email}</p>
                      </div>
                      <div>
                        <p className="text-[#666666] text-xs">Phone</p>
                        <p className="text-[#191919]">{user.phone || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-[#666666] text-xs">Role</p>
                        <p className="text-[#191919] capitalize">{user.role}</p>
                      </div>
                      <div>
                        <p className="text-[#666666] text-xs">Request</p>
                        <p className="text-[#191919] capitalize">
                          {user.worker_request_status || "none"}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : tab === "pending" ? (
          // PENDING WORKERS
          <div>
            {pendingWorkers.length === 0 ? (
              <div className="bg-[#FFFFFF] rounded-2xl border border-[#D0D7DE] p-12 text-center">
                <p className="text-[#666666] text-lg">
                  ✓ No pending applications
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingWorkers.map((worker) => (
                  <div
                    key={worker.id}
                    className="bg-[#FFFFFF] rounded-xl border border-[#E9D08A] p-6 hover:border-[#0A66C2] transition"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      {/* Worker Info */}
                      <div className="flex-1">
                        <h2 className="text-lg font-semibold text-[#191919]">
                          👤 {worker.name}
                        </h2>
                        <div className="grid grid-cols-2 gap-4 mt-3 text-sm">
                          <div>
                            <p className="text-[#666666] text-xs">Email</p>
                            <p className="text-[#191919]">{worker.email}</p>
                          </div>
                          <div>
                            <p className="text-[#666666] text-xs">Phone</p>
                            <p className="text-[#191919]">
                              {worker.phone || "N/A"}
                            </p>
                          </div>
                          <div className="col-span-2">
                            <p className="text-[#666666] text-xs">Applied On</p>
                            <p className="text-[#191919]">
                              {new Date(worker.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="col-span-2">
                            <p className="text-[#666666] text-xs">Status</p>
                            <span className="inline-flex mt-1 items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#FFF4CE] text-[#915907] border border-[#E9D08A]">
                              pending
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 flex-wrap md:flex-nowrap">
                        <button
                          onClick={() => approveWorker(worker.id)}
                          className="flex-1 bg-[#057642] hover:bg-[#004B1C] text-white px-4 py-2 rounded-lg font-semibold transition"
                        >
                          ✓ Approve
                        </button>
                        <button
                          onClick={() => rejectWorker(worker.id)}
                          className="flex-1 bg-[#B24020] hover:bg-[#8F2C14] text-white px-4 py-2 rounded-lg font-semibold transition"
                        >
                          ✕ Reject
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          // APPROVED WORKERS
          <div>
            {approvedWorkers.length === 0 ? (
              <div className="bg-[#FFFFFF] rounded-2xl border border-[#D0D7DE] p-12 text-center">
                <p className="text-[#666666] text-lg">
                  No approved workers yet
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {approvedWorkers.map((worker) => (
                  <div
                    key={worker.id}
                    className="bg-[#FFFFFF] rounded-xl border border-[#B6E2C5] p-6 hover:border-[#0A66C2] transition"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      {/* Worker Info */}
                      <div className="flex-1">
                        <h2 className="text-lg font-semibold text-[#191919]">
                          👷 {worker.name}
                        </h2>
                        <div className="grid grid-cols-3 gap-4 mt-3 text-sm">
                          <div>
                            <p className="text-[#666666]">Experience</p>
                            <p className="text-[#191919] font-semibold">
                              {worker.experience || 0} years
                            </p>
                          </div>
                          <div>
                            <p className="text-[#666666]">Rating</p>
                            <p className="text-[#191919] font-semibold">
                              ⭐ {worker.rating || 4.5}
                            </p>
                          </div>
                          <div>
                            <p className="text-[#666666]">Status</p>
                            <p className="text-[#057642] font-semibold">
                              ✓ Active
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
