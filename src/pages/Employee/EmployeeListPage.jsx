// import React, { useState } from "react";
// import { Search, UserPlus, Filter } from "lucide-react";

// const useEmployeeList = () => {
//   const employees = [
//     {
//       "_id": "68e8c16bde0cf59c719518b8",
//       "employeeId": "ET-007",
//       "name": "shuchi",
//       "personalEmail": "shuchi@gmail.com",
//       "workEmail": "shuchi@company.com",
//       "dateOfBirth": "2001-04-18T00:00:00.000Z",
//       "dateOfJoining": "2023-12-15T00:00:00.000Z",
//       "availableLeaves": 20,
//       "department": "Engineering",
//       "position": "Embedded Developer",
//       "role": "Employee",
//       "userId": "68e8c16bde0cf59c719518b6",
//       "updatedAt": "2025-10-10T08:18:51.564Z",
//       "__v": 0
//     },
//     {
//       "_id": "68e8f1542962aa2ef344054f",
//       "employeeId": "ET-004",
//       "name": "JAGDISH",
//       "personalEmail": "jagdish@gmail.com",
//       "workEmail": "jagdish@company.com",
//       "dateOfBirth": "1995-07-21T00:00:00.000Z",
//       "dateOfJoining": "2022-11-17T00:00:00.000Z",
//       "availableLeaves": 20,
//       "department": "PRODUCTION",
//       "position": "PRODUCTION MANAGER",
//       "role": "Employee",
//       "userId": "68e8f1542962aa2ef344054d",
//       "updatedAt": "2025-10-10T11:43:16.348Z",
//       "__v": 0
//     }
//   ];
  
//   return { employees, loading: false, error: null };
// };

// const EmployeeListPage = () => {
//   const { employees, loading, error } = useEmployeeList();
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filterDept, setFilterDept] = useState("all");

//   // Get unique departments
//   const departments = ["all", ...new Set(employees.map(emp => emp.department))];

//   // Filter employees
//   const filteredEmployees = employees.filter(emp => {
//     const matchesSearch = 
//       emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       emp.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       emp.workEmail.toLowerCase().includes(searchTerm.toLowerCase());
    
//     const matchesDept = filterDept === "all" || emp.department === filterDept;
    
//     return matchesSearch && matchesDept;
//   });

//   if (loading) {
//     return (
//       <div className="flex flex-col justify-center items-center h-screen">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
//         <p className="text-gray-500">Loading employees...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
//           <h3 className="text-red-800 font-semibold mb-2">Error Loading Employees</h3>
//           <p className="text-red-600 text-sm">{error}</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
//       <div className="flex justify-between items-center mb-6">
//         <div>
//           <h2 className="text-2xl font-bold text-gray-800">👥 Employees </h2>
//           <p className="text-gray-500 text-sm mt-1">
//             {filteredEmployees.length} of {employees.length} employees
//           </p>
//         </div>
//         <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition" onClick={()=>{

//         }}> 
//           <UserPlus size={18} />
//           Add Employee
//         </button>
//       </div>

//       {/* Search and Filter */}
//       <div className="flex gap-4 mb-6">
//         <div className="flex-1 relative">
//           <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
//           <input
//             type="text"
//             placeholder="Search by name, ID, or email..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//         </div>
        
//         <div className="relative">
//           <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
//           <select
//             value={filterDept}
//             onChange={(e) => setFilterDept(e.target.value)}
//             className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
//           >
//             {departments.map(dept => (
//               <option key={dept} value={dept}>
//                 {dept === "all" ? "All Departments" : dept}
//               </option>
//             ))}
//           </select>
//         </div>
//       </div>

