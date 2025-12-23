import React, { useEffect, useState } from "react";
import { useEmployeeProfile } from "../../hooks/useEmployeeProfile";
import { useAuth } from "../../context/AuthContext";
import axiosInstance from "../../api/axiosInstance";

const DashboardPage = () => {
  const { profile: employeeProfile, loading } = useEmployeeProfile();
  const { role } = useAuth();


  const [adminStats, setAdminStats] = useState({
    totalEmployees: 0,
    onLeaveToday: 0,
    leaveRequests: [],
    upcomingBirthdays: [],
    attendanceSummary: { present: 0, absent: 0 },
  });

  // ✅ Fetch admin dashboard data (only if role = admin)
  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const response = await axiosInstance.get("/admin/admin-dashboard");
        setAdminStats(response.data);
      } catch (err) {
        console.log(err?.response?.data);

        console.error("Error fetching admin dashboard data:", err);
      }
    };
    if (role === "admin") fetchAdminData();
  }, [role]);

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
  const { leaveSummary = {}, leaveRequests = [] } = employeeProfile || {};
  const summary =
    leaveSummary && Object.keys(leaveSummary).length > 0
      ? leaveSummary
      : {
        pending: leaveRequests.filter((r) => r.status === "Pending").length,
        approved: leaveRequests.filter((r) => r.status === "Approved").length,
        rejected: leaveRequests.filter((r) => r.status === "Rejected").length,
      };

  // Calculate approved days from leave requests
  const approvedDays = leaveRequests.filter((r) => r.status === "Approved").reduce((sum, r) => sum + (r.days || 0), 0);

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
