import React, { useState } from "react";

const ProfilePage = () => {
  // 🧩 Dummy Employee Data
  const [employeeProfile, setEmployeeProfile] = useState({
    name: "John Doe",
    employeeId: "EMP123",
    position: "Software Engineer",
    department: "Development",
    availableLeaves: 12,
    dateOfJoining: "2019-06-12",
    dateOfBirth: "1995-08-25",
    email: "john.doe@example.com",
    phone: "+91 9876543210",
    profilePhoto: "",
  });

  const [myLeaveRequests] = useState([
    { id: 1, status: "approved" },
    { id: 2, status: "pending" },
    { id: 3, status: "approved" },
  ]);

  // 🧩 Derived Stats
  const yearsOfService = employeeProfile.dateOfJoining
    ? Math.floor((new Date() - new Date(employeeProfile.dateOfJoining)) / (1000 * 60 * 60 * 24 * 365))
    : 0;

  const age = employeeProfile.dateOfBirth
    ? Math.floor((new Date() - new Date(employeeProfile.dateOfBirth)) / (1000 * 60 * 60 * 24 * 365))
    : 0;

  const approvedLeaves = myLeaveRequests.filter((r) => r.status === "approved").length;

  // 🧩 Form State
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(employeeProfile);

  const handleEditProfile = () => {
    setFormData(employeeProfile);
    setIsEditing(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    setEmployeeProfile(formData);
    setIsEditing(false);
  };

  const handleCancel = () => setIsEditing(false);

  return (
    <div className="w-full mx-auto  bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white flex flex-col sm:flex-row sm:items-center gap-6">
        <div className="w-24 h-24 rounded-full bg-white/20 border-2 border-white/40 overflow-hidden flex-shrink-0 shadow-md">
          {employeeProfile.profilePhoto ? (
            <img
              src={employeeProfile.profilePhoto}
              alt="profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex justify-center items-center h-full text-4xl font-bold">
              {employeeProfile.name?.[0]?.toUpperCase()}
            </div>
          )}
        </div>

        <div>
          <h2 className="text-3xl font-bold mb-1">{employeeProfile.name}</h2>
          <p className="text-blue-100 text-sm mb-1">
            {employeeProfile.position} • {employeeProfile.department}
          </p>
          <p className="text-blue-200 text-sm">Employee ID: {employeeProfile.employeeId}</p>
        </div>
      </div>

      {/* Profile Details */}
      <div className="p-8 bg-gray-50">
        <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">
          Personal Information
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-gray-700">
          <div>
            <p className="font-medium text-gray-500">📧 Email</p>
            <p>{employeeProfile.email}</p>
          </div>
          <div>
            <p className="font-medium text-gray-500">📞 Phone</p>
            <p>{employeeProfile.phone}</p>
          </div>
          <div>
            <p className="font-medium text-gray-500">📅 Date of Joining</p>
            <p>{employeeProfile.dateOfJoining}</p>
          </div>
          <div>
            <p className="font-medium text-gray-500">🎂 Date of Birth</p>
            <p>{employeeProfile.dateOfBirth}</p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-8 bg-white border-t">
        {[
          { title: "Available Leaves", value: employeeProfile.availableLeaves, color: "text-blue-600" },
          { title: "Years of Service", value: yearsOfService, color: "text-green-600" },
          { title: "Age", value: age, color: "text-purple-600" },
          { title: "Approved Leaves", value: approvedLeaves, color: "text-orange-600" },
        ].map((stat, i) => (
          <div
            key={i}
            className="p-5 rounded-xl bg-gray-50 shadow-sm text-center hover:shadow-md transition-all duration-200 border border-gray-100"
          >
            <div className={`text-3xl font-bold ${stat.color}`}>{stat.value}</div>
            <p className="text-sm text-gray-500 mt-1">{stat.title}</p>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4 p-6 border-t bg-gray-50">
        <button
          onClick={handleEditProfile}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-sm"
        >
          ✏️ Edit Profile
        </button>
        <button
          onClick={() => alert('Change Password clicked!')}
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition shadow-sm"
        >
          🔒 Change Password
        </button>
      </div>

      {/* 🧩 Edit Form Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 relative">
            <h3 className="text-2xl font-semibold mb-6 text-blue-700 border-b pb-2">
              Edit Profile
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: "Name", name: "name" },
                { label: "Position", name: "position" },
                { label: "Department", name: "department" },
                { label: "Email", name: "email" },
                { label: "Phone", name: "phone" },
                { label: "Date of Joining", name: "dateOfJoining", type: "date" },
                { label: "Date of Birth", name: "dateOfBirth", type: "date" },
              ].map((field, i) => (
                <div key={i} className="flex flex-col">
                  <label className="text-sm font-medium text-gray-600 mb-1">
                    {field.label}
                  </label>
                  <input
                    type={field.type || "text"}
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  />
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-3 mt-8">
              <button
                onClick={handleCancel}
                className="px-5 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
