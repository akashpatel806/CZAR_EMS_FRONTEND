// import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
// import { Search, Upload, Clock, Calendar as CalendarIcon, ChevronDown, ChevronLeft, ChevronRight, XCircle, CheckCircle, X, LogIn, User } from 'lucide-react';
// import axios from 'axios';

// // ===============================================
// // === 1. MOCK AUTHENTICATION HOOK ================
// // === (REPLACE WITH YOUR ACTUAL CONTEXT) =======
// // ===============================================

// // Replace the existing useAuth function with this:

// const useAuth = () => {
//     const userString = localStorage.getItem('user');
//     const token = localStorage.getItem('token');

//     // If not logged in, return nulls (handles security at UI level)
//     if (!userString || !token) {
//         return { role: null, isAuthenticated: false };
//     }
//     const user = JSON.parse(userString);
    
//     // Return the role so the UI knows which screen to show
//     return { 
//         role: user.role, // 'admin' or 'employee'
//         isAuthenticated: true,
//         token: token
//     };
// };

// // ===============================================
// // === 2. SHARED HELPERS & UTILITIES =============
// // ===============================================

// // Backend URL - Adjust if hosted elsewhere
// const API_BASE_URL = 'http://localhost:5002/api';

// const getStatusColor = (status) => {
//     if (status === 'Present') return 'bg-green-100 text-green-700 border-green-400';
//     if (status === 'Absent') return 'bg-red-100 text-red-700 border-red-400';
//     if (status === 'Missed Punch') return 'bg-yellow-100 text-yellow-700 border-yellow-400';
//     if (status === 'Weekend' || status === 'Holiday') return 'bg-purple-100 text-purple-700 border-purple-400';
//     return 'bg-gray-100 text-gray-700 border-gray-300';
// };

// const getStatusIcon = (status) => {
//     if (status === 'Present') return <CheckCircle size={20} className="text-green-500" />;
//     if (status === 'Absent') return <XCircle size={20} className="text-red-500" />;
//     if (status === 'Missed Punch' || status === 'Leave') return <CalendarIcon size={20} className="text-yellow-500" />;
//     if (status === 'Weekend') return <CalendarIcon size={20} className="text-purple-500" />;
//     return null;
// };

// // ===============================================
// // === 3. SHARED COMPONENTS (MonthYearPicker) ====
// // ===============================================

// const MONTHS = [
//     { name: 'Jan', value: '01' }, { name: 'Feb', value: '02' }, { name: 'Mar', value: '03' }, 
//     { name: 'Apr', value: '04' }, { name: 'May', value: '05' }, { name: 'Jun', value: '06' }, 
//     { name: 'Jul', value: '07' }, { name: 'Aug', value: '08' }, { name: 'Sep', value: '09' }, 
//     { name: 'Oct', value: '10' }, { name: 'Nov', value: '11' }, { name: 'Dec', value: '12' }, 
// ];

// const MonthYearPicker = ({ currentMonthYear, onChange, onClose }) => {
//     const [currentMonth, currentYear] = currentMonthYear.split('-');
//     const [displayYear, setDisplayYear] = useState(parseInt(currentYear, 10));
//     const yearInputRef = useRef(null);

//     const years = useMemo(() => {
//         const startYear = 2020;
//         const endYear = 2030;
//         const list = [];
//         for (let y = startYear; y <= endYear; y++) list.push(y);
//         return list;
//     }, []);

//     useEffect(() => {
//         if (yearInputRef.current) {
//             const currentYearIndex = years.findIndex(y => y === displayYear);
//             if (currentYearIndex !== -1) {
//                 yearInputRef.current.scrollTop = currentYearIndex * 30 - (yearInputRef.current.clientHeight / 2) + 15;
//             }
//         }
//     }, [years, displayYear]);

//     const handleMonthClick = useCallback((monthValue) => {
//         onChange(`${monthValue}-${displayYear}`);
//         onClose(); 
//     }, [displayYear, onChange, onClose]);

