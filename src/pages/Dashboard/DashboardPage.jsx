

// import React, { useEffect, useState } from "react";
// import axiosInstance from "../../api/axiosInstance"; // Custom axios with base URL + token

// const DashboardPage = () => {
//   const [employeeProfile, setEmployeeProfile] = useState(null);
//   const [leaveSummary, setLeaveSummary] = useState({
//     pending: 0,
//     approved: 0,
//     rejected: 0,
//   });

//   // ✅ Fetch profile with leave data
//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const res = await axiosInstance.get("/employee/profile");

//         // Response now contains:
//         // { name, availableLeaves, leaveRequests[], leaveSummary{} }
//         const data = res.data;
//         console.log(data);
        

//         setEmployeeProfile(data);

//         // Use pre-computed summary from backend if available
//         if (data.leaveSummary) {
//           setLeaveSummary(data.leaveSummary);
//         } else if (data.leaveRequests) {
//           // Or calculate manually (fallback)
//           const pending = data.leaveRequests.filter(
//             (req) => req.status === "Pending"
//           ).length;
//           const approved = data.leaveRequests.filter(
//             (req) => req.status === "Approved"
//           ).length;
//           const rejected = data.leaveRequests.filter(
//             (req) => req.status === "Rejected"
//           ).length;
//           setLeaveSummary({ pending, approved, rejected });
//         }
//       } catch (error) {
//         console.error("Dashboard data fetch error:", error);
//       }
//     };

//     fetchProfile();
//   }, []);

//   if (!employeeProfile) {
//     return (
//       <div className="flex justify-center items-center h-screen text-gray-600">
//         Loading dashboard...
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-8">
//       {/* Welcome Section */}
//       <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-blue-500">
//         <h2 className="text-2xl font-bold text-blue-600 mb-1">
//           Hello, {employeeProfile.name || "Employee"}!
//         </h2>
//         <p className="text-gray-600">Welcome to your dashboard.</p>
//       </div>

//       {/* Leave Balance */}
//       <div className="bg-gradient-to-r from-green-500 to-green-400 p-6 rounded-xl text-white">
//         <div className="flex justify-between items-center">
//           <div>
//             <h3 className="text-lg font-medium">Available Leave Balance</h3>
//             <p className="text-4xl font-bold">{employeeProfile.availableLeaves || 0} days</p>
//             <p className="text-green-100 mt-1">Remaining for this year</p>
//           </div>
//           <div className="text-6xl opacity-20">📅</div>
//         </div>
//       </div>

//       {/* Leave Summary Cards */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//         {[
//           { title: "Pending Requests", value: leaveSummary.pending, color: "bg-yellow-500", status: "pending" },
//           { title: "Approved Requests", value: leaveSummary.approved, color: "bg-green-500", status: "approved" },
//           { title: "Rejected Requests", value: leaveSummary.rejected, color: "bg-red-500", status: "rejected" },
//         ].map((stat, i) => (
//           <div
//             key={i}
//             className="bg-white p-6 rounded-xl shadow-lg transform hover:scale-105 transition cursor-pointer"
//           >
//             <div className="flex justify-between">
//               <div>
//                 <p className="text-gray-500">{stat.title}</p>
//                 <p className="text-3xl font-bold">{stat.value}</p>
//                 <p className="text-xs mt-1 text-gray-500">Click to view details</p>
//               </div>
//               <div className={`p-3 rounded-full text-white text-xl`}>
//                 {stat.status === "pending"
//                   ? "⏳"
//                   : stat.status === "approved"
//                   ? "✅"
//                   : "❌"}
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Quick Actions */}
//       <div className="bg-white p-6 rounded-xl shadow-lg">
//         <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
//         <div className="flex flex-wrap gap-4">
//           <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
//             Request Leave
//           </button>
//           <button className="px-6 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50">
//             View Profile
//           </button>
//           <button className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700">
//             View Payslip
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DashboardPage;


import React from "react";
import { useEmployeeProfile } from "../../hooks/useEmployeeProfile"; // ✅ use the hook

const DashboardPage = () => {
  const { profile: employeeProfile, loading } = useEmployeeProfile();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-600">
        Loading dashboard...
      </div>
    );
  }

  if (!employeeProfile) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-600">
        No profile found.
      </div>
    );
  }

  const { leaveSummary = {}, leaveRequests = [] } = employeeProfile;
  const summary =
  leaveSummary && Object.keys(leaveSummary).length > 0
    ? leaveSummary
    : {
        pending: leaveRequests.filter((r) => r.status === "Pending").length,
        approved: leaveRequests.filter((r) => r.status === "Approved").length,
        rejected: leaveRequests.filter((r) => r.status === "Rejected").length,
      };

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
