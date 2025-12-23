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
  const { token, user, role } = useAuth();
  const navigate = useNavigate();
  const searchInputRef = useRef(null);
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 500);
  const [filterDept, setFilterDept] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [activeTab, setActiveTab] = useState("edit");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    personalEmail: "",
    dateOfBirth: "",
    dateOfJoining: "",
    allocatedLeaves: "",
    department: "",
    position: "",
    role: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const employeesPerPage = 10;

  // Use the document management hook
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
    isDocumentPreviewOpen,
    previewDocument,
    fileInputRef,
    fetchDocs,
    handleFileUpload,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleViewDocument,
    closeDocumentPreview,
    handleDeleteDocument,
  } = useDocumentManagement(selectedEmployee, token, activeTab === "salarySlips");

  // Fetch documents when employee is selected or tab changes
  useEffect(() => {
    if (selectedEmployee && (activeTab === "documents" || activeTab === "salarySlips")) {
      fetchDocs();
    }
  }, [selectedEmployee, activeTab, fetchDocs]);

  // ✅ Fetch employees from backend with search
  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/admin/all-employees", {
        params: { search: debouncedSearch },
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(res);

      setEmployees(res.data.employees || []);
      // Keep the search input focused after search
      if (searchInputRef.current) {
        searchInputRef.current.focus();
      }
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

  // Keep the search input focused after search results are loaded
  useEffect(() => {
    if (searchTerm && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [employees]);

  // Reset to first page on search or filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, filterDept]);



  // ✅ Get unique departments
  const departments = ["all", ...new Set(employees.map((emp) => emp.department))];



  // ✅ Apply department filter client-side
  const filteredEmployees = employees.filter((emp) => {
    const matchesDept = filterDept === "all" || emp.department === filterDept;
    return matchesDept;
  });

  // Pagination calculations
  const indexOfLastEmployee = currentPage * employeesPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
  const paginatedEmployees = filteredEmployees.slice(indexOfFirstEmployee, indexOfLastEmployee);
  const totalPages = Math.ceil(filteredEmployees.length / employeesPerPage);

  // ✅ Handle edit modal
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
    setFormData({
      name: "",
      phone: "",
      personalEmail: "",
      dateOfBirth: "",
      dateOfJoining: "",
      allocatedLeaves: "",
      department: "",
      position: "",
      role: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.put(
        `/admin/update-employee/${selectedEmployee.employeeId}`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Employee profile updated successfully");
      // Update the employees list
      fetchEmployees();
      closeEditModal();
    } catch (err) {
      console.error("Error updating employee:", err);
      toast.error("Failed to update employee");
    }
  };

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
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4" >
        <div>
          <h2 className="text-2xl font-bold text-gray-800">👥 Employees</h2>
          <p className="text-gray-500 text-sm mt-1">
            {filteredEmployees.length} of {employees.length} employees
          </p>
        </div>
        <Button
          onClick={() => navigate("/admin/add-employee")}
          variant="primary"
          className="flex items-center gap-2 px-4 py-2 w-full sm:w-auto justify-center"
        >
          <UserPlus size={18} />
          Add Employee
        </Button>
      </div>

      {/* Search & Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6" >
        {/* Search Input */}
        <div className="flex-1 relative" >
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            ref={searchInputRef}
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
            className="w-full sm:w-auto pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
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
                "Date of Joining",
                "Actions",
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
            {paginatedEmployees.length > 0 ? (
              paginatedEmployees.map((emp) => (
                <tr key={emp._id} className="hover:bg-gray-50 transition">
                  <td className="p-3 font-mono text-xs text-gray-600 whitespace-nowrap">
                    {emp.employeeId}
                  </td>
                  <td className="p-3 font-medium text-gray-900 capitalize whitespace-nowrap">
                    {emp.name}
                  </td>
                  <td className="p-3 text-gray-700 whitespace-nowrap">{emp.workEmail}</td>
                  <td className="p-3 text-gray-700 whitespace-nowrap">{emp.department}</td>
                  <td className="p-3 text-gray-700 whitespace-nowrap">{emp.position}</td>
                  <td className="p-3 whitespace-nowrap">
                    <Button
                      onClick={() => openModal(emp)}
                      variant="primary"
                      size="sm"
                      className="flex items-center gap-1 px-3 py-1 text-xs"
                    >
                      <Edit size={14} />
                      Edit
                    </Button>
                  </td>
                  <td className="p-3 text-gray-700 whitespace-nowrap">
                    {new Date(emp.dateOfJoining).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                  <td className="p-3 whitespace-nowrap">
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEditModal(emp)}
                        className="flex items-center gap-1 px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-xs"
                      >
                        <Edit size={14} />
                      </button>
                    </div>
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

      {/* Summary and Pagination Footer */}
      {filteredEmployees.length > 0 && (
        <div className="mt-4 text-sm text-gray-500 text-center">
          Showing {filteredEmployees.length} employee
          {filteredEmployees.length !== 1 ? "s" : ""}
        </div>
      )}

      {/* Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800">Edit Employee</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700 p-1 hover:bg-gray-100 rounded-full transition"
              >
                <X size={24} />
              </Button>
            </div>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Personal Email
                </label>
                <input
                  type="email"
                  value={formData.personalEmail}
                  onChange={(e) =>
                    setFormData({ ...formData, personalEmail: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) =>
                    setFormData({ ...formData, dateOfBirth: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date of Joining
                </label>
                <input
                  type="date"
                  value={formData.dateOfJoining}
                  onChange={(e) =>
                    setFormData({ ...formData, dateOfJoining: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Allocated Leaves
                </label>
                <input
                  type="number"
                  value={formData.allocatedLeaves}
                  onChange={(e) =>
                    setFormData({ ...formData, allocatedLeaves: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Department
                </label>
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) =>
                    setFormData({ ...formData, department: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Position
                </label>
                <input
                  type="text"
                  value={formData.position}
                  onChange={(e) =>
                    setFormData({ ...formData, position: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <select
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Employee">Employee</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
              <div className="col-span-1 md:col-span-2 flex justify-end gap-3 mt-4 pt-4 border-t border-gray-100">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={closeModal}
                  className="px-6 py-2.5 font-medium transition"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  className="px-6 py-2.5 font-medium shadow-sm transition"
                >
                  Update Employee
                </Button>
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <span className="text-sm text-gray-500">
              {(() => {
                const start = indexOfFirstEmployee + 1;
                const end = Math.min(indexOfLastEmployee, filteredEmployees.length);
                return `Showing ${start} to ${end} of ${filteredEmployees.length} entries`;
              })()}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1 || totalPages <= 1}
                className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition text-sm"
              >
                Previous
              </button>
              <span className="text-sm text-gray-700">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages || totalPages <= 1}
                className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition text-sm"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {
        isEditModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-6xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
              <div className="flex gap-4">
                  <button
                    onClick={() => setActiveTab("edit")}
                    className={`px-4 py-2 rounded-lg font-medium transition ${activeTab === "edit"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                  >
                    Edit Employee
                  </button>
                  <button
                    onClick={() => setActiveTab("documents")}
                    className={`px-4 py-2 rounded-lg font-medium transition ${activeTab === "documents"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                  >
                    Employee Documents
                  </button>
                  <button
                    onClick={() => setActiveTab("salarySlips")}
                    className={`px-4 py-2 rounded-lg font-medium transition ${activeTab === "salarySlips"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                  >
                    Salary Slips
                  </button>
                </div>
                <button
                  onClick={closeEditModal}
                  className="text-gray-500 hover:text-gray-700 p-1 hover:bg-gray-100 rounded-full transition"
                >
                  <X size={24} />
                </button>
              </div>

              {activeTab === "edit" && (
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Personal Email
                    </label>
                    <input
                      type="email"
                      value={formData.personalEmail}
                      onChange={(e) =>
                        setFormData({ ...formData, personalEmail: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) =>
                        setFormData({ ...formData, dateOfBirth: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date of Joining
                    </label>
                    <input
                      type="date"
                      value={formData.dateOfJoining}
                      onChange={(e) =>
                        setFormData({ ...formData, dateOfJoining: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Allocated Leaves
                    </label>
                    <input
                      type="number"
                      value={formData.allocatedLeaves}
                      onChange={(e) =>
                        setFormData({ ...formData, allocatedLeaves: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Department
                    </label>
                    <input
                      type="text"
                      value={formData.department}
                      onChange={(e) =>
                        setFormData({ ...formData, department: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Position
                    </label>
                    <input
                      type="text"
                      value={formData.position}
                      onChange={(e) =>
                        setFormData({ ...formData, position: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Role
                    </label>
                    <select
                      value={formData.role}
                      onChange={(e) =>
                        setFormData({ ...formData, role: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Employee">Employee</option>
                      <option value="Admin">Admin</option>
                    </select>
                  </div>

                  <div className="col-span-1 md:col-span-2 flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={closeEditModal}
                      className="px-6 py-2.5 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium shadow-sm transition"
                    >
                      Update Employee
                    </button>
                  </div>
                </form>
              )}

              {activeTab === "documents" && (
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
                  showOnlySalarySlips={false}
                />
              )}

              {activeTab === "salarySlips" && (
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
                  showOnlySalarySlips={true}
                />
              )}
            </div>
          </div>
        )}


    </div>
  );
};

export default EmployeeListPage;
