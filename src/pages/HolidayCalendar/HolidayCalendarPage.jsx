
import React, { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

const HolidayCalendarPage = () => {
  const { role, token } = useAuth();
  const [theme] = useState("light");
  const [date, setDate] = useState(new Date());
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
const [messageType, setMessageType] = useState(""); // 'success' or 'error'


  // Admin modal states
  const [showModal, setShowModal] = useState(false);
  const [editHoliday, setEditHoliday] = useState(null);
const [formData, setFormData] = useState({
  name: "",
  fromDate: "",
  toDate: "",
  type: "National",
});


  // Fetch holidays (based on year)
  useEffect(() => {
    const fetchHolidays = async () => {
      try {
        const year = date.getFullYear();
        const endpoint =
          role === "admin"
            ? `/holidays/${year}`
            : `/holidays/${year}`; // same for both
        const res = await axiosInstance.get(endpoint, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log(res);
        
        setHolidays(res.data);
      } catch (error) {
        console.error("Error fetching holidays:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHolidays();
  }, [date, role, token]);

  // Month and year details
  const monthLabel = date.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
  const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  // Navigation
  const nextMonth = () => setDate(new Date(date.getFullYear(), date.getMonth() + 1));
  const prevMonth = () => setDate(new Date(date.getFullYear(), date.getMonth() - 1));

  const getHoliday = (d) => {
  const currentDate = new Date(date.getFullYear(), date.getMonth(), d);
  currentDate.setHours(0, 0, 0, 0);

  return holidays.find((h) => {
    const start = new Date(h.fromDate);
    const end = new Date(h.toDate);
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);
    return currentDate.getTime() >= start.getTime() && currentDate.getTime() <= end.getTime();
  });
};


  // 🧩 Admin CRUD Functions
  const handleAddOrUpdateHoliday = async (e) => {
    e.preventDefault();

    console.log(formData);
    
    try {
      if (editHoliday) {
        // Update existing
        await axiosInstance.put(`/holidays/${editHoliday._id}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        // Add new
        await axiosInstance.post(`/holidays/addHoliday`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      setShowModal(false);
      setEditHoliday(null);

      
      setFormData({ name: "", date: "", type: "National" });
      
      const res = await axiosInstance.get(`/holidays/${date.getFullYear()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHolidays(res.data);

      toast.success("success",{
        duration:1500
      })
      setShowModal(false)
    } catch (error) {
      // console.log();
      
      console.error("Error saving holiday:", error);
      alert("Failed to save holiday.");
    }
  };

  const handleDeleteHoliday = async (id) => {
    if (!window.confirm("Are you sure you want to delete this holiday?")) return;
    try {
      await axiosInstance.delete(`/holidays/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHolidays((prev) => prev.filter((h) => h._id !== id));
    } catch (error) {
      console.error("Error deleting holiday:", error);
    }
  };

  const openModal = (holiday = null) => {
    setEditHoliday(holiday);
    // setFormData(
    //   holiday
    //     ? { name: holiday.name, date: holiday.date.split("T")[0], type: holiday.type }
    //     : { name: "", date: "", type: "National" }
    // );

    setFormData(
  holiday
    ? {
        name: holiday.name,
        fromDate: holiday.fromDate?.split("T")[0] || "",
        toDate: holiday.toDate?.split("T")[0] || "",
        type: holiday.type || "National",
      }
    : {
        name: "",
        fromDate: "",
        toDate: "",
        type: "National",
      }
);

    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditHoliday(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-600">
        Loading holidays...
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Page Content */}
      <div className="flex-1 p-6 bg-gray-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-xl shadow-lg mb-10 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Holiday Calendar</h1>
            <p className="text-blue-100">
              View all upcoming holidays and plan your leaves effectively.
            </p>
          </div>
          {role === "admin" && (
            <button
              onClick={() => openModal()}
              className="px-5 py-2 bg-white text-blue-700 rounded-lg shadow hover:bg-blue-100"
            >
              ➕ Add Holiday
            </button>
          )}
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
              const dateObj = new Date(date.getFullYear(), date.getMonth(), day);
              const isSunday = dateObj.getDay() === 0;

              return (
                <div
                  key={day}
                  className={`relative p-3 rounded-lg text-sm transition-all cursor-pointer ${
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
                  {role === "admin" && holiday && (
                    <div className="absolute top-1 right-1 flex gap-1">
                      <button
                        onClick={() => openModal(holiday)}
                        className="text-xs bg-blue-500 text-white rounded px-1 hover:bg-blue-600"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDeleteHoliday(holiday._id)}
                        className="text-xs bg-red-500 text-white rounded px-1 hover:bg-red-600"
                      >
                        x
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

  {/* 🧩 Modal for Add/Edit Holiday (Admin Only) */}
{showModal && (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
    style={{ position: "fixed" }}
  >
    <div
      className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 mx-4 border border-gray-200"
      style={{ zIndex: 60 }}
    >
      {/* Close Button (optional) */}
      <button
        onClick={closeModal}
        className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
      >
        ✖
      </button>

      <h3 className="text-2xl font-semibold mb-6 text-blue-700 border-b pb-2">
        {editHoliday ? "Edit Holiday" : "Add Holiday"}
      </h3>

      <form onSubmit={handleAddOrUpdateHoliday} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-600">
            Holiday Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            required
            className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {/* Date Range (From → To) */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-600">
              From Date
            </label>
            <input
              type="date"
              name="fromDate"
              value={formData.fromDate}
              onChange={(e) =>
                setFormData({ ...formData, fromDate: e.target.value })
              }
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">
              To Date
            </label>
            <input
              type="date"
              name="toDate"
              value={formData.toDate}
              onChange={(e) =>
                setFormData({ ...formData, toDate: e.target.value })
              }
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600">
            Type
          </label>
          <select
            name="type"
            value={formData.type}
            onChange={(e) =>
              setFormData({ ...formData, type: e.target.value })
            }
            className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="National">National</option>
            <option value="Festival">Festival</option>
            <option value="Optional">Optional</option>
          </select>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={closeModal}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  </div>
)}

    </div>
  );
};

export default HolidayCalendarPage;