//     return (
//         <div className="absolute top-full mt-1 z-20 bg-white border border-gray-300 rounded-lg shadow-xl w-64 p-4 flex">
//             <div className="flex-1 pr-3 border-r border-gray-200">
//                 <h4 className="text-sm font-bold text-gray-700 mb-2">Month</h4>
//                 <div className="grid grid-cols-3 gap-2">
//                     {MONTHS.map((month) => (
//                         <button
//                             key={month.value}
//                             onClick={() => handleMonthClick(month.value)}
//                             className={`p-1.5 py-1 text-[10px] rounded-md transition ${month.value === currentMonth ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-blue-50'}`}
//                         >
//                             {month.name}
//                         </button>
//                     ))}
//                 </div>
//             </div>
//             <div className="flex-1 pl-3">
//                 <h4 className="text-sm font-bold text-gray-700 mb-2">Year ({displayYear})</h4>
//                 <div ref={yearInputRef} className="h-48 overflow-y-auto border border-gray-200 rounded-lg p-1 text-sm custom-scrollbar">
//                     {years.map((year) => (
//                         <div key={year} onClick={() => setDisplayYear(year)} className={`p-1.5 cursor-pointer rounded-md transition ${year === displayYear ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'}`}>
//                             {year}
//                         </div>
//                     ))}
//                 </div>
//             </div>
//         </div>
//     );
// };

// // ===============================================
// // === 4. ADMIN-SPECIFIC COMPONENTS (UploadModal) ==
// // ===============================================

// const UploadModal = ({ isOpen, onClose, defaultMonthYear, onUploadSuccess }) => {
//     const [defaultMonth, defaultYear] = defaultMonthYear.split('-');
//     const [selectedMonth, setSelectedMonth] = useState(defaultMonth);
//     const [selectedYear, setSelectedYear] = useState(defaultYear);
//     const [file, setFile] = useState(null);
//     const [uploading, setUploading] = useState(false);

//     if (!isOpen) return null; 

//     const handleFileUpload = async () => {
//         if (!file) return alert('Please select a file.');
//         setUploading(true);
        
//         const formData = new FormData();
//         formData.append('file', file);
//         formData.append('month', selectedMonth);
//         formData.append('year', selectedYear);

//         try {
//             const token = localStorage.getItem('token');
//             await axios.post(`${API_BASE_URL}/attendance/upload-attendance`, formData, {
//                 headers: { 'Authorization': `Bearer ${token}` }
//             });
//             onUploadSuccess(`${selectedMonth}-${selectedYear}`);
//             onClose();
//         } catch (error) {
//             console.error(error);
//             alert('Upload failed. Check console for details.');
//         } finally {
//             setUploading(false);
//         }
//     };

//     return (
//         <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex justify-center items-center z-50">
//             <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-md relative">
//                 <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X size={24} /></button>
//                 <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
//                     <Upload size={24} className="mr-3 text-blue-600" /> Bulk Upload
//                 </h3>
                
//                 {/* Selectors */}
//                 <div className="flex space-x-4 mb-6">
//                     <div className="flex-1">
//                         <label className="block text-sm font-medium text-gray-700 mb-1">Month</label>
//                         <select value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)} className="w-full border p-2 rounded-lg">
//                             {MONTHS.map(m => <option key={m.value} value={m.value}>{m.name}</option>)}
//                         </select>
//                     </div>
//                     <div className="flex-1">
//                         <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
//                         <select value={selectedYear} onChange={e => setSelectedYear(e.target.value)} className="w-full border p-2 rounded-lg">
//                             {[2024, 2025, 2026].map(y => <option key={y} value={y}>{y}</option>)}
//                         </select>
//                     </div>
//                 </div>

//                 <div className="mb-8">
//                     <input type="file" accept=".xlsx, .csv" onChange={e => setFile(e.target.files[0])} className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
//                 </div>

//                 <button onClick={handleFileUpload} disabled={!file || uploading} className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-blue-300">
//                     {uploading ? 'Uploading...' : 'Confirm Upload'}
//                 </button>
//             </div>
//         </div>
//     );
// };

