import React, { useState } from "react";

const DashboardPage = () => {
  // Temporary static data (you can later fetch this from API or context)
  const [employeeProfile] = useState({
    name: "John Doe",
    availableLeaves: 12,
  });

  const [pending] = useState(3);
  const [approved] = useState(15);
  const [rejected] = useState(2);

  const setActiveTab = (tab) => {
    console.log(`Switching to tab: ${tab}`);
    // In future, you can navigate or use a tab context
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-blue-500">
        <h2 className="text-2xl font-bold text-blue-600 mb-1">
          Hello, {employeeProfile?.name || "Employee"}!
        </h2>
        <p className="text-gray-600">Welcome to your dashboard.</p>
      </div>

      {/* Leave Balance */}
      <div className="bg-gradient-to-r from-green-500 to-green-400 p-6 rounded-xl text-white">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-medium">Available Leave Balance</h3>
            <p className="text-4xl font-bold">
              {employeeProfile?.availableLeaves || 0} days
            </p>
            <p className="text-green-100 mt-1">Remaining for this year</p>
          </div>
          <div className="text-6xl opacity-20">📅</div>
        </div>
      </div>

      {/* Leave Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { title: "Pending Requests", value: pending, color: "bg-yellow-500", status: "pending" },
          { title: "Approved Requests", value: approved, color: "bg-green-500", status: "approved" },
          { title: "Rejected Requests", value: rejected, color: "bg-red-500", status: "rejected" },
        ].map((stat, i) => (
          <div
            key={i}
            onClick={() => setActiveTab("leave-request")}
            className="bg-white p-6 rounded-xl shadow-lg transform hover:scale-105 transition cursor-pointer"
          >
            <div className="flex justify-between">
              <div>
                <p className="text-gray-500">{stat.title}</p>
                <p className="text-3xl font-bold">{stat.value}</p>
                <p className="text-xs mt-1 text-gray-500">Click to view details</p>
              </div>
              <div className={` p-3 rounded-full text-white text-xl`}>
                {stat.status === "pending" ? "⏳" : stat.status === "approved" ? "✅" : "❌"}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => setActiveTab("leave-request")}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Request Leave
          </button>
          <button
            onClick={() => setActiveTab("profile")}
            className="px-6 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50"
          >
            View Profile
          </button>
          <button
            onClick={() => setActiveTab("payroll")}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            View Payslip
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
