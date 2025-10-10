import React, { useState } from "react";
import { addNewEmployee } from "../../hooks/useEmployeeProfile";
import { useNavigate } from "react-router-dom";

const AddEmployeePage = () => {
  const [formData, setFormData] = useState({
    name: "",
    personalEmail: "",
    dateOfBirth: "",
    dateOfJoining: "",
    department: "",
    position: "",
    employeeId: "",
    role: "Employee",
  });
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // ✅ Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addNewEmployee(formData); // 🧩 Handles toast internally
      // Reset form after success
      setFormData({
        name: "",
        personalEmail: "",
        dateOfBirth: "",
        dateOfJoining: "",
        department: "",
        position: "",
        employeeId: "",
        role: "Employee",
      });
    } catch (error) {
      console.error("Error creating employee:", error);
      // ❌ no need for extra toast — handled inside the hook
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-full mx-auto bg-white rounded-2xl shadow-lg border border-gray-100 p-10 mt-2">
      {/* Header */}
     <div className="flex flex-row justify-between items-center">
         <div className="mb-8 pb-4">
        <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          👤 Add New Employee
        </h2>
        <p className="text-gray-500 mt-1">
          Fill in the employee details below.
        </p>
     
      </div>
        <div>
        <button 
            className="px-8 py-3 rounded-lg font-semibold text-white transition bg-blue-900 hover:bg-blue-800 shadow-md"
            onClick={()=>{
                navigate("/admin/all-employees")
            }}
            >View All</button>
      </div>
     </div>
      {/* Form */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { name: "name", label: "Full Name", placeholder: "Enter employee name" },
          { name: "personalEmail", label: "Personal Email", type: "email", placeholder: "Enter personal email" },
          { name: "employeeId", label: "Employee ID", placeholder: "Ex: EMP001" },
          { name: "department", label: "Department", placeholder: "Ex: Engineering" },
          { name: "position", label: "Position", placeholder: "Ex: Software Engineer" },
          { name: "dateOfBirth", label: "Date of Birth", type: "date" },
          { name: "dateOfJoining", label: "Date of Joining", type: "date" },
        ].map((f) => (
          <div key={f.name}>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              {f.label}
            </label>
            <input
              type={f.type || "text"}
              name={f.name}
              value={formData[f.name]}
              onChange={handleChange}
              placeholder={f.placeholder}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none transition"
            />
          </div>
        ))}

        {/* Role Select */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Role
          </label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none transition"
          >
            <option value="Employee">Employee</option>
            <option value="Admin">Admin</option>
          </select>
        </div>
      </form>

      {/* Submit Button */}
      <div className="mt-10 flex justify-end">
        <button
          type="submit"
          onClick={handleSubmit}
          disabled={loading}
          className={`px-8 py-3 rounded-lg font-semibold text-white transition ${
            loading
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 shadow-md"
          }`}
        >
          {loading ? "Adding..." : "Add Employee"}
        </button>
      </div>
    </div>
  );
};

export default AddEmployeePage;
