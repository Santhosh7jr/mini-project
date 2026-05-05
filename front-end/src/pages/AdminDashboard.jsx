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
    <div className="bg-[#28364D] min-h-screen px-6 py-16">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-[#EEF1F6]">
            🛡️ Admin Panel
          </h1>
          <p className="text-[#B2C0D7] mt-2">
            Manage users and worker approvals
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-4 mb-8 border-b border-[#5875A7]">
          <button
            onClick={() => setTab("users")}
            className={`px-4 py-3 font-semibold transition ${
              tab === "users"
                ? "border-b-2 border-[#7A3FE0] text-[#7A3FE0]"
                : "text-[#B2C0D7] hover:text-[#EEF1F6]"
            }`}
          >
            👥 Registered Users ({registeredUsers.length})
          </button>
          <button
            onClick={() => setTab("pending")}
            className={`px-4 py-3 font-semibold transition ${
              tab === "pending"
                ? "border-b-2 border-[#7A3FE0] text-[#7A3FE0]"
                : "text-[#B2C0D7] hover:text-[#EEF1F6]"
            }`}
          >
            📋 Pending Approvals ({pendingWorkers.length})
          </button>
          <button
            onClick={() => setTab("approved")}
            className={`px-4 py-3 font-semibold transition ${
              tab === "approved"
                ? "border-b-2 border-[#7A3FE0] text-[#7A3FE0]"
                : "text-[#B2C0D7] hover:text-[#EEF1F6]"
            }`}
          >
            ✓ Approved Workers ({approvedWorkers.length})
          </button>
        </div>

        {loading ? (
          <div className="text-center text-[#B2C0D7]">Loading...</div>
        ) : tab === "users" ? (
          <div>
            {registeredUsers.length === 0 ? (
              <div className="bg-[#384B6B] rounded-2xl border border-[#5875A7] p-12 text-center">
                <p className="text-[#B2C0D7] text-lg">No users registered yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {registeredUsers.map((user) => (
                  <div
                    key={user.id}
                    className="bg-[#384B6B] rounded-xl border border-[#5875A7]/40 p-6 hover:border-[#7A3FE0] transition"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                      <div>
                        <p className="text-[#B2C0D7] text-xs">Name</p>
                        <p className="text-[#EEF1F6] font-semibold">
                          {user.name}
                        </p>
                      </div>
                      <div>
                        <p className="text-[#B2C0D7] text-xs">Email</p>
                        <p className="text-[#EEF1F6]">{user.email}</p>
                      </div>
                      <div>
                        <p className="text-[#B2C0D7] text-xs">Phone</p>
                        <p className="text-[#EEF1F6]">{user.phone || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-[#B2C0D7] text-xs">Role</p>
                        <p className="text-[#EEF1F6] capitalize">{user.role}</p>
                      </div>
                      <div>
                        <p className="text-[#B2C0D7] text-xs">Request</p>
                        <p className="text-[#EEF1F6] capitalize">
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
              <div className="bg-[#384B6B] rounded-2xl border border-[#5875A7] p-12 text-center">
                <p className="text-[#B2C0D7] text-lg">
                  ✓ No pending applications
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingWorkers.map((worker) => (
                  <div
                    key={worker.id}
                    className="bg-[#384B6B] rounded-xl border border-yellow-500/30 p-6 hover:border-[#7A3FE0] transition"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      {/* Worker Info */}
                      <div className="flex-1">
                        <h2 className="text-lg font-semibold text-[#EEF1F6]">
                          👤 {worker.name}
                        </h2>
                        <div className="grid grid-cols-2 gap-4 mt-3 text-sm">
                          <div>
                            <p className="text-[#B2C0D7] text-xs">Email</p>
                            <p className="text-[#EEF1F6]">{worker.email}</p>
                          </div>
                          <div>
                            <p className="text-[#B2C0D7] text-xs">Phone</p>
                            <p className="text-[#EEF1F6]">
                              {worker.phone || "N/A"}
                            </p>
                          </div>
                          <div className="col-span-2">
                            <p className="text-[#B2C0D7] text-xs">Applied On</p>
                            <p className="text-[#EEF1F6]">
                              {new Date(worker.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="col-span-2">
                            <p className="text-[#B2C0D7] text-xs">Status</p>
                            <span className="inline-flex mt-1 items-center px-3 py-1 rounded-full text-xs font-semibold bg-yellow-500/20 text-yellow-300 border border-yellow-500/30">
                              pending
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 flex-wrap md:flex-nowrap">
                        <button
                          onClick={() => approveWorker(worker.id)}
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition"
                        >
                          ✓ Approve
                        </button>
                        <button
                          onClick={() => rejectWorker(worker.id)}
                          className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition"
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
              <div className="bg-[#384B6B] rounded-2xl border border-[#5875A7] p-12 text-center">
                <p className="text-[#B2C0D7] text-lg">
                  No approved workers yet
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {approvedWorkers.map((worker) => (
                  <div
                    key={worker.id}
                    className="bg-[#384B6B] rounded-xl border border-green-500/30 p-6 hover:border-[#7A3FE0] transition"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      {/* Worker Info */}
                      <div className="flex-1">
                        <h2 className="text-lg font-semibold text-[#EEF1F6]">
                          👷 {worker.name}
                        </h2>
                        <div className="grid grid-cols-3 gap-4 mt-3 text-sm">
                          <div>
                            <p className="text-[#B2C0D7]">Experience</p>
                            <p className="text-[#EEF1F6] font-semibold">
                              {worker.experience || 0} years
                            </p>
                          </div>
                          <div>
                            <p className="text-[#B2C0D7]">Rating</p>
                            <p className="text-[#EEF1F6] font-semibold">
                              ⭐ {worker.rating || 4.5}
                            </p>
                          </div>
                          <div>
                            <p className="text-[#B2C0D7]">Status</p>
                            <p className="text-green-400 font-semibold">
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
