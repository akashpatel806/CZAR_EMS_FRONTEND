import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import { useAuth } from "../../context/AuthContext";
import { Search, UserPlus, Filter, Edit, X } from "lucide-react";
import useDebounce from "../../hooks/useDebounce";
import useDocumentManagement from "../../hooks/useDocumentManagement";
import DocumentUploadSection from "../../components/DocumentUploadSection";
import toast from "react-hot-toast";
import Button from "../../components/Button";

const EmployeeListPage = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const searchInputRef = useRef(null);

  // States
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 500);
  const [filterDept, setFilterDept] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [activeTab, setActiveTab] = useState("edit");
  const [currentPage, setCurrentPage] = useState(1);
  const employeesPerPage = 10;

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    personalEmail: "",
    dateOfBirth: "",
    dateOfJoining: "",
    allocatedLeaves: "",
    department: "",
    position: "",
    role: "Employee",
  });

  // Document Management Hook
  const {
    documents,
    salarySlips,
    currentUploadType,
    setCurrentUploadType,
    uploading,
    isDragOver,
    salaryFromMonth,
    setSalaryFromMonth,
    salaryToMonth,
    setSalaryToMonth,
    fileInputRef,
    fetchDocs,
    handleFileUpload,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleViewDocument,
    handleDeleteDocument,
  } = useDocumentManagement(selectedEmployee, token, activeTab === "salarySlips");

  // Fetch employees
  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/admin/all-employees", {
        params: { search: debouncedSearch },
        headers: { Authorization: `Bearer ${token}` },
      });
      setEmployees(res.data.employees || []);
    } catch (err) {
      console.error("Error fetching employees:", err);
      setError("Failed to fetch employee data.");
      toast.error("Failed to load employees");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [token, debouncedSearch]);

  useEffect(() => {
    if (selectedEmployee && (activeTab === "documents" || activeTab === "salarySlips")) {
      fetchDocs();
    }
  }, [selectedEmployee, activeTab, fetchDocs]);

  // Filtering & Pagination
  const departments = ["all", ...new Set(employees.map((emp) => emp.department))];
  const filteredEmployees = employees.filter((emp) => 
    filterDept === "all" || emp.department === filterDept
  );

  const totalPages = Math.ceil(filteredEmployees.length / employeesPerPage);
  const indexOfLastEmployee = currentPage * employeesPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
  const paginatedEmployees = filteredEmployees.slice(indexOfFirstEmployee, indexOfLastEmployee);

  // Handlers
  const openEditModal = (employee) => {
    setSelectedEmployee(employee);
    setFormData({
      name: employee.name || "",
      phone: employee.phone || "",
      personalEmail: employee.personalEmail || "",
      dateOfBirth: employee.dateOfBirth ? new Date(employee.dateOfBirth).toISOString().split('T')[0] : "",
      dateOfJoining: employee.dateOfJoining ? new Date(employee.dateOfJoining).toISOString().split('T')[0] : "",
      allocatedLeaves: employee.allocatedLeaves || employee.availableLeaves || "",
      department: employee.department || "",
      position: employee.position || "",
      role: employee.role || "Employee",
    });
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedEmployee(null);
    setActiveTab("edit");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.put(
        `/admin/update-employee/${selectedEmployee.employeeId}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Employee profile updated successfully");
      fetchEmployees();
      closeEditModal();
    } catch (err) {
      toast.error("Failed to update employee");
    }
  };

  if (loading) return (
    <div className="flex flex-col justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
      <p>Loading employees...</p>
    </div>
  );

  if (error) return (
    <div className="flex justify-center items-center h-screen text-red-600 font-bold">{error}</div>
  );

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">👥 Employees</h2>
          <p className="text-gray-500 text-sm">{filteredEmployees.length} employees found</p>
        </div>
        <Button onClick={() => navigate("/admin/add-employee")} variant="primary" className="flex items-center gap-2">
          <UserPlus size={18} /> Add Employee
        </Button>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search employees..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <select
            className="pl-10 pr-8 py-2 border rounded-lg bg-white appearance-none"
            value={filterDept}
            onChange={(e) => setFilterDept(e.target.value)}
          >
            {departments.map(dept => <option key={dept} value={dept}>{dept === "all" ? "All Departments" : dept}</option>)}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-3">ID</th>
              <th className="p-3">Name</th>
              <th className="p-3">Department</th>
              <th className="p-3">Position</th>
              <th className="p-3">Joining Date</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paginatedEmployees.length > 0 ? (
              paginatedEmployees.map((emp) => (
                <tr key={emp._id} className="hover:bg-gray-50">
                  <td className="p-3 font-mono text-xs">{emp.employeeId}</td>
                  <td className="p-3 font-medium">{emp.name}</td>
                  <td className="p-3">{emp.department}</td>
                  <td className="p-3">{emp.position}</td>
                  <td className="p-3">{new Date(emp.dateOfJoining).toLocaleDateString()}</td>
                  <td className="p-3">
                    <button onClick={() => openEditModal(emp)} className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                      <Edit size={14} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="6" className="p-10 text-center text-gray-400">No employees found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-6">
          <span className="text-sm text-gray-500">Page {currentPage} of {totalPages}</span>
          <div className="flex gap-2">
            <Button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>Previous</Button>
            <Button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>Next</Button>
          </div>
        </div>
      )}

      {/* Edit/Document Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-5xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
              <div className="flex gap-2">
                {["edit", "documents", "salarySlips"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium capitalize ${activeTab === tab ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600"}`}
                  >
                    {tab.replace(/([A-Z])/g, ' $1')}
                  </button>
                ))}
              </div>
              <button onClick={closeEditModal} className="p-2 hover:bg-gray-100 rounded-full"><X size={24} /></button>
            </div>

            {activeTab === "edit" ? (
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.keys(formData).map((key) => (
                  <div key={key}>
                    <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">{key.replace(/([A-Z])/g, ' $1')}</label>
                    {key === "role" ? (
                      <select 
                        value={formData[key]} 
                        onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                        className="w-full p-2 border rounded-lg"
                      >
                        <option value="Employee">Employee</option>
                        <option value="Admin">Admin</option>
                      </select>
                    ) : (
                      <input
                        type={key.includes("date") ? "date" : key === "allocatedLeaves" ? "number" : "text"}
                        value={formData[key]}
                        onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                        className="w-full p-2 border rounded-lg"
                        required={key === "name"}
                      />
                    )}
                  </div>
                ))}
                <div className="col-span-full flex justify-end gap-3 mt-4">
                  <Button variant="secondary" onClick={closeEditModal}>Cancel</Button>
                  <Button type="submit">Update Profile</Button>
                </div>
              </form>
            ) : (
              <DocumentUploadSection
                selectedEmployee={selectedEmployee}
                token={token}
                documents={documents}
                salarySlips={salarySlips}
                currentUploadType={currentUploadType}
                setCurrentUploadType={setCurrentUploadType}
                uploading={uploading}
                isDragOver={isDragOver}
                salaryFromMonth={salaryFromMonth}
                setSalaryFromMonth={setSalaryFromMonth}
                salaryToMonth={salaryToMonth}
                setSalaryToMonth={setSalaryToMonth}
                fileInputRef={fileInputRef}
                handleFileUpload={handleFileUpload}
                handleDragOver={handleDragOver}
                handleDragLeave={handleDragLeave}
                handleDrop={handleDrop}
                handleViewDocument={handleViewDocument}
                handleDeleteDocument={handleDeleteDocument}
                fetchDocs={fetchDocs}
                showOnlySalarySlips={activeTab === "salarySlips"}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeListPage;