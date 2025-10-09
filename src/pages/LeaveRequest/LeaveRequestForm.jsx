import React, { useState } from "react";

const LeaveRequestForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    leaveType: "casual",
    fromDate: "",
    toDate: "",
    reason: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({ leaveType: "casual", fromDate: "", toDate: "", reason: "" });
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
      <h2 className="text-2xl font-semibold mb-6 text-blue-600">
        Submit Leave Request
      </h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Leave Type */}
        <div>
          <label className="block text-sm font-medium mb-2">Leave Type</label>
          <select
            value={formData.leaveType}
            onChange={(e) => setFormData({ ...formData, leaveType: e.target.value })}
            className="w-full p-3 border rounded-lg bg-white border-gray-300 focus:ring-2 focus:ring-blue-500"
          >
            {["casual", "sick", "annual", "emergency"].map((opt) => (
              <option key={opt} value={opt}>
                {opt.charAt(0).toUpperCase() + opt.slice(1)} Leave
              </option>
            ))}
          </select>
        </div>

        {/* From Date */}
        <div>
          <label className="block text-sm font-medium mb-2">From Date</label>
          <input
            type="date"
            value={formData.fromDate}
            onChange={(e) => setFormData({ ...formData, fromDate: e.target.value })}
            required
            className="w-full p-3 border rounded-lg bg-white border-gray-300 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* To Date */}
        <div>
          <label className="block text-sm font-medium mb-2">To Date</label>
          <input
            type="date"
            value={formData.toDate}
            onChange={(e) => setFormData({ ...formData, toDate: e.target.value })}
            required
            className="w-full p-3 border rounded-lg bg-white border-gray-300 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Reason */}
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium mb-2">Reason</label>
          <textarea
            value={formData.reason}
            onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
            rows="3"
            required
            placeholder="Enter reason for leave..."
            className="w-full p-3 border rounded-lg bg-white border-gray-300 focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>

        {/* Submit */}
        <div className="sm:col-span-2 flex justify-end">
          <button
            type="submit"
            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
          >
            Submit Leave
          </button>
        </div>
      </form>
    </div>
  );
};

export default LeaveRequestForm;