// // ===============================================
// // === 5. ADMIN AND EMPLOYEE VIEW (Detail Log) =====
// // ===============================================

// const generateCalendarDates = (year, month, attendanceArray) => {
//     const firstDay = new Date(year, month, 1);
//     const lastDay = new Date(year, month + 1, 0);
//     const numDays = lastDay.getDate();

//     // Map the array from DB to an object keyed by day number (1, 2, 3...)
//     const recordsMap = {};
//     if (attendanceArray) {
//         attendanceArray.forEach(record => {
//             recordsMap[record.day] = record;
//         });
//     }

//     const days = [];
//     const startPadding = firstDay.getDay();

//     for (let i = 0; i < startPadding; i++) days.push({ day: '', status: 'Padding' });

//     for (let i = 1; i <= numDays; i++) {
//         const date = new Date(year, month, i);
//         const dayOfWeek = date.getDay();
//         const record = recordsMap[i];
        
//         let status = 'Absent';
//         if (record) {
//             status = record.status;
//         } else if (dayOfWeek === 0) { 
//             status = 'Weekend'; 
//         }

//         days.push({
//             day: i,
//             status: status,
//             details: record || { inTime: '-', outTime: '-', totalHours: 0 }
//         });
//     }

//     // Fill remaining grid
//     while (days.length % 7 !== 0) days.push({ day: '', status: 'Padding' });

//     return days;
// };

// // Drills down into a specific employee's record
// const EmployeeDetailLog = ({ employeeRecord, onBack }) => {
//     // employeeRecord is the full document from MongoDB (containing 'attendance' array)
//     const { month, year, attendance, name, employeeId } = employeeRecord;
    
//     // Convert 1-based month (from DB) to 0-based index for JS Date
//     const monthIndex = month - 1; 
//     const monthYearText = new Date(year, monthIndex).toLocaleString('en-US', { month: 'long', year: 'numeric' });

//     const calendarDates = useMemo(() => generateCalendarDates(year, monthIndex, attendance), [year, monthIndex, attendance]);

//     return (
//         <div className="bg-white shadow-lg rounded-xl max-w-7xl mx-auto p-6"> 
//             <div className="flex justify-between items-center mb-6 border-b pb-4">
//                 <button onClick={onBack} className="flex items-center text-indigo-600 hover:text-indigo-800 font-semibold transition">
//                     <ChevronLeft size={20} className="mr-1" /> Back to Summary
//                 </button>
//                 <h2 className="text-2xl font-bold text-gray-800">
//                     Attendance Log for {name} ({employeeId})
//                 </h2>
//             </div>
            
//             <div className="flex justify-center items-center mb-8 p-4 bg-gray-50 rounded-lg">
//                 <h3 className="text-xl font-semibold text-gray-800 flex items-center">
//                     <Clock size={20} className="mr-2 text-blue-600" />{monthYearText}
//                 </h3>
//             </div>

//             {/* --- CALENDAR VIEW --- */}
//             <h4 className="text-lg font-bold text-gray-700 mb-3 mt-6">Monthly Calendar View</h4>
//             <div className="border border-gray-200 rounded-lg p-4 mb-8">
//                 <div className="grid grid-cols-7 gap-1 text-center font-medium text-gray-500 uppercase text-xs mb-2">
//                     {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
//                         <div key={day} className="py-2 text-indigo-600">{day}</div>
//                     ))}
//                 </div>
//                 <div className="grid grid-cols-7 gap-1">
//                     {calendarDates.map((dayData, index) => (
//                         <div key={index} 
//                              className={`h-16 flex flex-col items-center justify-center rounded-lg text-sm transition duration-100 p-1 
//                              ${dayData.status === 'Padding' ? 'bg-white text-gray-300' : `border ${getStatusColor(dayData.status)}`}`}>
//                             <span className="font-semibold">{dayData.day}</span>
//                             {dayData.status !== 'Padding' && (
//                                 <span className="text-xs mt-1 font-mono text-gray-600">
//                                     {dayData.details?.totalHours > 0 ? `${dayData.details.totalHours}h` : dayData.status.slice(0,3)}
//                                 </span>
//                             )}
//                         </div>
//                     ))}
//                 </div>
//             </div>

