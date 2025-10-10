import React from "react";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: "📊", path: "/" },
    { id: "profile", label: "My Profile", icon: "👤", path: "/profile" },
    { id: "leave-request", label: "Leave Request", icon: "📝", path: "/leave-request" },
    { id: "payroll", label: "My Payroll", icon: "💰", path: "/payroll" },
    { id: "holidays", label: "Holiday Calendar", icon: "📅", path: "/holiday-calendar" },
    { id: "settings", label: "Settings", icon: "⚙️", path: "/settings" },
  ];

  return (
    <div className="w-64 fixed h-screen shadow-lg bg-white border-r border-gray-200">
      <div className="p-6">
        <h2 className="text-xl font-bold text-blue-600 mb-8">CZAR EMS</h2>
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.id}
              to={item.path}
              className={({ isActive }) =>
                `w-full px-4 py-3 rounded-lg flex items-center gap-3 transition-all ${
                  isActive
                    ? "bg-indigo-600 text-white scale-105"
                    : "text-gray-600 hover:bg-gray-100"
                }`
              }
            >
              <span>{item.icon}</span> <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
