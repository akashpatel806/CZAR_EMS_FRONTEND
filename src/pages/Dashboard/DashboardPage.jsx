import React, { useEffect, useState } from "react";
import { useEmployeeProfile } from "../../hooks/useEmployeeProfile";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";

const BASE_URL = "http://localhost:5000";

const DashboardPage = () => {
  const { profile: employeeProfile, loading } = useEmployeeProfile();
  const { role } = useAuth();

  // ✅ Admin stats state
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
        const response = await axios.get(`${BASE_URL}/api/admin/admin-dashboard`);
        setAdminStats(response.data);
      } catch (err) {
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

  // ---------------- ADMIN DASHBOARD ----------------
  if (role === "admin") {
    const { totalEmployees, onLeaveToday, attendanceSummary, leaveRequests, upcomingBirthdays } =
      adminStats;

    return (
      <div className="space-y-8">
        {/* Header */}
        <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-blue-500">
          <h2 className="text-2xl font-bold text-blue-600 mb-1">
            Welcome, Admin 👋
          </h2>
          <p className="text-gray-600">Here’s what’s happening today.</p>
        </div>

        {/* Top Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: "Total Employees", value: totalEmployees, color: "bg-blue-500", icon: "👥" },
            { title: "On Leave Today", value: onLeaveToday, color: "bg-yellow-500", icon: "🏖️" },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-xl shadow-lg transform hover:scale-105 transition cursor-pointer"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-500">{item.title}</p>
                  <p className="text-3xl font-bold">{item.value}</p>
                </div>
                <div className={`${item.color} p-3 rounded-full text-white text-xl`}>
                  {item.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Leave Requests Section */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Pending Leave Requests
          </h3>
          {leaveRequests.length === 0 ? (
            <p className="text-gray-500 text-sm">No pending leave requests.</p>
          ) : (
            <table className="min-w-full border border-gray-200 text-sm">
              <thead className="bg-gray-100 text-gray-600">
                <tr>
                  <th className="p-2 text-left">Employee</th>
                  <th className="p-2 text-left">Type</th>
                  <th className="p-2 text-left">From</th>
                  <th className="p-2 text-left">To</th>
                  <th className="p-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {leaveRequests.map((r, i) => (
                  <tr key={i} className="border-t">
                    <td className="p-2">{r.employeeName}</td>
                    <td className="p-2">{r.leaveType}</td>
                    <td className="p-2">{r.fromDate}</td>
                    <td className="p-2">{r.toDate}</td>
                    <td className="p-2 text-yellow-600 font-semibold">{r.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Upcoming Birthdays Section */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Upcoming Birthdays 🎂
          </h3>
          {upcomingBirthdays.length === 0 ? (
            <p className="text-gray-500 text-sm">No upcoming birthdays.</p>
          ) : (
            <ul className="space-y-2">
              {upcomingBirthdays.map((emp, i) => (
                <li
                  key={i}
                  className="flex justify-between border-b pb-2 text-gray-700"
                >
                  <span>{emp.name}</span>
                  <span className="text-gray-500 text-sm">{emp.date}</span>
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
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-blue-500">
        <h2 className="text-2xl font-bold text-blue-600 mb-1">
          Hello, {employeeProfile.name || "Employee"}!
        </h2>
        <p className="text-gray-600">Welcome to your dashboard.</p>
      </div>

      {/* Leave Balance */}
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-gray-700">
              Available Leave Balance
            </h3>
            <p className="text-4xl font-bold text-green-600">
              {employeeProfile.availableLeaves || 0} days
            </p>
            <p className="text-gray-400 mt-1 text-sm">
              Remaining for this year
            </p>
          </div>
          <div className="text-6xl opacity-10">📅</div>
        </div>
      </div>

      {/* Leave Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { title: "Pending Requests", value: summary.pending, color: "bg-yellow-500", icon: "⏳" },
          { title: "Approved Requests", value: summary.approved, color: "bg-green-500", icon: "✅" },
          { title: "Rejected Requests", value: summary.rejected, color: "bg-red-500", icon: "❌" },
        ].map((stat, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-xl shadow-lg transform hover:scale-105 transition cursor-pointer"
          >
            <div className="flex justify-between">
              <div>
                <p className="text-gray-500">{stat.title}</p>
                <p className="text-3xl font-bold">{stat.value}</p>
                <p className="text-xs mt-1 text-gray-500">Click to view details</p>
              </div>
              <div className={`${stat.color} p-3 rounded-full text-white text-xl`}>
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
