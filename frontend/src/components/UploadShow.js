import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const UploadShow = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/patients');
        setPatients(response.data);
      } catch (error) {
        console.error('Error fetching patients:', error);
      }
    };

    fetchPatients();
  }, []);

  const handleAddNew = () => {
    navigate('/dashboard/upload');
  };

  const handleEdit = (id) => {
    navigate('/dashboard/upload', { state: { patientId: id } });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Records</h1>
        <button
          onClick={handleAddNew}
          className="p-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-500 transition duration-200"
        >
          Add New
        </button>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b border-gray-200 text-left">Patient ID</th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">Patient Name</th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">Patient Address</th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">Patient Contact</th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">Gender</th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">Prediction</th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((item) => (
              <tr key={item._id} className="hover:bg-gray-100 transition duration-200">
                <td className="py-2 px-4 border-b border-gray-200">{item.patient_id}</td>
                <td className="py-2 px-4 border-b border-gray-200">{item.patient_name}</td>
                <td className="py-2 px-4 border-b border-gray-200">{item.patient_address}</td>
                <td className="py-2 px-4 border-b border-gray-200">{item.patient_contact}</td>
                <td className="py-2 px-4 border-b border-gray-200">{item.patient_gender}</td>
                <td className="py-2 px-4 border-b border-gray-200">{item.prediction}</td>
                <td className="py-2 px-4 border-b border-gray-200 flex items-center space-x-2">
                  <button
                    onClick={() => handleEdit(item.patient_id)}
                    className="text-blue-600 hover:text-blue-800 transition duration-200"
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  <button className="text-red-600 hover:text-red-800 transition duration-200">
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UploadShow;
