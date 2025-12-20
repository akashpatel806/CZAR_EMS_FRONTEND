



import React, { useEffect, useState } from "react";
import { useEmployeeProfile } from "../../hooks/useEmployeeProfile";
import axiosInstance from "../../api/axiosInstance";
import { useAuth } from "../../context/AuthContext";

const ProfilePage = () => {
  const { profile: employeeProfile, loading } = useEmployeeProfile();
  const { user, role, token } = useAuth();

  const [adminProfile, setAdminProfile] = useState(null);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [profileData, setProfileData] = useState({
    name: '',
    phone: '',
    department: '',
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
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
        console.log("server response : ", res);

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



  // 🧩 Handlers

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

  // ✅ Password Visibility Toggle Handlers
  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  // ✅ Edit Profile Handlers
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditProfile = () => {
    setProfileData({
      name: profile.name || '',
      phone: profile.phone || '',
      department: profile.department || '',
    });
    setIsEditingProfile(true);
  };

  const handleSaveProfile = async () => {
    try {
      if (!profileData.name.trim()) {
        alert('Name is required');
        return;
      }

      await axiosInstance.put(`/admin/update/${profile._id}`, profileData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert('Profile updated successfully!');
      setIsEditingProfile(false);
      // Refresh admin profile
      const res = await axiosInstance.get(`/admin/get-admin-details?id=${user._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAdminProfile(res.data.admin);
    } catch (error) {
      console.error('Update profile error:', error);
      alert(error.response?.data?.message || 'Failed to update profile');
    }
  };

  const handleCancelProfile = () => {
    setProfileData({ name: '', phone: '', department: '' });
    setIsEditingProfile(false);
  };

  // 🧱 UI starts here
  return (
    <div className="w-full mx-auto bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden border border-gray-100">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 sm:p-6 md:p-8 text-white flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white/20 border-2 border-white/40 overflow-hidden flex-shrink-0 shadow-md mx-auto sm:mx-0 relative">
          {profile.profilePhoto && (
            <img
              src={`/uploads/${profile.profilePhoto}`}
              alt="profile"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          )}
          <div className={`absolute inset-0 flex justify-center items-center text-3xl sm:text-4xl font-bold ${profile.profilePhoto ? 'hidden' : ''}`}>
            {profile.name?.[0]?.toUpperCase()}
          </div>
        </div>

        <div className="text-center sm:text-left">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1">{profile.name}</h2>
          <p className="text-blue-100 text-xs sm:text-sm mb-1">
            {role === "admin" && "admin"}
          </p>
          <p className="text-blue-200 text-xs sm:text-sm">
            {role === "employee" && "employee"}

          </p>
        </div>
      </div>

      {/* Profile Details */}
      <div className="p-4 sm:p-6 md:p-8 bg-gray-50">
        <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-3 sm:mb-4 border-b pb-2">
          Personal Information
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 md:gap-6 text-gray-700">
          {/* Email */}
          <div>
            <p className="font-medium text-gray-500 text-xs sm:text-sm mb-1">📧 Email</p>
            <p className="text-sm sm:text-base break-words">{role === "admin" ? profile.email : profile.personalEmail}</p>
          </div>

          {/* Phone */}
          <div>
            <p className="font-medium text-gray-500 text-xs sm:text-sm mb-1">📞 Phone</p>
            <p className="text-sm sm:text-base">{profile.phone || "N/A"}</p>
          </div>

          {/* Admin-specific fields */}
          {role === "admin" && (
            <>
              <div>
                <p className="font-medium text-gray-500 text-xs sm:text-sm mb-1">🏢 Department</p>
                <p className="text-sm sm:text-base">{profile.department || "N/A"}</p>
              </div>
            </>
          )}

          {/* Employee-specific fields */}
          {role === "employee" && (
            <>
              <div>
                <p className="font-medium text-gray-500 text-xs sm:text-sm mb-1">🏢 Department</p>
                <p className="text-sm sm:text-base">{profile.department || "N/A"}</p>
              </div>
              <div>
                <p className="font-medium text-gray-500 text-xs sm:text-sm mb-1">💼 Position</p>
                <p className="text-sm sm:text-base">{profile.position || "N/A"}</p>
              </div>
              <div>
                <p className="font-medium text-gray-500 text-xs sm:text-sm mb-1">🆔 Employee ID</p>
                <p className="text-sm sm:text-base">{profile.employeeId || "N/A"}</p>
              </div>
              <div>
                <p className="font-medium text-gray-500 text-xs sm:text-sm mb-1">📅 Date of Joining</p>
                <p className="text-sm sm:text-base">{profile.dateOfJoining ? new Date(profile.dateOfJoining).toLocaleDateString() : "N/A"}</p>
              </div>
              <div>
                <p className="font-medium text-gray-500 text-xs sm:text-sm mb-1">🎂 Date of Birth</p>
                <p className="text-sm sm:text-base">{profile.dateOfBirth ? new Date(profile.dateOfBirth).toLocaleDateString() : "N/A"}</p>
              </div>
              <div>
                <p className="font-medium text-gray-500 text-xs sm:text-sm mb-1">📬 Work Email</p>
                <p className="text-sm sm:text-base break-words">{profile.workEmail || "N/A"}</p>
              </div>
            </>
          )}
        </div>
      </div>



      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 p-4 sm:p-6 border-t bg-gray-50">
        {role === "admin" && (
          <button
            onClick={handleEditProfile}
            className="w-full sm:w-auto px-5 sm:px-6 py-2.5 sm:py-3 bg-blue-600 text-white text-sm sm:text-base rounded-lg hover:bg-blue-700 transition shadow-sm"
          >
            ✏️ Edit Profile
          </button>
        )}
        <button
          onClick={() => setIsChangingPassword(true)}
          className="w-full sm:w-auto px-5 sm:px-6 py-2.5 sm:py-3 bg-green-600 text-white text-sm sm:text-base rounded-lg hover:bg-green-700 transition shadow-sm"
        >
          🔒 Change Password
        </button>
      </div>



      {/* Change Password Modal */}
      {isChangingPassword && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-lg p-5 sm:p-6 md:p-8 relative max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={handleCancelPassword}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h3 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-green-700 border-b pb-2 pr-8">
              Change Password
            </h3>

            <div className="space-y-3 sm:space-y-4">
              <div className="flex flex-col">
                <label className="text-xs sm:text-sm font-medium text-gray-600 mb-1.5 sm:mb-2">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.current ? "text" : "password"}
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    placeholder="Enter your current password"
                    className="border border-gray-300 rounded-lg px-3 py-2 pr-10 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-green-500 transition w-full"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('current')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showPasswords.current ? (
                      <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                      </svg>
                    ) : (
                      <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div className="flex flex-col">
                <label className="text-xs sm:text-sm font-medium text-gray-600 mb-1.5 sm:mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.new ? "text" : "password"}
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    placeholder="Enter new password (min 6 chars)"
                    className="border border-gray-300 rounded-lg px-3 py-2 pr-10 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-green-500 transition w-full"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('new')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showPasswords.new ? (
                      <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                      </svg>
                    ) : (
                      <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div className="flex flex-col">
                <label className="text-xs sm:text-sm font-medium text-gray-600 mb-1.5 sm:mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.confirm ? "text" : "password"}
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    placeholder="Confirm your new password"
                    className="border border-gray-300 rounded-lg px-3 py-2 pr-10 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-green-500 transition w-full"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('confirm')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showPasswords.confirm ? (
                      <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                      </svg>
                    ) : (
                      <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 sm:gap-3 mt-6 sm:mt-8">
              <button
                onClick={handleChangePassword}
                className="w-full sm:w-auto px-4 sm:px-5 py-2 bg-green-600 text-white text-sm sm:text-base rounded-lg hover:bg-green-700 transition"
              >
                Change Password
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {isEditingProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-lg p-5 sm:p-6 md:p-8 relative max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-blue-700 border-b pb-2">
              Edit Profile
            </h3>

            <div className="space-y-3 sm:space-y-4">
              <div className="flex flex-col">
                <label className="text-xs sm:text-sm font-medium text-gray-600 mb-1.5 sm:mb-2">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={profileData.name}
                  onChange={handleProfileChange}
                  placeholder="Enter your name"
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 transition w-full"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-xs sm:text-sm font-medium text-gray-600 mb-1.5 sm:mb-2">
                  Phone
                </label>
                <input
                  type="text"
                  name="phone"
                  value={profileData.phone}
                  onChange={handleProfileChange}
                  placeholder="Enter your phone number"
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 transition w-full"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-xs sm:text-sm font-medium text-gray-600 mb-1.5 sm:mb-2">
                  Department
                </label>
                <input
                  type="text"
                  name="department"
                  value={profileData.department}
                  onChange={handleProfileChange}
                  placeholder="Enter your department"
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 transition w-full"
                />
              </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 mt-6 sm:mt-8">
              <button
                onClick={handleCancelProfile}
                className="w-full sm:w-auto px-4 sm:px-5 py-2 border border-gray-300 text-sm sm:text-base rounded-lg hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProfile}
                className="w-full sm:w-auto px-4 sm:px-5 py-2 bg-blue-600 text-white text-sm sm:text-base rounded-lg hover:bg-blue-700 transition"
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
