import React, { useState, useEffect, useMemo } from 'react';
import { User, ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import Button from './Button';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';
import { API_BASE_URL, getStatusColor, getStatusIcon, generateCalendarDates, formatDecimalHours } from '../utils/attendanceUtils';

function EmployeeAttendanceView() {
    const { userId, userName } = useAuth();
    const today = new Date();
    const [viewMode, setViewMode] = useState('calendar'); // 'calendar' or 'table'
    const [currentMonthYear, setCurrentMonthYear] = useState(`${String(today.getMonth() + 1).padStart(2, '0')}-${today.getFullYear()}`);

    const [myRecord, setMyRecord] = useState(null);
    const [loading, setLoading] = useState(false);

    const [monthStr, yearStr] = currentMonthYear.split('-');
    const monthInt = parseInt(monthStr);
    const yearInt = parseInt(yearStr);
    const displayDate = new Date(yearInt, monthInt - 1).toLocaleString("en-US", { month: "long", year: "numeric" });

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${API_BASE_URL}/attendance/view`, {
                    params: { month: monthStr, year: yearStr },
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (response.data && response.data.length > 0) {
                    setMyRecord(response.data[0]);
                } else {
                    setMyRecord(null);
                }

            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [currentMonthYear, userId, monthStr, yearStr]);

    const changeMonth = (offset) => {
        const d = new Date(yearInt, monthInt - 1 + offset);
        setCurrentMonthYear(`${String(d.getMonth() + 1).padStart(2, '0')}-${d.getFullYear()}`);
    };

    const attendanceList = myRecord ? myRecord.attendance : [];
    const calendarGrid = useMemo(() => generateCalendarDates(yearInt, monthInt - 1, attendanceList), [yearInt, monthInt, attendanceList]);

    return (
        <div className="p-3 sm:p-4 md:p-8 bg-gray-50 min-h-screen">
            <div className="bg-white shadow-xl rounded-xl sm:rounded-2xl overflow-hidden">
                <div className="p-4 sm:p-5 md:p-6 bg-gradient-to-r from-blue-600 to-indigo-700 text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
                    <div className="w-full sm:w-auto">
                        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">Personal Attendance Log</h2>
                        <p className="text-xs sm:text-sm mt-1 opacity-90">Daily detailed work hours for {userName}.</p>
                    </div>
                    <Button
                        variant="ghost"
                        onClick={() => setViewMode(viewMode === 'calendar' ? 'table' : 'calendar')}
                        className="w-full sm:w-auto bg-white/20 hover:bg-white/30 text-white text-xs sm:text-sm font-medium rounded-lg transition backdrop-blur-sm border border-white/30"
                    >
                        {viewMode === 'calendar' ? 'View Details' : 'View Calendar'}
                    </Button>
                </div>

                <div className="p-4 sm:p-5 md:p-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3 sm:gap-4">
                        <div className="flex items-center space-x-2 text-base sm:text-lg font-medium text-gray-700">
                            <User size={18} className="text-indigo-600 sm:w-5 sm:h-5" />
                            <span className="text-sm sm:text-base">Total Hours: <strong>{myRecord ? myRecord.totalMonthlyHours : 0}h</strong></span>
                        </div>

                        <div className="flex items-center space-x-2 sm:space-x-4 bg-gray-100 rounded-lg p-1 w-full sm:w-auto justify-center">
                            <Button variant="ghost" size="icon" onClick={() => changeMonth(-1)} className="rounded-lg hover:bg-gray-200 text-gray-700 p-1.5 sm:p-2"><ChevronLeft size={18} className="sm:w-5 sm:h-5" /></Button>
                            <h3 className="text-sm sm:text-lg font-semibold text-gray-800 min-w-[120px] sm:min-w-[140px] text-center">{displayDate}</h3>
                            <Button variant="ghost" size="icon" onClick={() => changeMonth(1)} className="rounded-lg hover:bg-gray-200 text-gray-700 p-1.5 sm:p-2"><ChevronRight size={18} className="sm:w-5 sm:h-5" /></Button>
                        </div>
                    </div>

                    {viewMode === 'calendar' ? (
                        <div className="bg-white rounded-lg border border-gray-200 p-2 sm:p-3 md:p-4">
                            {myRecord ? (
                                <>
                                    <div className="grid grid-cols-7 text-center gap-0.5 sm:gap-1 mb-2 font-semibold text-gray-500 text-[10px] sm:text-xs md:text-sm">
                                        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => <div key={d}>{d}</div>)}
                                    </div>
                                    <div className="grid grid-cols-7 gap-0.5 sm:gap-1">
                                        {calendarGrid.map((dayData, idx) => (
                                            <div key={idx} className={`h-12 sm:h-14 md:h-16 flex flex-col items-center justify-center rounded-lg text-xs sm:text-sm p-0.5 sm:p-1 
                                                ${dayData.status === 'Padding' ? 'invisible' : `border ${getStatusColor(dayData.status)}`}`}>
                                                <span className="font-bold text-xs sm:text-sm">{dayData.day}</span>
                                                <span className="text-[9px] sm:text-[10px] md:text-xs opacity-75">{dayData.status === 'Present' ? formatDecimalHours(dayData.details.totalHours) : dayData.status}</span>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-8 sm:py-10 text-gray-500">
                                    <CalendarIcon size={40} className="mb-3 sm:mb-4 text-gray-300 sm:w-12 sm:h-12" />
                                    <p className="text-base sm:text-lg font-medium">No Attendance Data Available</p>
                                    <p className="text-xs sm:text-sm">There is no attendance record for this month.</p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="overflow-x-auto border border-gray-200 rounded-lg -mx-4 sm:mx-0">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase">Date</th>
                                        <th className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase">Status</th>
                                        <th className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase hidden sm:table-cell">In</th>
                                        <th className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase hidden sm:table-cell">Out</th>
                                        <th className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase">Total</th>
                                        <th className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase hidden md:table-cell">Over Time</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {loading ? <tr><td colSpan="6" className="p-4 sm:p-6 text-center text-sm">Loading...</td></tr> :
                                        attendanceList.length > 0 ? (
                                            attendanceList.map((record, index) => {
                                                const isSunday = new Date(yearInt, monthInt - 1, record.day).getDay() === 0;
                                                const displayStatus = (isSunday && (record.status === 'Absent' || record.status === 'Missed Punch')) ? 'Weekend' : record.status;
                                                const isWeekend = displayStatus === 'Weekend';
                                                return (
                                                    <tr key={index} className={`hover:bg-gray-50 ${isWeekend ? 'bg-purple-100' : ''}`}>
                                                        <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 font-medium text-gray-900 text-xs sm:text-sm whitespace-nowrap">
                                                            <div className="flex flex-col">
                                                                <span>{record.day}-{monthInt}-{yearInt}</span>
                                                                <span className="text-[10px] text-gray-500 sm:hidden">
                                                                    {record.inTime || '-'} → {record.outTime || '-'}
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4">
                                                            <div className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 rounded-full w-fit border text-[10px] sm:text-xs ${getStatusColor(displayStatus)}`}>
                                                                <span className="hidden sm:inline">{getStatusIcon(displayStatus)}</span>
                                                                {displayStatus}
                                                            </div>
                                                        </td>
                                                        <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-gray-500 text-xs sm:text-sm hidden sm:table-cell">{record.inTime || '-'}</td>
                                                        <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-gray-500 text-xs sm:text-sm hidden sm:table-cell">{record.outTime || '-'}</td>
                                                        <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 font-bold text-gray-600 text-xs sm:text-sm">{formatDecimalHours(record.totalHours)}</td>
                                                        <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 font-bold text-gray-600 text-xs sm:text-sm hidden md:table-cell">{formatDecimalHours(record.overtime)}</td>
                                                    </tr>
                                                );
                                            })
                                        ) : (
                                            <tr><td colSpan="6" className="p-4 sm:p-6 text-center text-gray-500 text-sm">No records found.</td></tr>
                                        )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default EmployeeAttendanceView;