//       <div className="overflow-x-auto rounded-lg border border-gray-200">
//         <table className="w-full text-sm">
//           <thead className="bg-gray-50 border-b border-gray-200">
//             <tr>
//               {[
//                 "Employee ID",
//                 "Name",
//                 "Work Email",
//                 "Department",
//                 "Position",
//                 "Role",
//                 "Date of Joining",
//               ].map((head) => (
//                 <th
//                   key={head}
//                   className="p-3 text-left font-semibold text-gray-700 whitespace-nowrap"
//                 >
//                   {head}
//                 </th>
//               ))}
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-gray-200">
//             {filteredEmployees.length > 0 ? (
//               filteredEmployees.map((emp) => (
//                 <tr key={emp._id} className="hover:bg-gray-50 transition">
//                   <td className="p-3 font-mono text-xs text-gray-600">{emp.employeeId}</td>
//                   <td className="p-3 font-medium text-gray-900 capitalize">{emp.name.toLowerCase()}</td>
//                   <td className="p-3 text-gray-700">{emp.workEmail}</td>
//                   <td className="p-3 text-gray-700">{emp.department}</td>
//                   <td className="p-3 text-gray-700">{emp.position}</td>
//                   <td className="p-3">
//                     <span
//                       className={`px-3 py-1 rounded-full text-xs font-medium ${
//                         emp.role === "Admin"
//                           ? "bg-blue-100 text-blue-700"
//                           : "bg-green-100 text-green-700"
//                       }`}
//                     >
//                       {emp.role}
//                     </span>
//                   </td>
//                   <td className="p-3 text-gray-700">
//                     {new Date(emp.dateOfJoining).toLocaleDateString('en-US', {
//                       year: 'numeric',
//                       month: 'short',
//                       day: 'numeric'
//                     })}
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td
//                   colSpan="7"
//                   className="text-center py-12"
//                 >
//                   <div className="flex flex-col items-center">
//                     <div className="bg-gray-100 rounded-full p-4 mb-3">
//                       <Search className="text-gray-400" size={24} />
//                     </div>
//                     <p className="text-gray-500 font-medium">No employees found</p>
//                     <p className="text-gray-400 text-sm">Try adjusting your search or filter</p>
//                   </div>
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       {filteredEmployees.length > 0 && (
//         <div className="mt-4 text-sm text-gray-500 text-center">
//           Showing {filteredEmployees.length} employee{filteredEmployees.length !== 1 ? 's' : ''}
//         </div>
//       )}
//     </div>
//   );
// };

// export default EmployeeListPage;

import React, { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";
import { useAuth } from "../../context/AuthContext";
import { Search, UserPlus, Filter } from "lucide-react";
import toast from "react-hot-toast";

const EmployeeListPage = () => {
  const { token } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDept, setFilterDept] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ✅ Fetch employees from backend
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await axiosInstance.get("/admin/all-employees", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log(res);
        
        setEmployees(res.data || []);
        setFilteredEmployees(res.data.employees || []);
      } catch (err) {
        console.error("Error fetching employees:", err);
        setError("Failed to fetch employee data.");
        toast.error("Failed to load employees");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, [token]);

  // ✅ Get unique departments
  const departments = ["all", ...new Set(employees.map((emp) => emp.department))];

  // ✅ Apply search and filter dynamically
  useEffect(() => {
    const filtered = employees.filter((emp) => {
      const matchesSearch =
        emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.workEmail.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesDept = filterDept === "all" || emp.department === filterDept;

      return matchesSearch && matchesDept;
    });
    setFilteredEmployees(filtered);
  }, [searchTerm, filterDept, employees]);

  // ✅ Loading State
  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-500">Loading employees...</p>
      </div>
    );
  }

  // ✅ Error State
  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <h3 className="text-red-800 font-semibold mb-2">
            Error Loading Employees
          </h3>
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">👥 Employees</h2>
          <p className="text-gray-500 text-sm mt-1">
            {filteredEmployees.length} of {employees.length} employees
          </p>
        </div>
        <button
          onClick={() => toast("Add employee feature coming soon!")}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          <UserPlus size={18} />
          Add Employee
        </button>
      </div>

      {/* Search & Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        {/* Search Input */}
        <div className="flex-1 relative">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search by name, ID, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Filter Dropdown */}
        <div className="relative">
          <Filter
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={18}
          />
          <select
            value={filterDept}
            onChange={(e) => setFilterDept(e.target.value)}
            className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
          >
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept === "all" ? "All Departments" : dept}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Employee Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {[
                "Employee ID",
                "Name",
                "Work Email",
                "Department",
                "Position",
                "Role",
                "Date of Joining",
              ].map((head) => (
                <th
                  key={head}
                  className="p-3 text-left font-semibold text-gray-700 whitespace-nowrap"
                >
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredEmployees.length > 0 ? (
              filteredEmployees.map((emp) => (
                <tr key={emp._id} className="hover:bg-gray-50 transition">
                  <td className="p-3 font-mono text-xs text-gray-600">
                    {emp.employeeId}
                  </td>
                  <td className="p-3 font-medium text-gray-900 capitalize">
                    {emp.name}
                  </td>
                  <td className="p-3 text-gray-700">{emp.workEmail}</td>
                  <td className="p-3 text-gray-700">{emp.department}</td>
                  <td className="p-3 text-gray-700">{emp.position}</td>
                  <td className="p-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        emp.role === "Admin"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {emp.role}
                    </span>
                  </td>
                  <td className="p-3 text-gray-700">
                    {new Date(emp.dateOfJoining).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-12">
                  <div className="flex flex-col items-center">
                    <div className="bg-gray-100 rounded-full p-4 mb-3">
                      <Search className="text-gray-400" size={24} />
                    </div>
                    <p className="text-gray-500 font-medium">No employees found</p>
                    <p className="text-gray-400 text-sm">
                      Try adjusting your search or filter
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Summary Footer */}
      {filteredEmployees.length > 0 && (
        <div className="mt-4 text-sm text-gray-500 text-center">
          Showing {filteredEmployees.length} employee
          {filteredEmployees.length !== 1 ? "s" : ""}
        </div>
      )}
    </div>
  );
};

export default EmployeeListPage;