//             {/* --- DETAIL LOG TABLE VIEW --- */}
//             <h4 className="text-lg font-bold text-gray-700 mb-3">Detail Log</h4>
//             <div className="overflow-x-auto border border-gray-200 rounded-lg">
//                 <table className="min-w-full divide-y divide-gray-200">
//                     <thead className="bg-gray-50">
//                         <tr>
//                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Day</th>
//                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
//                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Check In</th>
//                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Check Out</th>
//                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Hours</th>
//                         </tr>
//                     </thead>
//                     <tbody className="bg-white divide-y divide-gray-200">
//                         {attendance && attendance.length > 0 ? (
//                             attendance.map((record, index) => (
//                                 <tr key={index} className="hover:bg-gray-50">
//                                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{record.day}</td>
//                                     <td className="px-6 py-4 whitespace-nowrap text-sm">
//                                         <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(record.status)}`}>
//                                             {getStatusIcon(record.status)}
//                                             <span className="ml-2">{record.status}</span>
//                                         </span>
//                                     </td>
//                                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.inTime || '-'}</td>
//                                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.outTime || '-'}</td>
//                                     <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-blue-600">{record.totalHours}h</td>
//                                 </tr>
//                             ))
//                         ) : (
//                             <tr><td colSpan="5" className="p-6 text-center text-gray-500">No records found.</td></tr>
//                         )}
//                     </tbody>
//                 </table>
//             </div>
//         </div>
//     );
// };

// // ===============================================
// // === 6. ADMIN MANAGER VIEW (Role: 'admin') =======
// // ===============================================

// function AdminAttendanceManager() {
//     const today = new Date();
//     const [currentMonthYear, setCurrentMonthYear] = useState(`${String(today.getMonth() + 1).padStart(2, '0')}-${today.getFullYear()}`); 
//     const [searchTerm, setSearchTerm] = useState('');
//     const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
//     const [isPickerOpen, setIsPickerOpen] = useState(false); 
//     const pickerRef = useRef(null);
    
//     // REAL DATA STATES
//     const [attendanceData, setAttendanceData] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [selectedEmployeeRecord, setSelectedEmployeeRecord] = useState(null);

//     // Fetch Data from API
//     const fetchAttendanceData = async () => {
//         setLoading(true);
//         const [month, year] = currentMonthYear.split('-');
//         try {
//             const token = localStorage.getItem('token');
//             const response = await axios.get(`${API_BASE_URL}/attendance/view`, {
//                 params: { month, year },
//                 headers: { 'Authorization': `Bearer ${token}` }
//             });
//             setAttendanceData(response.data);
//         } catch (error) {
//             console.error("Error fetching data:", error);
//             // Optionally set empty if 404
//             setAttendanceData([]);
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchAttendanceData();
//     }, [currentMonthYear]);

//     useEffect(() => {
//         const handleClickOutside = (event) => {
//             if (pickerRef.current && !pickerRef.current.contains(event.target)) setIsPickerOpen(false);
//         };
//         document.addEventListener("mousedown", handleClickOutside);
//         return () => document.removeEventListener("mousedown", handleClickOutside);
//     }, [pickerRef]);

//     // Helpers
//     const getLastLog = (record) => {
//         if (!record.attendance || record.attendance.length === 0) return 'N/A';
//         const validLogs = record.attendance.filter(a => a.status !== 'Weekend');
//         return validLogs.length > 0 ? validLogs[validLogs.length - 1].status : 'N/A';
//     };

//     const filteredEmployees = attendanceData.filter(emp =>
//         emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         String(emp.employeeId).includes(searchTerm.toLowerCase())
//     );

//     const [month, year] = currentMonthYear.split('-');
//     const displayDate = new Date(year, month - 1).toLocaleString('en-US', { month: 'long', year: 'numeric' });

