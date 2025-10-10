import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const BASE_URL = "http://localhost:5000"; // adjust for production

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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(`${BASE_URL}/api/admin/employees`, formData, {
        headers: { Authorization: token },
      });

      toast.success(res.data.message || "Employee created successfully");
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
      toast.error(error.response?.data?.message || "Failed to create employee");
    }
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-blue-600 mb-6">Add New Employee</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {[
          { name: "name", label: "Full Name" },
          { name: "personalEmail", label: "Personal Email", type: "email" },
          { name: "employeeId", label: "Employee ID" },
          { name: "department", label: "Department" },
          { name: "position", label: "Position" },
          { name: "dateOfBirth", label: "Date of Birth", type: "date" },
          { name: "dateOfJoining", label: "Date of Joining", type: "date" },
        ].map((f) => (
          <div key={f.name}>
            <label className="block text-gray-600 text-sm mb-1">{f.label}</label>
            <input
              type={f.type || "text"}
              name={f.name}
              value={formData[f.name]}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        ))}

        <div>
          <label className="block text-gray-600 text-sm mb-1">Role</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="Employee">Employee</option>
            <option value="Admin">Admin</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Add Employee
        </button>
      </form>
    </div>
  );
};

export default AddEmployeePage;
