import React, { useEffect, useState } from "react";
import { useEmployeeProfile } from "../../hooks/useEmployeeProfile";
import { useAuth } from "../../context/AuthContext";
import axiosInstance from "../../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";

const DashboardPage = () => {
  const { profile: employeeProfile, loading } = useEmployeeProfile();
  const { role } = useAuth();
  const navigate = useNavigate();


  const [adminStats, setAdminStats] = useState({
    totalEmployees: 0,
    onLeaveToday: 0,
    leaveRequests: [],
    upcomingBirthdays: [],
    attendanceSummary: { present: 0, absent: 0 },
  });

  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [employeesOnLeave, setEmployeesOnLeave] = useState([]);
  const [expandedReasons, setExpandedReasons] = useState({});

  // ✅ Fetch admin dashboard data (only if role = admin)
  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const response = await axiosInstance.get("/admin/admin-dashboard");
        console.log("Dashboard API response:", response.data);
        setAdminStats(response.data);
      } catch (err) {
        console.log(err?.response?.data);

        console.error("Error fetching admin dashboard data:", err);
      }
    };
    if (role === "admin") fetchAdminData();
  }, [role]);

  // ✅ Fetch employees on leave today
  const fetchEmployeesOnLeave = async () => {
    try {
      const response = await axiosInstance.get("/admin/leave-requests");
      const allRequests = response.data || [];
      console.log("📋 All requests fetched:", allRequests.length);
      console.log("📋 Sample request:", allRequests[0]);

      // Filter for approved leaves that are active today
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      console.log("📅 Today's date:", today.toISOString());

      const activeLeaves = allRequests.filter(request => {
        if (request.status !== "Approved") return false;

        const fromDate = new Date(request.fromDate);
        const toDate = new Date(request.toDate);
        fromDate.setHours(0, 0, 0, 0);
        toDate.setHours(0, 0, 0, 0);

        return today >= fromDate && today <= toDate;
      });

      setEmployeesOnLeave(activeLeaves);
    } catch (err) {
      console.error("Error fetching employees on leave:", err);
      setEmployeesOnLeave([]);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-600">
        Loading dashboard...
      </div>
    );
  }

  if (role !== "admin" && !employeeProfile) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-600">
        No profile found.
      </div>
    );
  }

  // ✅ Employee Summary (same as your current logic)
  const { leaveSummary = {}, leaveRequests = [], attendanceStatus = "present" } = employeeProfile || {};
  const summary =
    leaveSummary && Object.keys(leaveSummary).length > 0
      ? leaveSummary
      : {
        pending: leaveRequests.filter((r) => r.status === "Pending").length,
        approved: leaveRequests.filter((r) => r.status === "Approved").length,
        rejected: leaveRequests.filter((r) => r.status === "Rejected").length,
      };

  // Calculate approved days from leave requests
  const approvedDays = leaveRequests.filter((r) => r.status === "Approved" && (!r.leaveReasonType || r.leaveReasonType.toLowerCase() !== "sitevisit")).reduce((sum, r) => sum + (r.days || 0), 0);

  // ---------------- ADMIN DASHBOARD ----------------
  if (role === "admin") {
    const { totalEmployees, onLeaveToday, attendanceSummary, leaveRequests, upcomingBirthdays } =
      adminStats;

    return (
      <div className="space-y-4 sm:space-y-6 md:space-y-8">
        {/* Header */}
        <div className="bg-white p-4 sm:p-5 md:p-6 rounded-xl shadow-lg border-l-4 border-blue-500">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-600 mb-1">
            Welcome, Admin 👋
          </h2>
          <p className="text-sm sm:text-base text-gray-600">Here's what's happening today.</p>
        </div>

        {/* Top Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {[
            { title: "Total Employees", value: totalEmployees, color: "bg-blue-500", icon: "👥" },
            { title: "On Leave Today", value: onLeaveToday, color: "bg-yellow-500", icon: "🏖️" },
          ].map((item, i) => (
            <div
              key={i}
              onClick={() => {
                if (item.title === "Total Employees") {
                  navigate("/admin/all-employees");
                } else if (item.title === "On Leave Today") {
                  setShowLeaveModal(true);
                  fetchEmployeesOnLeave();
                }
              }}
              className="bg-white p-4 sm:p-5 md:p-6 rounded-xl shadow-lg transform hover:scale-105 transition cursor-pointer"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs sm:text-sm text-gray-500">{item.title}</p>
                  <p className="text-2xl sm:text-3xl md:text-4xl font-bold">{item.value}</p>
                </div>
                <div className={`${item.color} p-2 sm:p-3 rounded-full text-white text-lg sm:text-xl`}>
                  {item.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Leave Requests Section */}
        <div className="bg-white p-4 sm:p-5 md:p-6 rounded-xl shadow-lg">
          <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-3 sm:mb-4">
            Pending Leave Requests
          </h3>
          {leaveRequests.length === 0 ? (
            <p className="text-gray-500 text-xs sm:text-sm">No pending leave requests.</p>
          ) : (
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <table className="min-w-full border border-gray-200 text-xs sm:text-sm">
                <thead className="bg-gray-100 text-gray-600">
                  <tr>
                    <th className="p-2 sm:p-3 text-left text-[10px] sm:text-xs uppercase">Employee</th>
                    <th className="p-2 sm:p-3 text-left text-[10px] sm:text-xs uppercase hidden sm:table-cell">Type</th>
                    <th className="p-2 sm:p-3 text-left text-[10px] sm:text-xs uppercase">From</th>
                    <th className="p-2 sm:p-3 text-left text-[10px] sm:text-xs uppercase hidden md:table-cell">To</th>
                    <th className="p-2 sm:p-3 text-left text-[10px] sm:text-xs uppercase">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {leaveRequests.map((r, i) => (
                    <tr key={i} className="border-t hover:bg-gray-50">
                      <td className="p-2 sm:p-3 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="font-medium">{r.employeeName}</span>
                          <span className="text-[10px] text-gray-500 sm:hidden">{r.leaveType}</span>
                        </div>
                      </td>
                      <td className="p-2 sm:p-3 whitespace-nowrap hidden sm:table-cell">{r.leaveType}</td>
                      <td className="p-2 sm:p-3 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span>{new Date(r.fromDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                          <span className="text-[10px] text-gray-500 md:hidden">to {new Date(r.toDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                        </div>
                      </td>
                      <td className="p-2 sm:p-3 whitespace-nowrap hidden md:table-cell">{new Date(r.toDate).toLocaleDateString()}</td>
                      <td className="p-2 sm:p-3 whitespace-nowrap">
                        <span className="text-yellow-600 font-semibold text-xs">{r.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Upcoming Birthdays Section */}
        <div className="bg-white p-4 sm:p-5 md:p-6 rounded-xl shadow-lg">
          <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-3 sm:mb-4">
            Upcoming Birthdays 🎂
          </h3>
          {upcomingBirthdays.length === 0 ? (
            <p className="text-gray-500 text-xs sm:text-sm">No upcoming birthdays.</p>
          ) : (
            <ul className="space-y-2 sm:space-y-3">
              {upcomingBirthdays.map((emp, i) => (
                <li
                  key={i}
                  className="flex justify-between items-center border-b pb-2 text-gray-700 text-sm sm:text-base"
                >
                  <span className="font-medium">{emp.name}</span>
                  <span className="text-gray-500 text-xs sm:text-sm">{emp.date}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* On Leave Today Modal */}
        {showLeaveModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 p-4 sm:p-6 flex justify-between items-center">
                <h3 className="text-lg sm:text-xl font-bold text-gray-800">
                  Employees On Leave Today ({employeesOnLeave.length})
                </h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowLeaveModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </Button>
              </div>

              <div className="p-4 sm:p-6">
                {employeesOnLeave.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">🏖️</div>
                    <p className="text-gray-500 text-lg">No employees on leave today</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full border border-gray-200 text-xs sm:text-sm">
                      <thead className="bg-gray-100 text-gray-600">
                        <tr>
                          <th className="p-2 sm:p-3 text-left text-[10px] sm:text-xs uppercase font-semibold">Employee</th>
                          <th className="p-2 sm:p-3 text-left text-[10px] sm:text-xs uppercase font-semibold hidden sm:table-cell">Leave Type</th>
                          <th className="p-2 sm:p-3 text-left text-[10px] sm:text-xs uppercase font-semibold">From</th>
                          <th className="p-2 sm:p-3 text-left text-[10px] sm:text-xs uppercase font-semibold hidden md:table-cell">To</th>
                          <th className="p-2 sm:p-3 text-left text-[10px] sm:text-xs uppercase font-semibold">Reason</th>
                        </tr>
                      </thead>
                      <tbody>
                        {employeesOnLeave.map((emp, i) => (
                          <tr key={i} className="border-t hover:bg-gray-50 transition">
                            <td className="p-2 sm:p-3 whitespace-nowrap">
                              <div className="flex flex-col">
                                <span className="font-medium text-gray-900">
                                  {emp.employeeId?.userId?.name || emp.employeeId?.name || "Unknown"}
                                </span>
                                <span className="text-[10px] text-gray-500 sm:hidden">{emp.leaveType}</span>
                              </div>
                            </td>
                            <td className="p-2 sm:p-3 whitespace-nowrap hidden sm:table-cell">
                              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                                {emp.leaveType}
                              </span>
                            </td>
                            <td className="p-2 sm:p-3 whitespace-nowrap">
                              <div className="flex flex-col">
                                <span className="text-gray-700">
                                  {new Date(emp.fromDate).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric'
                                  })}
                                </span>
                                <span className="text-[10px] text-gray-500 md:hidden">
                                  to {new Date(emp.toDate).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric'
                                  })}
                                </span>
                              </div>
                            </td>
                            <td className="p-2 sm:p-3 whitespace-nowrap hidden md:table-cell text-gray-700">
                              {new Date(emp.toDate).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </td>
                            <td className="p-2 sm:p-3">
                              <div className="max-w-xs">
                                {emp.reason && emp.reason.length > 50 ? (
                                  <div>
                                    <p className="text-gray-700">
                                      {expandedReasons[i] ? emp.reason : `${emp.reason.substring(0, 50)}...`}
                                    </p>
                                    <button
                                      onClick={() => setExpandedReasons(prev => ({
                                        ...prev,
                                        [i]: !prev[i]
                                      }))}
                                      className="text-blue-600 hover:text-blue-800 text-xs font-medium mt-1"
                                    >
                                      {expandedReasons[i] ? 'Show Less' : 'View All'}
                                    </button>
                                  </div>
                                ) : (
                                  <p className="text-gray-700">{emp.reason}</p>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-4 flex justify-end">
                <Button
                  variant="primary"
                  onClick={() => setShowLeaveModal(false)}
                  className="px-6 py-2"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ---------------- EMPLOYEE DASHBOARD ----------------
  return (
    <div className="space-y-4 sm:space-y-6 md:space-y-8">
      {/* Welcome Section */}
      <div className="bg-white p-4 sm:p-5 md:p-6 rounded-xl shadow-lg border-l-4 border-blue-500">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-600 mb-1">
          Hello, {employeeProfile.name || "Employee"}!
        </h2>
        <p className="text-sm sm:text-base text-gray-600">Welcome to your dashboard.</p>
      </div>



      {/* Leave Balance */}
      <div className="bg-white p-4 sm:p-5 md:p-6 rounded-xl shadow-lg border border-gray-100">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-700">
              Allocated Leave
            </h3>
            <p className="text-3xl sm:text-4xl md:text-5xl font-bold text-blue-600">
              {employeeProfile.allocatedLeaves || 0} days
            </p>
            <p className="text-gray-400 mt-1 text-xs sm:text-sm">
              Allocated leave days for year
            </p>
          </div>
          <div className="text-4xl sm:text-5xl md:text-6xl opacity-10">📅</div>
        </div>
      </div>

      {/* Leave Details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
        <div className="bg-white p-4 sm:p-5 md:p-6 rounded-xl shadow-lg border border-gray-100">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-700">
                Approved Leave
              </h3>
              <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-green-600">
                {approvedDays} days
              </p>
              <p className="text-gray-400 mt-1 text-xs sm:text-sm">
                Total approved leave days
              </p>
            </div>
            <div className="text-3xl sm:text-4xl opacity-20">✅</div>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 md:p-6 rounded-xl shadow-lg border border-gray-100">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-700">
                Unpaid Leave
              </h3>
              <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-red-600">
                {Math.max(0, approvedDays - (employeeProfile.allocatedLeaves || 0))} days
              </p>
              <p className="text-gray-400 mt-1 text-xs sm:text-sm">
                Unpaid leave days used
              </p>
            </div>
            <div className="text-3xl sm:text-4xl opacity-20">⏳</div>
          </div>
        </div>
      </div>

      {/* Leave Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
        {[
          { title: "Pending Requests", value: summary.pending, color: "bg-yellow-500", icon: "⏳" },
          { title: "Approved Requests", value: summary.approved, color: "bg-green-500", icon: "✅" },
          { title: "Rejected Requests", value: summary.rejected, color: "bg-red-500", icon: "❌" },
        ].map((stat, i) => (
          <div
            key={i}
            className="bg-white p-4 sm:p-5 md:p-6 rounded-xl shadow-lg transform hover:scale-105 transition cursor-pointer"
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs sm:text-sm text-gray-500">{stat.title}</p>
                <p className="text-2xl sm:text-3xl md:text-4xl font-bold">{stat.value}</p>
                <p className="text-[10px] sm:text-xs mt-1 text-gray-500">Click to view details</p>
              </div>
              <div className={`${stat.color} p-2 sm:p-3 rounded-full text-white text-lg sm:text-xl`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardPage;
