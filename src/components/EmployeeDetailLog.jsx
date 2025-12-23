// src/components/EmployeeDetailLog.jsx
import React, { useMemo, useState } from 'react';
import { Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import axios from 'axios';
import { getStatusColor, getStatusIcon, generateCalendarDates, formatDecimalHours, API_BASE_URL } from '../utils/attendanceUtils'; // Updated Path

const EmployeeDetailLog = ({ employeeRecord, onBack }) => {
    const { name, employeeId } = employeeRecord;
    const [viewMode, setViewMode] = useState('calendar'); // 'calendar' or 'table'
    const [currentMonth, setCurrentMonth] = useState(parseInt(employeeRecord.month));
    const [currentYear, setCurrentYear] = useState(parseInt(employeeRecord.year));
    const [attendance, setAttendance] = useState(employeeRecord.attendance || []);
    const [loading, setLoading] = useState(false);

    const monthIndex = currentMonth - 1;
    const monthYearText = new Date(currentYear, monthIndex).toLocaleString('en-US', { month: 'long', year: 'numeric' });

    const fetchNewMonthData = async (m, y) => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_BASE_URL}/attendance/view`, {
                params: { month: m, year: y, search: employeeId },
                headers: { 'Authorization': `Bearer ${token}` }
            });
            // The API returns an array. Find the record for this employee.
            const record = response.data.find(r => r.employeeId === employeeId);
            if (record) {
                setAttendance(record.attendance || []);
            } else {
                setAttendance([]);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            setAttendance([]);
        } finally {
            setLoading(false);
        }
    };

    const handlePrevMonth = () => {
        let newMonth = currentMonth - 1;
        let newYear = currentYear;
        if (newMonth < 1) {
            newMonth = 12;
            newYear -= 1;
        }
        setCurrentMonth(newMonth);
        setCurrentYear(newYear);
        fetchNewMonthData(newMonth, newYear);
    };

    const handleNextMonth = () => {
        let newMonth = currentMonth + 1;
        let newYear = currentYear;
        if (newMonth > 12) {
            newMonth = 1;
            newYear += 1;
        }
        setCurrentMonth(newMonth);
        setCurrentYear(newYear);
        fetchNewMonthData(newMonth, newYear);
    };

    const calendarDates = useMemo(() => generateCalendarDates(currentYear, monthIndex, attendance), [currentYear, monthIndex, attendance]);

    return (
        <div className="bg-white shadow-lg rounded-xl max-w-7xl mx-auto p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 border-b pb-4 gap-3">
                <button onClick={onBack} className="flex items-center text-indigo-600 hover:text-indigo-800 font-semibold transition text-sm sm:text-base">
                    <ChevronLeft size={20} className="mr-1" /> Back to Summary
                </button>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
                    <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">
                        Attendance Log for {name} ({employeeId})
                    </h2>
                    <button
                        onClick={() => setViewMode(viewMode === 'calendar' ? 'table' : 'calendar')}
                        className="px-3 sm:px-4 py-2 bg-indigo-600 text-white text-xs sm:text-sm font-medium rounded-lg hover:bg-indigo-700 transition w-full sm:w-auto"
                    >
                        {viewMode === 'calendar' ? 'View Details' : 'View Calendar'}
                    </button>
                </div>
            </div>

            <div className="flex justify-center items-center mb-6 sm:mb-8 p-3 sm:p-4 bg-gray-50 rounded-lg gap-2 sm:gap-6">
                <button
                    onClick={handlePrevMonth}
                    disabled={loading}
                    className="p-1 sm:p-2 rounded-full hover:bg-gray-200 text-gray-600 disabled:opacity-50 transition-colors"
                    title="Previous Month"
                >
                    <ChevronLeft size={24} />
                </button>

                <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 flex items-center min-w-[150px] sm:min-w-[200px] justify-center">
                    <Clock size={18} className="mr-2 text-blue-600 sm:w-5 sm:h-5" />
                    {loading ? "Loading..." : monthYearText}
                </h3>

                <button
                    onClick={handleNextMonth}
                    disabled={loading}
                    className="p-1 sm:p-2 rounded-full hover:bg-gray-200 text-gray-600 disabled:opacity-50 transition-colors"
                    title="Next Month"
                >
                    <ChevronRight size={24} />
                </button>
            </div>

            {viewMode === 'calendar' ? (
                <>
                    <h4 className="text-base sm:text-lg font-bold text-gray-700 mb-3 mt-4 sm:mt-6">Monthly Calendar View</h4>
                    <div className="border border-gray-200 rounded-lg p-2 sm:p-4 mb-6 sm:mb-8">
                        <div className="grid grid-cols-7 gap-0.5 sm:gap-1 text-center font-medium text-gray-500 uppercase text-[10px] sm:text-xs mb-2">
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                                <div key={day} className="py-1 sm:py-2 text-indigo-600">{day}</div>
                            ))}
                        </div>
                        <div className="grid grid-cols-7 gap-0.5 sm:gap-1">
                            {calendarDates.map((dayData, index) => (
                                <div key={index}
                                    className={`h-12 sm:h-14 md:h-16 flex flex-col items-center justify-center rounded-lg text-xs sm:text-sm transition duration-100 p-0.5 sm:p-1 
                                     ${dayData.status === 'Padding' ? 'bg-white text-gray-300' : `border ${getStatusColor(dayData.status)}`}`}>
                                    <span className="font-semibold text-[10px] sm:text-xs">{dayData.day}</span>
                                    {dayData.status !== 'Padding' && (
                                        <span className="text-[8px] sm:text-xs mt-0.5 sm:mt-1 font-mono text-gray-600">
                                            {dayData.status === 'Site Visit' ? 'Site Visit' : (dayData.status === 'Leave' ? `Leave (${dayData.details.leaveType || ''})` : (dayData.details?.totalHours > 0 ? formatDecimalHours(dayData.details.totalHours) : dayData.status))}
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            ) : (
                <>
                    <h4 className="text-base sm:text-lg font-bold text-gray-700 mb-3">Detail Log</h4>
                    <div className="overflow-x-auto border border-gray-200 rounded-lg">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase">Day</th>
                                    <th className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase">Status</th>
                                    <th className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase hidden sm:table-cell">Check In</th>
                                    <th className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase hidden sm:table-cell">Check Out</th>
                                    <th className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase">Hours</th>
                                    <th className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase hidden md:table-cell">Overtime</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {attendance && attendance.length > 0 ? (
                                    attendance.map((record, index) => {
                                        const isSunday = new Date(currentYear, currentMonth - 1, record.day).getDay() === 0;
                                        const displayStatus = (isSunday && (record.status === 'Absent' || record.status === 'Missed Punch')) ? 'Weekend' : record.status;
                                        const isWeekend = displayStatus === 'Weekend';
                                        return (
                                            <tr key={index} className={`hover:bg-gray-50 ${isWeekend ? 'bg-purple-100' : ''}`}>
                                                <td className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 whitespace-nowrap text-xs sm:text-sm font-medium text-gray-900">{record.day}</td>
                                                <td className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 whitespace-nowrap text-xs sm:text-sm font-bold text-black-600">
                                                    <div className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 rounded-full w-fit border ${getStatusColor(displayStatus)}`}>
                                                        <span className="hidden sm:inline">{getStatusIcon(displayStatus)}</span>
                                                        <span className="text-[10px] sm:text-xs">
                                                            {displayStatus}{(record.leaveType && displayStatus !== 'Site Visit') ? ` (${record.leaveType})` : ''}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500 hidden sm:table-cell">{record.inTime || '-'}</td>
                                                <td className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500 hidden sm:table-cell">{record.outTime || '-'}</td>
                                                <td className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 whitespace-nowrap text-xs sm:text-sm font-bold text-black-600">
                                                    <div className="flex flex-col">
                                                        <span>{formatDecimalHours(record.totalHours)}</span>
                                                        <span className="text-[10px] text-gray-500 md:hidden">OT: {formatDecimalHours(record.overtime)}</span>
                                                        <span className="text-[10px] text-gray-500 sm:hidden">In: {record.inTime || '-'} / Out: {record.outTime || '-'}</span>
                                                    </div>
                                                </td>
                                                <td className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 whitespace-nowrap text-xs sm:text-sm font-bold text-black-600 hidden md:table-cell">{formatDecimalHours(record.overtime)}</td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr><td colSpan="6" className="p-4 sm:p-6 text-center text-gray-500 text-xs sm:text-sm">No records found.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
    );
};

export default EmployeeDetailLog;