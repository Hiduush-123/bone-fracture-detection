import React, { useEffect, useState, useRef } from 'react';
import { Link, Route, Routes, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTachometerAlt, faUpload, faFileAlt } from '@fortawesome/free-solid-svg-icons';
import { Bar, Doughnut } from 'react-chartjs-2';
import Upload from './Upload';
import History from './History';
import UploadShow from './UploadShow';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

const Dashboard = () => {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(localStorage.getItem('profilePhoto') || 'https://via.placeholder.com/40');
  const [username, setUsername] = useState('');
  const [data, setData] = useState({
    fractured: 0,
    nonFractured: 0,
    female: 0,
    male: 0,
    patients: []
  });
  const dropdownRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }

    const fetchUserData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/auth/user', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsername(response.data.username);
      } catch (err) {
        console.error('Error fetching user data:', err);
      }
    };

    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/report');
        setData(response.data);
      } catch (error) {
        console.error('Error fetching report data:', error);
      }
    };

    const fetchPatients = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/patients');
        setData((prevState) => ({
          ...prevState,
          patients: response.data,
          female: response.data.filter(patient => patient.patient_gender === 'Female').length,
          male: response.data.filter(patient => patient.patient_gender === 'Male').length,
        }));
      } catch (error) {
        console.error('Error fetching patients data:', error);
      }
    };

    fetchUserData();
    fetchData();
    fetchPatients();

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleProfilePhotoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const photoURL = reader.result;
        setProfilePhoto(photoURL);
        localStorage.setItem('profilePhoto', photoURL);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfilePhotoClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const barData = {
    labels: ['Fractured', 'Non-Fractured'],
    datasets: [
      {
        label: '# of Cases',
        data: [data.fractured, data.nonFractured],
        backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)'],
        borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)'],
        borderWidth: 1,
      },
    ],
  };

  const doughnutData = {
    labels: ['Female', 'Male'],
    datasets: [
      {
        label: '# of Patients',
        data: [data.female, data.male],
        backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)'],
        borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)'],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="flex flex-col h-screen">
      <header className="bg-blue-600 text-white p-2 flex justify-between items-center">
        <div className="font-bold text-md ml-5">Bone Fracture Detection</div>
        <div className="relative" ref={dropdownRef}>
          <div className="flex items-center cursor-pointer" onClick={toggleDropdown}>
            <span className="mr-2">Welcome {username}</span>
            <img
              src={profilePhoto}
              alt="Profile"
              className="w-10 h-10 rounded-full"
            />
          </div>
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-20">
              <div className="flex justify-center mb-4">
                <img
                  src={profilePhoto}
                  alt="Profile"
                  className="w-20 h-20 rounded-full cursor-pointer"
                  onClick={handleProfilePhotoClick}
                />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleProfilePhotoChange}
                />
              </div>
              <div className="flex flex-col">
                <button
                  className="w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100 flex items-center"
                  onClick={() => {
                    // Implement change password logic here
                  }}
                >
                  Change Password
                </button>
                <button
                  className="w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100 flex items-center"
                  onClick={handleLogout}
                >
                  Log out
                </button>
              </div>
            </div>
          )}
        </div>
      </header>
      <div className="flex flex-1">
        <nav className="bg-blue-500 text-white w-56 p-4 flex flex-col justify-between">
          <div>
            <ul className="space-y-4">
              <li>
                <Link to="/dashboard/home" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-blue-700 items-center">
                  <FontAwesomeIcon icon={faTachometerAlt} className="mr-2" />
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/dashboard/uploadShow" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-blue-700 items-center">
                  <FontAwesomeIcon icon={faUpload} className="mr-2" />
                  Upload X-ray
                </Link>
              </li>
              <li>
                <Link to="/dashboard/history" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-blue-700 items-center">
                  <FontAwesomeIcon icon={faFileAlt} className="mr-2" />
                  Reports
                </Link>
              </li>
            </ul>
            <div className='text-sm ml-5 mt-20'>Version 1.0.0</div>
          </div>
        </nav>
        <main className="flex-1 bg-gray-200 p-8">
          <Routes>
            <Route path="home" element={
              <div className="space-y-8">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-lg shadow-md text-center">
                    <h3 className="text-lg font-bold mb-2">Total Fractured</h3>
                    <p className="text-2xl">{data.fractured}</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-md text-center">
                    <h3 className="text-lg font-bold mb-2">Total Non-Fractured</h3>
                    <p className="text-2xl">{data.nonFractured}</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-md text-center">
                    <h3 className="text-lg font-bold mb-2">Total Female</h3>
                    <p className="text-2xl">{data.female}</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-md text-center">
                    <h3 className="text-lg font-bold mb-2">Total Male</h3>
                    <p className="text-2xl">{data.male}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-lg shadow-md">
                    <h3 className="text-lg font-bold mb-4">Fracture Cases</h3>
                    <Bar data={barData} />
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-md">
                    <h3 className="text-lg font-bold mb-4">Gender Distribution</h3>
                    <Doughnut data={doughnutData} />
                  </div>
                </div>
              </div>
            } />
            <Route path="upload" element={<Upload />} />
            <Route path="history" element={<History />} />
            <Route path='uploadShow' element={<UploadShow/>}/>
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
