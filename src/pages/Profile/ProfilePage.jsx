// import React, { useState } from "react";
// import { useEmployeeProfile } from "../../hooks/useEmployeeProfile"; // 👈 Import custom hook
// import axiosInstance from "../../api/axiosInstance";
// import { useAuth } from "../../context/AuthContext";


// const ProfilePage = () => {
//   const { profile: employeeProfile, setProfile: setEmployeeProfile, loading } = useEmployeeProfile();
//   const [isEditing, setIsEditing] = useState(false);
//   const [formData, setFormData] = useState({});
//   const { role } = useAuth();

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-screen text-gray-600">
//         Loading profile...
//       </div>
//     );
//   }

//   if (!employeeProfile) {
//     return (
//       <div className="flex justify-center items-center h-screen text-gray-600">
//         No profile found.
//       </div>
//     );
//   }

//   // 🧩 Derived Stats
//   const yearsOfService = employeeProfile.dateOfJoining
//     ? Math.floor(
//         (new Date() - new Date(employeeProfile.dateOfJoining)) /
//           (1000 * 60 * 60 * 24 * 365)
//       )
//     : 0;

//   const age = employeeProfile.dateOfBirth
//     ? Math.floor(
//         (new Date() - new Date(employeeProfile.dateOfBirth)) /
//           (1000 * 60 * 60 * 24 * 365)
//       )
//     : 0;

//   const approvedLeaves =
//     employeeProfile.leaveRequests?.filter((r) => r.status === "Approved")
//       .length || 0;

