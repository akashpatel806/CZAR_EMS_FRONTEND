import React from "react";

const Navbar = () => {
  return (
    <header className="w-full bg-white shadow-sm border-b border-gray-200 flex items-center justify-end px-6 py-3">
     

      {/* Right side: User info */}
      <div className="flex items-center gap-4">
        <button className="text-sm text-gray-600 hover:text-blue-600 transition">
          🔔
        </button>
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-gray-700">John Doe</p>
            <p className="text-xs text-gray-400">Software Engineer</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold shadow-md">
            JD
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