//     // RENDER DETAIL VIEW
//     if (selectedEmployeeRecord) {
//         return (
//             <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
//                 <EmployeeDetailLog
//                     employeeRecord={selectedEmployeeRecord}
//                     onBack={() => setSelectedEmployeeRecord(null)}
//                 />
//             </div>
//         );
//     }
    
//     // RENDER SUMMARY VIEW
//     return (
//         <div className="min-h-screen bg-gray-50 p-4 sm:p-6"> 
//             <UploadModal
//                 isOpen={isUploadModalOpen}
//                 onClose={() => setIsUploadModalOpen(false)}
//                 defaultMonthYear={currentMonthYear}
//                 onUploadSuccess={(newVal) => { setIsUploadModalOpen(false); setCurrentMonthYear(newVal); fetchAttendanceData(); }}
//             />

//             <div className="max-w-7xl mx-auto p-6 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl shadow-lg mb-6">
//                 <h2 className="text-3xl font-bold">Attendance Management</h2>
//                 <p className="text-sm opacity-90 mt-1">Review and manage all employee attendance records.</p>
//             </div>

//             <div className="max-w-7xl mx-auto bg-white p-6 rounded-xl shadow-md mb-6 flex flex-wrap items-center gap-4">
//                 <div className="flex-grow min-w-[200px] relative">
//                     <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//                     <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search Employee..." className="w-full border rounded-lg py-2 pl-10 pr-4" />
//                 </div>

//                 <div className="min-w-[150px] relative" ref={pickerRef}>
//                     <button onClick={() => setIsPickerOpen(!isPickerOpen)} className="w-full border rounded-lg py-2 px-3 bg-white flex justify-between items-center hover:bg-gray-50">
//                         <span className="font-semibold">{displayDate}</span>
//                         <ChevronDown size={16} />
//                     </button>
//                     {isPickerOpen && <MonthYearPicker currentMonthYear={currentMonthYear} onChange={setCurrentMonthYear} onClose={() => setIsPickerOpen(false)} />}
//                 </div>

//                 <button onClick={() => setIsUploadModalOpen(true)} className="px-4 py-2 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 flex items-center">
//                     <Upload size={18} className="mr-2" /> Bulk Upload
//                 </button>
//             </div>

//             <div className="max-w-7xl mx-auto">
//                 <h3 className="text-xl font-bold text-gray-700 mb-4">Summary for {displayDate}</h3>
//                 <div className="overflow-x-auto border border-gray-200 rounded-xl shadow-md bg-white">
//                     <table className="min-w-full divide-y divide-gray-200">
//                         <thead className="bg-gray-50">
//                             <tr>
//                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
//                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
//                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hours</th>
//                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Status</th>
//                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
//                             </tr>
//                         </thead>
//                         <tbody className="bg-white divide-y divide-gray-200">
//                             {loading ? (
//                                 <tr><td colSpan="5" className="p-6 text-center">Loading...</td></tr>
//                             ) : filteredEmployees.length > 0 ? (
//                                 filteredEmployees.map((record) => (
//                                     <tr key={record._id} className="hover:bg-gray-50">
//                                         <td className="px-6 py-4 font-medium">{record.name}</td>
//                                         <td className="px-6 py-4 text-gray-500">{record.employeeId}</td>
//                                         <td className="px-6 py-4 font-bold text-blue-600">{record.totalMonthlyHours}h</td>
//                                         <td className="px-6 py-4 flex items-center">
//                                             {getStatusIcon(getLastLog(record))}
//                                             <span className="ml-2">{getLastLog(record)}</span>
//                                         </td>
//                                         <td className="px-6 py-4">
//                                             <button onClick={() => setSelectedEmployeeRecord(record)} className="text-indigo-600 hover:text-indigo-800 font-medium">View Log</button>
//                                         </td>
//                                     </tr>
//                                 ))
//                             ) : (
//                                 <tr><td colSpan="5" className="p-6 text-center text-gray-500">No data available for this month.</td></tr>
//                             )}
//                         </tbody>
//                     </table>
//                 </div>
//             </div>
//         </div>
//     );
// }

