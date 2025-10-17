import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Sidebar = () => {
  const { role } = useAuth();

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: "📊", path: "/" },
    { id: "profile", label: "My Profile", icon: "👤", path: "/profile" },
    { id: "leave-request", label: "Leave Request", icon: "📝", path: "/leave-request" },
    { id: "holidays", label: "Holiday Calendar", icon: "📅", path: "/holiday-calendar" },
    { id: "attendance", label: "Attendance", icon: "⚙️", path: "/attendance" },

    // 👇 Admin-only items
    { id: "add-employee", label: "Employees", icon: "➕", path: "/admin/add-employee", role: "admin" },
  ];

  const filtered = menuItems.filter((item) => !item.role || item.role === role);

  return (
    <div className="w-64 fixed h-screen shadow-lg bg-white border-r border-gray-200">
      <div className="p-6">
        <h2 className="text-xl font-bold text-blue-600 mb-8">CZAR EMS</h2>
        <nav className="space-y-2">
          {filtered.map((item) => (
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