//   // 🧩 Handlers
//   const handleEditProfile = () => {
//     setFormData(employeeProfile);
//     setIsEditing(true);
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSave = async () => {
//     try {
//       await axiosInstance.put(`/admin/employee/${employeeProfile._id}`, formData);
//       setEmployeeProfile(formData);
//       setIsEditing(false);
//       alert("Profile updated successfully!");
//     } catch (error) {
//       console.error("Update profile error:", error);
//       alert("Failed to update profile.");
//     }
//   };

//   const handleCancel = () => setIsEditing(false);

//   return (
//     <div className="w-full mx-auto bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
//       {/* Header Section */}
//       <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white flex flex-col sm:flex-row sm:items-center gap-6">
//         <div className="w-24 h-24 rounded-full bg-white/20 border-2 border-white/40 overflow-hidden flex-shrink-0 shadow-md">
//           {employeeProfile.profilePhoto ? (
//             <img
//               src={employeeProfile.profilePhoto}
//               alt="profile"
//               className="w-full h-full object-cover"
//             />
//           ) : (
//             <div className="flex justify-center items-center h-full text-4xl font-bold">
//               {employeeProfile.name?.[0]?.toUpperCase()}
//             </div>
//           )}
//         </div>

//         <div>
//           <h2 className="text-3xl font-bold mb-1">{employeeProfile.name}</h2>
//           <p className="text-blue-100 text-sm mb-1">
//             {employeeProfile.position} • {employeeProfile.department}
//           </p>
//           <p className="text-blue-200 text-sm">
//             Employee ID: {employeeProfile.employeeId}
//           </p>
//         </div>
//       </div>

//       {/* Profile Details */}
//       <div className="p-8 bg-gray-50">
//         <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">
//           Personal Information
//         </h3>

//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-gray-700">
//           <div>
//             <p className="font-medium text-gray-500">📧 Work Email</p>
//             <p>{employeeProfile.workEmail}</p>
//           </div>
//           <div>
//             <p className="font-medium text-gray-500">📞 Phone</p>
//             <p>{employeeProfile.phone || "N/A"}</p>
//           </div>
//           <div>
//             <p className="font-medium text-gray-500">📅 Date of Joining</p>
//             <p>{new Date(employeeProfile.dateOfJoining).toLocaleDateString()}</p>
//           </div>
//           <div>
//             <p className="font-medium text-gray-500">🎂 Date of Birth</p>
//             <p>{new Date(employeeProfile.dateOfBirth).toLocaleDateString()}</p>
//           </div>
//         </div>
//       </div>

//       {/* Stats Section */}
//       <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-8 bg-white border-t">
//         {[
//           {
//             title: "Available Leaves",
//             value: employeeProfile.availableLeaves,
//             color: "text-blue-600",
//           },
//           { title: "Years of Service", value: yearsOfService, color: "text-green-600" },
//           { title: "Age", value: age, color: "text-purple-600" },
//           { title: "Approved Leaves", value: approvedLeaves, color: "text-orange-600" },
//         ].map((stat, i) => (
//           <div
//             key={i}
//             className="p-5 rounded-xl bg-gray-50 shadow-sm text-center hover:shadow-md transition-all duration-200 border border-gray-100"
//           >
//             <div className={`text-3xl font-bold ${stat.color}`}>{stat.value}</div>
//             <p className="text-sm text-gray-500 mt-1">{stat.title}</p>
//           </div>
//         ))}
//       </div>

//       {/* Action Buttons */}
//       <div className="flex justify-center gap-4 p-6 border-t bg-gray-50">
//         <button
//           onClick={handleEditProfile}
//           className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-sm"
//         >
//           ✏️ Edit Profile
//         </button>
//         <button
//           onClick={() => alert("Change Password clicked!")}
//           className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition shadow-sm"
//         >
//           🔒 Change Password
//         </button>
//       </div>

//       {/* 🧩 Edit Form Modal */}
//       {isEditing && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 backdrop-blur-sm">
//           <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 relative">
//             <h3 className="text-2xl font-semibold mb-6 text-blue-700 border-b pb-2">
//               Edit Profile
//             </h3>

//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//               {[
//                 { label: "Name", name: "name" },
//                 { label: "Position", name: "position" },
//                 { label: "Department", name: "department" },
//                 { label: "Phone", name: "phone" },
//               ].map((field, i) => (
//                 <div key={i} className="flex flex-col">
//                   <label className="text-sm font-medium text-gray-600 mb-1">
//                     {field.label}
//                   </label>
//                   <input
//                     type="text"
//                     name={field.name}
//                     value={formData[field.name] || ""}
//                     onChange={handleChange}
//                     className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
//                   />
//                 </div>
//               ))}
//             </div>

//             <div className="flex justify-end gap-3 mt-8">
//               <button
//                 onClick={handleCancel}
//                 className="px-5 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleSave}
//                 className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
//               >
//                 Save Changes
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ProfilePage;



import React, { useEffect, useState } from "react";
import { useEmployeeProfile } from "../../hooks/useEmployeeProfile";
import axiosInstance from "../../api/axiosInstance";
import { useAuth } from "../../context/AuthContext";

const ProfilePage = () => {
  const { profile: employeeProfile, setProfile: setEmployeeProfile, loading } = useEmployeeProfile();
  const { user, role, token } = useAuth();

  const [adminProfile, setAdminProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [formData, setFormData] = useState({});
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [isLoadingAdmin, setIsLoadingAdmin] = useState(true);

  // ✅ Fetch admin profile when role = admin
  useEffect(() => {
    const fetchAdminProfile = async () => {
      if (role !== "admin" || !user?._id) return;
      try {
        console.log("id : ", user._id);
        
        const res = await axiosInstance.get(`/admin/get-admin-details?id=${user._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("server response : ",res);
        
        setAdminProfile(res.data.admin);
      } catch (error) {
        console.error("Error fetching admin details:", error);
      } finally {
        setIsLoadingAdmin(false);
      }
    };
    if (role === "admin") fetchAdminProfile();
  }, [role, user, token]);

  // ✅ Loading states
  if ((role === "employee" && loading) || (role === "admin" && isLoadingAdmin)) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-600">
        Loading profile...
      </div>
    );
  }

  // ✅ Select correct profile based on role
  const profile = role === "admin" ? adminProfile : employeeProfile;

  if (!profile) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-600">
        No profile found.
      </div>
    );
  }

  // 🧮 Derived Stats (only for employees)
  const yearsOfService =
    profile.dateOfJoining
      ? Math.floor((new Date() - new Date(profile.dateOfJoining)) / (1000 * 60 * 60 * 24 * 365))
      : 0;

  const age =
    profile.dateOfBirth
      ? Math.floor((new Date() - new Date(profile.dateOfBirth)) / (1000 * 60 * 60 * 24 * 365))
      : 0;

  const approvedLeaves =
    profile.leaveRequests?.filter((r) => r.status === "Approved").length || 0;

  // 🧩 Handlers
  const handleEditProfile = () => {
    setFormData(profile);
    setIsEditing(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const endpoint =
        role === "admin"
          ? `/admin/update/${profile._id}`
          : `/employee/profile`;
      await axiosInstance.put(endpoint, formData);
      if (role === "employee") setEmployeeProfile(formData);
      if (role === "admin") setAdminProfile(formData);
      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Update profile error:", error);
      alert("Failed to update profile.");
    }
  };

  const handleCancel = () => setIsEditing(false);

  // ✅ Change Password Handlers
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleChangePassword = async () => {
    try {
      if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
        alert('All fields are required');
        return;
      }

      if (passwordData.newPassword !== passwordData.confirmPassword) {
        alert('New passwords do not match');
        return;
      }

      if (passwordData.newPassword.length < 6) {
        alert('Password must be at least 6 characters');
        return;
      }

      const endpoint = role === "admin" ? `/admin/change-password` : `/employee/change-password`;
      await axiosInstance.put(endpoint, {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      alert('Password changed successfully!');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setIsChangingPassword(false);
    } catch (error) {
      console.error('Change password error:', error);
      alert(error.response?.data?.message || 'Failed to change password');
    }
  };

  const handleCancelPassword = () => {
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setIsChangingPassword(false);
  };

  // 🧱 UI starts here
  return (
    <div className="w-full mx-auto bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white flex flex-col sm:flex-row sm:items-center gap-6">
        <div className="w-24 h-24 rounded-full bg-white/20 border-2 border-white/40 overflow-hidden flex-shrink-0 shadow-md">
          {profile.profilePhoto ? (
            <img
              src={profile.profilePhoto}
              alt="profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex justify-center items-center h-full text-4xl font-bold">
              {profile.name?.[0]?.toUpperCase()}
            </div>
          )}
        </div>

        <div>
          <h2 className="text-3xl font-bold mb-1">{profile.name}</h2>
          <p className="text-blue-100 text-sm mb-1">
            {role === "admin" && "admin"}
          </p>
          <p className="text-blue-200 text-sm">
           {role === "employee" && "employee"}
          
          </p>
        </div>
      </div>

      {/* Profile Details */}
      <div className="p-8 bg-gray-50">
        <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">
          Personal Information
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-gray-700">
          {/* Email */}
          <div>
            <p className="font-medium text-gray-500">📧 Email</p>
            <p>{role === "admin" ? profile.email : profile.personalEmail}</p>
          </div>

          {/* Phone */}
          <div>
            <p className="font-medium text-gray-500">📞 Phone</p>
            <p>{profile.phone || "N/A"}</p>
          </div>

          {/* Admin-specific fields */}
          {role === "admin" && (
            <>
              <div>
                <p className="font-medium text-gray-500">🏢 Department</p>
                <p>{profile.department || "N/A"}</p>
              </div>
            </>
          )}

          {/* Employee-specific fields */}
          {role === "employee" && (
            <>
              <div>
                <p className="font-medium text-gray-500">🏢 Department</p>
                <p>{profile.department || "N/A"}</p>
              </div>
              <div>
                <p className="font-medium text-gray-500">💼 Position</p>
                <p>{profile.position || "N/A"}</p>
              </div>
              <div>
                <p className="font-medium text-gray-500">🆔 Employee ID</p>
                <p>{profile.employeeId || "N/A"}</p>
              </div>
              <div>
                <p className="font-medium text-gray-500">📅 Date of Joining</p>
                <p>{profile.dateOfJoining ? new Date(profile.dateOfJoining).toLocaleDateString() : "N/A"}</p>
              </div>
              <div>
                <p className="font-medium text-gray-500">🎂 Date of Birth</p>
                <p>{profile.dateOfBirth ? new Date(profile.dateOfBirth).toLocaleDateString() : "N/A"}</p>
              </div>
              <div>
                <p className="font-medium text-gray-500">📬 Work Email</p>
                <p>{profile.workEmail || "N/A"}</p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Stats Section — Only for Employee */}
      {role === "employee" && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-8 bg-white border-t">
          {[
            { title: "Available Leaves", value: profile.availableLeaves, color: "text-blue-600" },
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
      )}

      {/* Action Buttons */}
      <div className="flex justify-center gap-4 p-6 border-t bg-gray-50">
        <button
          onClick={handleEditProfile}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-sm"
        >
          ✏️ Edit Profile
        </button>
        <button
          onClick={() => setIsChangingPassword(true)}
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition shadow-sm"
        >
          🔒 Change Password
        </button>
      </div>

      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 relative">
            <h3 className="text-2xl font-semibold mb-6 text-blue-700 border-b pb-2">
              Edit Profile
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: "Name", name: "name", type: "text" },
                { label: "Department", name: "department", type: "text" },
                { label: "Phone", name: "phone", type: "text" },
                ...(role === "employee"
                  ? [
                      { label: "Position", name: "position", type: "text" },
                      { label: "Date of Birth", name: "dateOfBirth", type: "date" },
                    ]
                  : []),
              ].map((field, i) => (
                <div key={i} className="flex flex-col">
                  <label className="text-sm font-medium text-gray-600 mb-1">
                    {field.label}
                  </label>
                  {field.type === "date" ? (
                    <input
                      type="date"
                      name={field.name}
                      value={
                        formData[field.name]
                          ? new Date(formData[field.name]).toISOString().split("T")[0]
                          : ""
                      }
                      onChange={handleChange}
                      className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    />
                  ) : (
                    <input
                      type="text"
                      name={field.name}
                      value={formData[field.name] || ""}
                      onChange={handleChange}
                      className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    />
                  )}
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

      {/* Change Password Modal */}
      {isChangingPassword && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 relative">
            <h3 className="text-2xl font-semibold mb-6 text-green-700 border-b pb-2">
              Change Password
            </h3>

            <div className="space-y-4">
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-600 mb-2">
                  Current Password
                </label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  placeholder="Enter your current password"
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-600 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  placeholder="Enter new password (min 6 chars)"
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-600 mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  placeholder="Confirm your new password"
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-8">
              <button
                onClick={handleCancelPassword}
                className="px-5 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleChangePassword}
                className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                Change Password
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
