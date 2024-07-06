import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Home = () => {
  const [report, setReport] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/report');
        setReport(response.data);
      } catch (err) {
        console.error(err);
        setError('Error fetching report data');
      }
    };

    fetchReport();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-800">
      <div className="bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Report</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {report ? (
          <div className="text-white">
            <div className="bg-gray-700 p-4 rounded-lg mb-4">
              <h3 className="text-xl font-bold mb-2">Fractured</h3>
              <p>Total Fractured Images: {report.fractured}</p>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg">
              <h3 className="text-xl font-bold mb-2">Non-Fractured</h3>
              <p>Total Non-Fractured Images: {report.non_fractured}</p>
            </div>
          </div>
        ) : (
          <p className="text-white">Loading report...</p>
        )}
      </div>
    </div>
  );
};

export default Home;
