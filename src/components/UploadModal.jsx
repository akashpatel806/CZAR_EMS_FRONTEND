import React, { useState } from 'react';
import { Upload, X } from 'lucide-react';
import Button from './Button';
import axios from 'axios';
import { API_BASE_URL } from '../utils/attendanceUtils'; // Updated Path

const MONTHS = [
    { name: 'Jan', value: '01' }, { name: 'Feb', value: '02' }, { name: 'Mar', value: '03' },
    { name: 'Apr', value: '04' }, { name: 'May', value: '05' }, { name: 'Jun', value: '06' },
    { name: 'Jul', value: '07' }, { name: 'Aug', value: '08' }, { name: 'Sep', value: '09' },
    { name: 'Oct', value: '10' }, { name: 'Nov', value: '11' }, { name: 'Dec', value: '12' },
];

const UploadModal = ({ isOpen, onClose, defaultMonthYear, onUploadSuccess }) => {
    const [defaultMonth, defaultYear] = defaultMonthYear.split('-');
    const [selectedMonth, setSelectedMonth] = useState(defaultMonth);
    const [selectedYear, setSelectedYear] = useState(defaultYear);
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);

    if (!isOpen) return null;

    const handleFileUpload = async () => {
        if (!file) return alert('Please select a file.');
        setUploading(true);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('month', selectedMonth);
        formData.append('year', selectedYear);

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(`${API_BASE_URL}/attendance/upload-attendance`, formData, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            // Show success message with details
            let successMessage = `Upload successful! ${response.data.count} employees processed.`;

            const warnings = [];

            if (response.data.invalidRows && response.data.invalidRows.length > 0) {
                warnings.push(`\n\n⚠️ ${response.data.invalidRows.length} rows with invalid employee IDs:\n${response.data.invalidRows.map(e => `${e.employeeId} - ${e.name} (${e.reason})`).join('\n')}`);
            }

            if (response.data.missingEmployees && response.data.missingEmployees.length > 0) {
                warnings.push(`\n\n⚠️ ${response.data.missingEmployees.length} employees not found in database:\n${response.data.missingEmployees.map(e => `${e.employeeId} - ${e.name}`).join('\n')}`);
            }

            if (warnings.length > 0) {
                alert(successMessage + warnings.join(''));
            } else {
                alert(successMessage);
            }

            onUploadSuccess(`${selectedMonth}-${selectedYear}`);
            onClose();
        } catch (error) {
            console.error('Upload error:', error);

            // Display detailed error message
            let errorMessage = 'Upload failed. ';
            if (error.response?.data?.message) {
                errorMessage += error.response.data.message;
            } else if (error.response?.data?.error) {
                errorMessage += error.response.data.error;
            } else if (error.message) {
                errorMessage += error.message;
            } else {
                errorMessage += 'Unknown error occurred.';
            }

            alert(errorMessage);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-md relative">
                <Button variant="ghost" size="icon" onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X size={24} /></Button>
                <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                    <Upload size={24} className="mr-3 text-blue-600" /> Bulk Upload
                </h3>

                <div className="flex space-x-4 mb-6">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Month</label>
                        <select value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)} className="w-full border p-2 rounded-lg">
                            {MONTHS.map(m => <option key={m.value} value={m.value}>{m.name}</option>)}
                        </select>
                    </div>
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                        <select value={selectedYear} onChange={e => setSelectedYear(e.target.value)} className="w-full border p-2 rounded-lg">
                            {[2024, 2025, 2026].map(y => <option key={y} value={y}>{y}</option>)}
                        </select>
                    </div>
                </div>

                <div className="mb-8">
                    <input type="file" accept=".xlsx, .csv" onChange={e => setFile(e.target.files[0])} className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
                </div>

                <Button onClick={handleFileUpload} disabled={!file || uploading} isLoading={uploading} fullWidth variant="primary">
                    {uploading ? 'Uploading...' : 'Confirm Upload'}
                </Button>
            </div>
        </div>
    );
};

export default UploadModal;