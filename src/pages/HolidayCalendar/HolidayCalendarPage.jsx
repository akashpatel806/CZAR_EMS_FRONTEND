import React, { useState } from "react";
import Navbar from "../../components/Navbar";

const HolidayCalendarPage = () => {
  const [theme] = useState("light"); // can switch later via ThemeContext
  const [date, setDate] = useState(new Date());

  // Dummy holidays
  const holidays = [
    { date: "2025-01-01", name: "New Year’s Day" },
    { date: "2025-01-26", name: "Republic Day" },
    { date: "2025-03-17", name: "Holi" },
    { date: "2025-08-15", name: "Independence Day" },
    { date: "2025-10-02", name: "Gandhi Jayanti" },
    { date: "2025-12-25", name: "Christmas Day" },
  ];

  // Month and year details
  const monthLabel = date.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
  const daysInMonth = new Date(
    date.getFullYear(),
    date.getMonth() + 1,
    0
  ).getDate();
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  // Navigation
  const nextMonth = () =>
    setDate(new Date(date.getFullYear(), date.getMonth() + 1));
  const prevMonth = () =>
    setDate(new Date(date.getFullYear(), date.getMonth() - 1));

  // Find if a date is a holiday
  const getHoliday = (d) => {
    const str = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(d).padStart(2, "0")}`;
    return holidays.find((h) => h.date.startsWith(str));
  };

  return (
    <div className="flex flex-col h-full">


      {/* Page Content */}
      <div className="flex-1 p-6 bg-gray-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-xl shadow-lg mb-10">
          <h1 className="text-2xl font-bold">Holiday Calendar</h1>
          <p className="text-blue-100">
            View all upcoming holidays and plan your leaves effectively.
          </p>
        </div>

        {/* Calendar Container */}
        <div
          className={`${
            theme === "dark" ? "bg-gray-800" : "bg-white"
          } p-8 rounded-xl shadow-lg border border-gray-100`}
        >
          {/* Calendar Header */}
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={prevMonth}
              className="px-3 py-1 rounded hover:bg-gray-200 text-gray-600"
            >
              ◀
            </button>
            <h2 className="text-xl font-bold text-blue-600">{monthLabel}</h2>
            <button
              onClick={nextMonth}
              className="px-3 py-1 rounded hover:bg-gray-200 text-gray-600"
            >
              ▶
            </button>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 text-center gap-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
              <div
                key={d}
                className="font-semibold text-gray-500 border-b border-gray-200 pb-2"
              >
                {d}
              </div>
            ))}

            {/* Empty spaces before first day */}
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`empty-${i}`}></div>
            ))}

            {/* Days of month */}
            {Array.from({ length: daysInMonth }, (_, i) => {
              const day = i + 1;
              const holiday = getHoliday(day);
              const dateObj = new Date(
                date.getFullYear(),
                date.getMonth(),
                day
              );
              const isSunday = dateObj.getDay() === 0;

              return (
                <div
                  key={day}
                  className={`p-3 rounded-lg text-sm transition-all ${
                    holiday
                      ? "bg-red-100 text-red-700 font-semibold shadow-sm"
                      : isSunday
                      ? "bg-purple-100 text-purple-700 font-medium"
                      : "hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  <div>{day}</div>
                  {holiday && (
                    <div className="text-xs font-medium mt-1">{holiday.name}</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HolidayCalendarPage;
