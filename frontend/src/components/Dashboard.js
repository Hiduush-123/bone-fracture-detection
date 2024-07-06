import React, { useEffect } from 'react';
import { Link, Route, Routes, useNavigate } from 'react-router-dom';
import Home from './Home';
import Upload from './Upload';
import History from './History';

const Dashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="flex h-screen">
      <nav className="bg-blue-900 text-white w-64 p-4 flex flex-col justify-between">
        <div>
          <div className="text-center font-bold text-lg mb-6">Bone Fracture Detection</div>
          <ul className="space-y-4">
            <li>
              <Link to="/dashboard/home" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-blue-700">
                Home
              </Link>
            </li>
            <li>
              <Link to="/dashboard/upload" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-blue-700">
                Upload X-ray
              </Link>
            </li>
            <li>
              <Link to="/dashboard/history" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-blue-700">
                History
              </Link>
            </li>
          </ul>
        </div>
        <div className="mt-6">
          <button onClick={handleLogout} className="w-full text-left py-2.5 px-4 rounded transition duration-200 hover:bg-blue-700">
            Log out
          </button>
        </div>
      </nav>
      <main className="flex-1 bg-gray-200 p-8">
        <Routes>
          <Route path="home" element={<Home />} />
          <Route path="upload" element={<Upload />} />
          <Route path="history" element={<History />} />
        </Routes>
      </main>
    </div>
  );
};

export default Dashboard;
