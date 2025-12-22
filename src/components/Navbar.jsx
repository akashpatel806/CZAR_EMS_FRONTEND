import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LogoutModal from "./LogoutModal";
import Button from "./Button";

const Navbar = ({ onMenuClick }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Get initials for avatar
  const initials = user?.name
    ? user.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
    : "U";

  return (
    <header className="w-full bg-white shadow-sm border-b border-gray-200 flex items-center justify-between px-4 md:px-6 py-3">
      {/* Left side: Hamburger (Mobile) */}
      <Button onClick={onMenuClick} variant="ghost" size="icon" className="md:hidden text-gray-600 text-2xl">
        ☰
      </Button>

      {/* Right side: User info (Justify end on desktop, but we use justify-between for mobile layout) */}
      <div className="flex items-center gap-4 ml-auto">
        {/* Notification */}
        <Button variant="ghost" size="icon" className="text-lg text-gray-600 hover:text-blue-600 transition">
          🔔
        </Button>

        {/* User profile + logout */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-gray-700">
              {user?.name || "Guest"}
            </p>
            <p className="text-xs text-gray-400 capitalize">
              {user?.role || "user"}
            </p>
          </div>
          <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold shadow-md">
            {initials}
          </div>
        </div>

        {/* Logout Button */}
        <Button
          onClick={() => setShowLogoutModal(true)}
          variant="danger"
          size="sm"
          className="text-sm font-medium px-3 py-1.5 border-none"
        >
          Logout
        </Button>
      </div>

      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
      />
    </header>
  );
};

export default Navbar;
