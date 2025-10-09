import React from "react";

const LeaveRequestTable = ({ leaveRequests }) => {
  return (
    <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
      <h2 className="text-2xl font-semibold mb-6 text-blue-600">
        My Leave Requests
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              {["Type", "From", "To", "Reason", "Status"].map((head) => (
                <th
                  key={head}
                  className="border border-gray-200 p-3 text-left font-medium text-gray-600"
                >
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {leaveRequests.length > 0 ? (
              leaveRequests.map((r) => (
                <tr key={r._id} className="hover:bg-gray-50 transition">
                  <td className="border p-3">{r.leaveType}</td>
                  <td className="border p-3">
                    {new Date(r.fromDate).toLocaleDateString()}
                  </td>
                  <td className="border p-3">
                    {new Date(r.toDate).toLocaleDateString()}
                  </td>
                  <td className="border p-3">{r.reason}</td>
                  <td className="border p-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        r.status === "approved"
                          ? "bg-green-100 text-green-800"
                          : r.status === "rejected"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="text-center py-4 text-gray-500 italic"
                >
                  No leave requests found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeaveRequestTable;
