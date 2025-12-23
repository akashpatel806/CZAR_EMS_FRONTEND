import React from 'react';
import { useAuth } from '../../hooks/useAuth'; // Updated Path
import AdminAttendanceManager from '../../components/AdminAttendanceManager'; // Updated Path
import EmployeeAttendanceView from '../../components/EmployeeAttendanceView'; // Updated Path
import { getStatusColor } from '../../utils/attendanceUtils';
import Button from '../../components/Button';

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