// // ===============================================
// // === 7. EMPLOYEE PERSONAL VIEW (Role: 'employee') ===
// // ===============================================

// function EmployeeAttendanceView() {
//     const { userId, userName } = useAuth(); 
//     const today = new Date();
//     // Default to current month/year
//     const [currentMonthYear, setCurrentMonthYear] = useState(`${String(today.getMonth() + 1).padStart(2, '0')}-${today.getFullYear()}`);
//     const [isCalendarOpen, setIsCalendarOpen] = useState(true);
    
//     // Real Data State
//     const [myRecord, setMyRecord] = useState(null);
//     const [loading, setLoading] = useState(false);

//     const [monthStr, yearStr] = currentMonthYear.split('-');
//     const monthInt = parseInt(monthStr);
//     const yearInt = parseInt(yearStr);
//     const displayDate = new Date(yearInt, monthInt - 1).toLocaleString("en-US", { month: "long", year: "numeric" });

//     // Fetch data and filter for THIS user
//     useEffect(() => {
//         const fetchData = async () => {
//         setLoading(true);
//         try {
//             const token = localStorage.getItem('token');
//             const response = await axios.get(`${API_BASE_URL}/attendance/view`, {
//                 params: { month: monthStr, year: yearStr },
//                 headers: { 'Authorization': `Bearer ${token}` }
//             });
                
//                 // Find logged-in user's record
//                 if (response.data && response.data.length > 0) {
//                 setMyRecord(response.data[0]);
//             } else {
//                 setMyRecord(null);
//             }

//         } catch (error) {
//             console.error(error);
//         } finally {
//             setLoading(false);
//         }
//         };
//         fetchData();
//     }, [currentMonthYear, userId]);

//     // Navigation
//     const changeMonth = (offset) => {
//         const d = new Date(yearInt, monthInt - 1 + offset);
//         setCurrentMonthYear(`${String(d.getMonth() + 1).padStart(2, '0')}-${d.getFullYear()}`);
//     };

//     // Prepare Calendar Grid
//     const attendanceList = myRecord ? myRecord.attendance : [];
//     const calendarGrid = useMemo(() => generateCalendarDates(yearInt, monthInt - 1, attendanceList), [yearInt, monthInt, attendanceList]);

//     return (
//         <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
//             <div className="bg-white shadow-xl rounded-xl overflow-hidden max-w-5xl mx-auto">
//                 <div className="p-6 bg-gradient-to-r from-blue-600 to-indigo-700 text-white flex justify-between items-center">
//                     <div>
//                         <h2 className="text-2xl font-bold">Personal Attendance Log</h2>
//                         <p className="text-sm mt-1 opacity-90">Daily detailed work hours for {userName} ({userId}).</p>
//                     </div>
//                 </div>

//                 <div className="p-6">
//                     <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 relative">
//                         <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
//                             <div className="flex items-center space-x-2 text-lg font-medium text-gray-700">
//                                 <User size={20} className="text-indigo-600" />
//                                 <span>Total Hours: <strong>{myRecord ? myRecord.totalMonthlyHours : 0}h</strong></span>
//                             </div>
                            
//                             <div className="flex items-center space-x-4">
//                                 <button onClick={() => changeMonth(-1)} className="p-2 rounded-full hover:bg-gray-200 text-gray-700"><ChevronLeft size={24} /></button>
//                                 <div className="flex items-center">
//                                     <h3 className="text-xl font-semibold text-gray-800 mr-2">{displayDate}</h3>
//                                     <button onClick={() => setIsCalendarOpen(!isCalendarOpen)} className="p-1 rounded-full hover:bg-gray-200 text-gray-700">
//                                         <CalendarIcon size={24} className="text-blue-600" />
//                                     </button>
//                                 </div>
//                                 <button onClick={() => changeMonth(1)} className="p-2 rounded-full hover:bg-gray-200 text-gray-700"><ChevronRight size={24} /></button>
//                             </div>
//                         </div>

