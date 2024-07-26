import React, { useState } from 'react';
import axios from 'axios';

const Reports = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [error, setError] = useState('');

  const handleGenerateReport = async () => {
    try {
      const response = await axios.post(
        'http://127.0.0.1:5000/report-by-date',
        { startDate, endDate },
        { responseType: 'blob' } // Important to handle binary data
      );

      // Create a URL for the file
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'report.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();

      setError('');
    } catch (error) {
      console.error(error);
      setError('Error generating report');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Generate Report</h2>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        <div className="mb-4">
          <label htmlFor="startDate" className="block text-gray-700 mb-2">Start Date</label>
          <input
            type="date"
            id="startDate"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full p-3 rounded bg-gray-100 text-gray-700 focus:outline-none"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="endDate" className="block text-gray-700 mb-2">End Date</label>
          <input
            type="date"
            id="endDate"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full p-3 rounded bg-gray-100 text-gray-700 focus:outline-none"
          />
        </div>
        <button
          onClick={handleGenerateReport}
          className="w-full p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition duration-200"
        >
          Generate Report
        </button>
      </div>
    </div>
  );
};

export default Reports;
