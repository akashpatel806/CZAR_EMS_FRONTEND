import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { useAuth } from "../../context/AuthContext";

const AllLeaveRequests = () => {
  const { role, token } = useAuth();
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [month, setMonth] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

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
        setLeaveRequests(res.data || []);
        setFiltered(res.data || []);
      } catch (error) {
        console.error("Error fetching leave requests:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [role, token]);

  // Filter logic
  useEffect(() => {
    let filteredData = [...leaveRequests];

    if (month) {
      filteredData = filteredData.filter((req) => {
        const reqMonth = new Date(req.fromDate).getMonth() + 1;
        return reqMonth === parseInt(month);
      });
    }

    if (search.trim() !== "") {
      filteredData = filteredData.filter((req) =>
        req.employeeId?.name
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

      setLeaveRequests((prev) =>
        prev.map((req) => (req._id === id ? res.data.leaveRequest : req))
      );
    } catch (error) {
      console.error("Error reviewing leave request:", error);
      alert("Failed to update leave request.");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-gray-600">
        Loading all leave requests...
      </div>
    );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-xl shadow-lg flex flex-col sm:flex-row justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">All Leave Requests</h1>
          <p className="text-blue-100">View and filter all leave requests.</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 bg-white p-4 rounded-xl shadow-md border border-gray-200">
        <input
          type="month"
          className="border border-gray-300 rounded-md px-3 py-2 text-sm"
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
          className="border border-gray-300 rounded-md px-3 py-2 text-sm flex-1"
        />
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="text-center text-gray-500 py-10">
          No leave requests found.
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
                <th className="p-3 text-left">Status</th>
                {role === "admin" && <th className="p-3 text-left">Action</th>}
              </tr>
            </thead>
            <tbody>
              {filtered.map((req) => (
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
                  <td className="p-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        req.status === "Approved"
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
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AllLeaveRequests;