//                         {/* Calendar Grid */}
//                         {isCalendarOpen && (
//                             <div className="mt-4 p-4 border-t border-gray-200 bg-white rounded-lg">
//                                 <div className="grid grid-cols-7 text-center gap-1 mb-2 font-semibold text-gray-500 text-sm">
//                                     {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => <div key={d}>{d}</div>)}
//                                 </div>
//                                 <div className="grid grid-cols-7 gap-1">
//                                     {calendarGrid.map((dayData, idx) => (
//                                         <div key={idx} className={`h-16 flex flex-col items-center justify-center rounded-lg text-sm p-1 
//                                             ${dayData.status === 'Padding' ? 'invisible' : `border ${getStatusColor(dayData.status)}`}`}>
//                                             <span className="font-bold">{dayData.day}</span>
//                                             <span className="text-xs opacity-75">{dayData.status === 'Present' ? `${dayData.details.totalHours}h` : dayData.status}</span>
//                                         </div>
//                                     ))}
//                                 </div>
//                             </div>
//                         )}
//                     </div>

//                     {/* Table View */}
//                     <div className="overflow-x-auto border border-gray-200 rounded-lg mt-6">
//                         <table className="min-w-full divide-y divide-gray-200">
//                             <thead className="bg-gray-50">
//                                 <tr>
//                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
//                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
//                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">In</th>
//                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Out</th>
//                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
//                                 </tr>
//                             </thead>
//                             <tbody className="bg-white divide-y divide-gray-200">
//                                 {loading ? <tr><td colSpan="5" className="p-6 text-center">Loading...</td></tr> : 
//                                  attendanceList.length > 0 ? (
//                                     attendanceList.map((record, index) => (
//                                         <tr key={index} className="hover:bg-gray-50">
//                                             <td className="px-6 py-4 font-medium text-gray-900">{record.day}-{monthInt}-{yearInt}</td>
//                                             <td className="px-6 py-4"><span className={`px-2 py-1 rounded text-xs border ${getStatusColor(record.status)}`}>{record.status}</span></td>
//                                             <td className="px-6 py-4 text-gray-500">{record.inTime || '-'}</td>
//                                             <td className="px-6 py-4 text-gray-500">{record.outTime || '-'}</td>
//                                             <td className="px-6 py-4 font-bold text-blue-600">{record.totalHours}h</td>
//                                         </tr>
//                                     ))
//                                 ) : (
//                                     <tr><td colSpan="5" className="p-6 text-center text-gray-500">No records found.</td></tr>
//                                 )}
//                             </tbody>
//                         </table>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }

// // ===============================================
// // === 8. MAIN EXPORT (The Role Router) ==========
// // ===============================================

// export default function AttendancePage() {
//     const { role, isAuthenticated } = useAuth(); 

//     // If not logged in, you might redirect to login page
//     if (!isAuthenticated) {
//         return <div className="p-10 text-center">Please Log In to view attendance.</div>;
//     }

//     // DIAGRAM FLOW LOGIC:
//     // If Admin -> Show Admin Manager
//     if (role === 'admin') {
//         return <AdminAttendanceManager />;
//     }

//     // If Employee -> Show Personal View
//     // (The component inside will call the API, and the BACKEND will filter the data)
//     return <EmployeeAttendanceView />;
// }
import React from 'react';
import { useAuth } from '../../hooks/useAuth'; // Updated Path
import AdminAttendanceManager from '../../components/AdminAttendanceManager'; // Updated Path
import EmployeeAttendanceView from '../../components/EmployeeAttendanceView'; // Updated Path

export default function AttendancePage() {
    const { role, isAuthenticated } = useAuth(); 

    if (!isAuthenticated) {
        return <div className="p-10 text-center text-gray-600 font-semibold">Please Log In to view attendance.</div>;
    }

    if (role === 'admin') {
        return <AdminAttendanceManager />;
    }

    return <EmployeeAttendanceView />;
}