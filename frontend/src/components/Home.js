import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const DashboardHome = () => {
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

  const data = {
    labels: ['Fractured', 'Non-Fractured'],
    datasets: [
      {
        label: '# of Images',
        data: report ? [report.fractured, report.non_fractured] : [0, 0],
        backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)'],
        borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)'],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
        },
      },
    },
  };

  return (
    <div className="flex flex-col min-h-screen bg-blue-700">
      <div className="bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-7xl">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Dashboard</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {report ? (
          <div className="text-white">
            <div className="mb-8">
              <Bar data={data} options={options} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-700 p-4 rounded-lg">
                <h3 className="text-xl font-bold mb-2">Fractured</h3>
                <p>Total Fractured Images: {report.fractured}</p>
              </div>
              <div className="bg-gray-700 p-4 rounded-lg">
                <h3 className="text-xl font-bold mb-2">Non-Fractured</h3>
                <p>Total Non-Fractured Images: {report.non_fractured}</p>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-white">Loading report...</p>
        )}
      </div>
    </div>
  );
};

export default DashboardHome;