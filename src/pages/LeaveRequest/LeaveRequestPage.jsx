import React, { useState } from "react";
import LeaveRequestForm from "./LeaveRequestForm";
import LeaveRequestTable from "./LeaveRequestTable";

const LeaveRequestPage = () => {
  const [activeTab, setActiveTab] = useState("form"); // 'form' or 'list'

  const [leaveRequests, setLeaveRequests] = useState([
    {
      _id: 1,
      leaveType: "casual",
      fromDate: "2025-09-10",
      toDate: "2025-09-12",
      reason: "Family event",
      status: "approved",
    },
    {
      _id: 2,
      leaveType: "sick",
      fromDate: "2025-09-20",
      toDate: "2025-09-21",
      reason: "Fever",
      status: "pending",
    },
  ]);

  const handleNewRequest = (newRequest) => {
    const request = { ...newRequest, _id: Date.now(), status: "pending" };
    setLeaveRequests((prev) => [...prev, request]);
    setActiveTab("list"); // switch to list after submission
  };

  return (
    <div className="space-y-10">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-xl shadow-lg flex flex-col sm:flex-row justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Leave Requests</h1>
          <p className="text-blue-100">
            Submit and manage your leave requests.
          </p>
        </div>

        {/* Toggle Buttons */}
        <div className="mt-4 sm:mt-0 flex gap-3">
          <button
            onClick={() => setActiveTab("form")}
            className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === "form"
                ? "bg-white text-blue-700 shadow-md"
                : "bg-blue-500 hover:bg-blue-700 text-white"
            }`}
          >
            ➕ Submit Leave
          </button>
          <button
            onClick={() => setActiveTab("list")}
            className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === "list"
                ? "bg-white text-blue-700 shadow-md"
                : "bg-blue-500 hover:bg-blue-700 text-white"
            }`}
          >
            📋 View Requests
          </button>
        </div>
      </div>

      {/* Conditional Rendering */}
      {activeTab === "form" ? (
        <LeaveRequestForm onSubmit={handleNewRequest} />
      ) : (
        <LeaveRequestTable leaveRequests={leaveRequests} />
      )}
    </div>
  );
};

export default LeaveRequestPage;
