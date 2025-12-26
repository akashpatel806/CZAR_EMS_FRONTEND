import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import { useAuth } from "../../context/AuthContext";
import Button from "../../components/Button";
import { X } from "lucide-react";



const AllLeaveRequests = () => {
  const { role, token } = useAuth();
  const navigate = useNavigate();
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [month, setMonth] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedReason, setSelectedReason] = useState(null);

  const hasPending = (filtered || []).some(req => req?.status === "Pending");

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const endpoint =
          role === "admin"
            ? "/admin/leave-requests"
            : "/employee/leave-requests";
        const res = await axiosInstance.get(endpoint, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = res.data || [];
        setLeaveRequests(data);
        setFiltered(data);
      } catch (error) {
        console.error("Error fetching leave requests:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [role, token]);

  // ✅ Filter logic
  useEffect(() => {
    if (!leaveRequests || !leaveRequests.length) {
      setFiltered([]);
      return;
    }

    let filteredData = [...leaveRequests];

    if (month) {
      filteredData = filteredData.filter((req) => {
        const reqMonth = new Date(req.fromDate).getMonth() + 1;
        return reqMonth === parseInt(month);
      });
    }

    if (search.trim() !== "") {
      filteredData = filteredData.filter((req) =>
        (req.employeeId?.userId?.name || req.employeeId?.name)
          ?.toLowerCase()
          .includes(search.trim().toLowerCase())
      );
    }

    setFiltered(filteredData);
  }, [month, search, leaveRequests]);

  const handleReview = async (id, status) => {
    try {
      const res = await axiosInstance.put(
        `/admin/leave-requests/${id}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // ✅ Update locally
      setLeaveRequests((prev) =>
        prev.map((req) => (req._id === id ? res.data.leaveRequest : req))
      );

      // ✅ If approved, update available leaves (skip for site visit)
      if (status === "Approved") {
        const req = leaveRequests.find((r) => r._id === id);
        if (req && req.leaveReasonType?.toLowerCase() !== "site visit") {
          // Calculate number of days
          const fromDate = new Date(req.fromDate);
          const toDate = new Date(req.toDate);
          const daysDiff = Math.ceil((toDate - fromDate) / (1000 * 60 * 60 * 24)) + 1;

          // Fetch current employee details
          const empRes = await axiosInstance.get(`/admin/employee/${req.employeeId._id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const currentLeaves = empRes.data.availableLeaves || 0;
          const newLeaves = Math.max(0, currentLeaves - daysDiff); // Prevent negative

          // Update employee's available leaves
          await axiosInstance.put(
            `/admin/update-employee/${req.employeeId.employeeId}`,
            { allocatedLeaves: newLeaves },
            { headers: { Authorization: `Bearer ${token}` } }
          );
        }
      }
    } catch (error) {
      console.error("Error reviewing leave request:", error);
      alert("Failed to update leave request.");
    }
  };



  // ✅ Loading UI
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-600">
        Loading all leave requests...
      </div>
    );
  }

  // ✅ No requests case
  if (!leaveRequests || leaveRequests.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-gray-600">
        <div className="bg-white shadow-md p-8 rounded-xl border border-gray-200 text-center">
          <h2 className="text-2xl font-semibold mb-2">
            No Leave Requests Found
          </h2>
          <p className="text-gray-500">
            There are currently no leave requests to display.
          </p>
        </div>
      </div>
    );
  }

  // ✅ Main UI when data exists
  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="space-y-6 md:space-y-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-xl shadow-lg flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold">All Leave Requests</h1>
            <p className="text-blue-100">View and filter all leave requests.</p>
          </div>
          <Button
            variant="ghost"
            className="px-4 py-2 bg-white text-blue-700 font-medium rounded-lg hover:bg-blue-100 transition w-full sm:w-auto"
            onClick={() => navigate("/leave-request")}
          >
            ⬅️ Back to Pending
          </Button>
        </div>

        {/* Filters */}
        {leaveRequests.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-xl shadow-md border border-gray-200">
            <input
              type="month"
              className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full sm:w-auto focus:ring-2 focus:ring-indigo-500 outline-none"
              onChange={(e) => {
                const monthNum = e.target.value.split("-")[1];
                setMonth(monthNum);
              }}
            />
            <input
              type="text"
              placeholder="Search by employee name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full sm:flex-1 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
        )}

        {/* Table */}
        {filtered.length === 0 ? (
          <div className="text-center text-gray-500 py-10">
            No matching leave requests found for your filter.
          </div>
        ) : (
          <div className="overflow-x-auto bg-white shadow-md rounded-xl border border-gray-200">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                <tr>
                  {[
                    "empname",
                    "deptartment(dept)",
                    "Leave Type",
                    "Leave Reason Type",
                    "From date",
                    "To date",
                    "From Time",
                    "To Time",
                    "Reason",
                    "Status",
                  ].map((head) => (
                    <th key={head} className="p-3 text-left whitespace-nowrap">
                      {head}
                    </th>
                  ))}
                  {role === "admin" && hasPending && <th className="p-3 text-left whitespace-nowrap">Action</th>}
                </tr>
              </thead>
              <tbody>
                {filtered.map((req) => (
                  <tr
                    key={req._id}
                    className="border-t hover:bg-gray-50 transition duration-150"
                  >
                    <td className="p-3 whitespace-nowrap">
                      {req.employeeId?.name || req.employeeId?.userId?.name || "Unknown"}
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      {req.employeeId?.department || ""}
                    </td>
                    <td className="p-3 capitalize whitespace-nowrap">{req.leaveType}</td>
                    <td className="p-3 capitalize whitespace-nowrap">{req.leaveReasonType}</td>
                    <td className="p-3 whitespace-nowrap">
                      {new Date(req.fromDate).toLocaleDateString()}
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      {new Date(req.toDate).toLocaleDateString()}
                    </td>
                    <td className="p-3 whitespace-nowrap">{req.fromTime || "N/A"}</td>
                    <td className="p-3 whitespace-nowrap">{req.toTime || "N/A"}</td>
                    <td
                      className="p-3 cursor-pointer"
                      onClick={() => setSelectedReason(req.reason)}
                    >
                      <div className="line-clamp-2 hover:text-blue-600 transition-colors" title="Click to view full reason">
                        {req.reason}
                      </div>
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${req.status === "Approved"
                          ? "bg-green-100 text-green-700"
                          : req.status === "Rejected"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                          }`}
                      >
                        {req.status}
                      </span>
                    </td>
                    {role === "admin" && req.status === "Pending" && (
                      <td className="p-3 flex gap-2 whitespace-nowrap">
                        <Button
                          onClick={() => handleReview(req._id, "Approved")}
                          variant="success"
                          size="sm"
                          className="px-3 py-1 text-xs"
                        >
                          Approve
                        </Button>
                        <Button
                          onClick={() => handleReview(req._id, "Rejected")}
                          variant="danger"
                          size="sm"
                          className="px-3 py-1 text-xs"
                        >
                          Reject
                        </Button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Reason Modal */}
        {selectedReason && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
            onClick={() => setSelectedReason(null)}
          >
            <div
              className="bg-white rounded-lg p-6 w-full shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-colors"
                onClick={() => setSelectedReason(null)}
              >
                <X size={24} />
              </Button>
              <h3 className="text-xl font-bold mb-4 text-gray-800">
                Full Reason
              </h3>
              <div className="max-h-[60vh] overflow-y-auto text-gray-700 whitespace-pre-wrap leading-relaxed">
                {selectedReason}
              </div>
              <div className="mt-6 text-right">
                <Button
                  variant="primary"
                  onClick={() => setSelectedReason(null)}
                  className="px-4 py-2 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllLeaveRequests;
