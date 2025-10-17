
import React, { useEffect, useState } from "react";
import LeaveRequestForm from "./LeaveRequestForm";
import LeaveRequestTable from "./LeaveRequestTable";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import { useAuth } from "../../context/AuthContext";

const LeaveRequestPage = () => {
  const { role, token } = useAuth();
  const [activeTab, setActiveTab] = useState("form"); // 'form' or 'list'
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // ✅ Fetch leave requests based on role
  useEffect(() => {
    const fetchLeaveRequests = async () => {
      try {
        let endpoint =
          role === "admin" ? "/admin/leave-requests" : "/employee/leave-requests";
        const res = await axiosInstance.get(endpoint, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log(res);
        
        setLeaveRequests(res.data || []);
      } catch (error) {
        console.error("Error fetching leave requests:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaveRequests();
  }, [role, token]);

  // ✅ Employee: handle new request submission
  const handleNewRequest = async (newRequest) => {
    try {
      const res = await axiosInstance.post("/employee/leave-requests", newRequest, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLeaveRequests((prev) => [...prev, res.data.leaveRequest]);
      setActiveTab("list");
    } catch (error) {
      console.error("Error submitting leave request:", error);
      alert("Failed to submit leave request.");
    }
  };
// ✅ Admin: review request (approve/reject)
const handleReview = async (id, status) => {
  try {
    await axiosInstance.put(
      `/admin/leave-requests/${id}`,
      { status },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    // Remove from list immediately after review
    setLeaveRequests((prev) => prev.filter((req) => req._id !== id));
  } catch (error) {
    console.error("Error reviewing leave request:", error);
    alert("Failed to update leave request.");
  }
};


  // ✅ Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-600">
        Loading leave requests...
      </div>
    );
  }

  // ---------------- EMPLOYEE VIEW ----------------
  if (role === "employee") {
    return (
      <div className="space-y-10">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-xl shadow-lg flex flex-col sm:flex-row justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Leave Requests</h1>
            <p className="text-blue-100">Submit and manage your leave requests.</p>
          </div>

          {/* Toggle Buttons */}
          <div className="mt-4 sm:mt-0 flex gap-3">
            <button
              onClick={() => setActiveTab("form")}
              className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === "form"
                  ? "bg-white text-blue-700 shadow-md"
                  : "bg-blue-500 hover:bg-blue-700 text-white"
              }`}
            >
              ➕ Submit Leave
            </button>
            <button
              onClick={() => setActiveTab("list")}
              className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === "list"
                  ? "bg-white text-blue-700 shadow-md"
                  : "bg-blue-500 hover:bg-blue-700 text-white"
              }`}
            >
              📋 View Requests
            </button>
          </div>
        </div>

        {/* Conditional Rendering */}
        {activeTab === "form" ? (
          <LeaveRequestForm onSubmit={handleNewRequest} />
        ) : (
          <LeaveRequestTable leaveRequests={leaveRequests} />
        )}
      </div>
    );
  }

// ---------------- ADMIN VIEW ----------------
if (role === "admin") {
  // ✅ Filter only pending requests
  const pendingRequests = leaveRequests.filter((req) => req.status === "Pending");

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-xl shadow-lg flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Pending Leave Requests</h1>
          <p className="text-blue-100">
            Review and approve or reject employee leave requests.
          </p>
        </div>
        <button
          className="px-4 py-2 bg-white text-blue-700 font-medium rounded-lg hover:bg-blue-100 transition"
          onClick={() => navigate("/all-requests")}
        >
          📋 View All Requests
        </button>
      </div>

      {/* Leave Requests Table */}
      {pendingRequests.length === 0 ? (
        <div className="text-center text-gray-500 py-20 text-lg font-medium">
          No Leave Requests for now
        </div>
      ) : (
        <div className="overflow-x-auto bg-white shadow-md rounded-xl border border-gray-200">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
              <tr>
                <th className="p-3 text-left">Employee</th>
                <th className="p-3 text-left">Leave Type</th>
                <th className="p-3 text-left">From</th>
                <th className="p-3 text-left">To</th>
                <th className="p-3 text-left">Reason</th>
                <th className="p-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {pendingRequests.map((req) => (
                <tr
                  key={req._id}
                  className="border-t hover:bg-gray-50 transition duration-150"
                >
                  <td className="p-3">
                    {req.employeeId?.name || "Unknown"} <br />
                    <span className="text-xs text-gray-400">
                      {req.employeeId?.department || ""}
                    </span>
                  </td>
                  <td className="p-3 capitalize">{req.leaveType}</td>
                  <td className="p-3">
                    {new Date(req.fromDate).toLocaleDateString()}
                  </td>
                  <td className="p-3">
                    {new Date(req.toDate).toLocaleDateString()}
                  </td>
                  <td className="p-3">{req.reason}</td>
                  <td className="p-3 flex gap-2">
                    <button
                      onClick={() => handleReview(req._id, "Approved")}
                      className="px-3 py-1 bg-green-600 text-white rounded-md text-xs hover:bg-green-700"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReview(req._id, "Rejected")}
                      className="px-3 py-1 bg-red-600 text-white rounded-md text-xs hover:bg-red-700"
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}


  return null;
};

export default LeaveRequestPage;
