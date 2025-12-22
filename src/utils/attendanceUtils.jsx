// src/utils/attendanceUtils.js
import React from 'react';
import { CheckCircle, XCircle, Calendar as CalendarIcon } from 'lucide-react';

// Dynamically determine API base URL based on current hostname
const getApiBaseUrl = () => {
    const hostname = window.location.hostname;

    // If accessing via IP address (network), use the same IP for API
    if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
        return `http://${hostname}:5002/api`;
    }

    // Default to localhost
    return 'http://localhost:5002/api';
};

export const API_BASE_URL = getApiBaseUrl();

export const getStatusColor = (status) => {
    if (status === 'Present') return 'bg-green-100 text-green-700 border-green-400';
    if (status === 'Absent') return 'bg-red-100 text-red-700 border-red-400';
    if (status === 'Missed Punch') return 'bg-yellow-100 text-yellow-700 border-yellow-400';
    if (status === 'Leave') return 'bg-orange-100 text-orange-700 border-orange-400';
    if (status === 'Weekend') return 'bg-purple-100 text-purple-700 border-purple-400';
    if (status === 'Holiday') return 'bg-blue-100 text-blue-700 border-blue-400';
    return 'bg-gray-100 text-gray-700 border-gray-300';
};

export const getStatusIcon = (status) => {
    if (status === 'Present') return <CheckCircle size={20} className="text-green-500" />;
    if (status === 'Absent') return <XCircle size={20} className="text-red-500" />;
    if (status === 'Missed Punch' || status === 'Leave') return <CalendarIcon size={20} className="text-yellow-500" />;
    if (status === 'Weekend') return <CalendarIcon size={20} className="text-purple-500" />;
    return null;
};

export const generateCalendarDates = (year, month, attendanceArray) => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const numDays = lastDay.getDate();

    const recordsMap = {};
    if (attendanceArray) {
        attendanceArray.forEach(record => {
            recordsMap[record.day] = record;
        });
    }

    const days = [];
    const startPadding = firstDay.getDay();

    for (let i = 0; i < startPadding; i++) days.push({ day: '', status: 'Padding' });

    for (let i = 1; i <= numDays; i++) {
        const dayOfWeek = new Date(year, month, i).getDay();
        const record = recordsMap[i];

        let status = 'Absent';
        if (record) {
            status = record.status;
        }


        if (dayOfWeek === 0 && (status === 'Absent' || status === 'Missed Punch')) {
            status = 'Weekend';
        }

        days.push({
            day: i,
            status: status,
            details: record || { inTime: '-', outTime: '-', totalHours: 0 }
        });
    }

    while (days.length % 7 !== 0) days.push({ day: '', status: 'Padding' });

    return days;
};

export const formatDecimalHours = (decimalHours) => {
    if (decimalHours === undefined || decimalHours === null || decimalHours === 0) return '-';
    // Ensure it's a number
    const num = parseFloat(decimalHours);
    if (isNaN(num)) return '-';

    const hours = Math.floor(num);
    const minutes = Math.round((num - hours) * 60);

    const formattedHours = String(hours).padStart(2, '0');
    const formattedMinutes = String(minutes).padStart(2, '0');

    return `${formattedHours}:${formattedMinutes}`;
};