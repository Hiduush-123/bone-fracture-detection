import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import FileSaver from 'file-saver';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Upload = () => {
  const location = useLocation();
  const [file, setFile] = useState(null);
  const [patientName, setPatientName] = useState('');
  const [patientAddress, setPatientAddress] = useState('');
  const [patientContact, setPatientContact] = useState('');
  const [patientGender, setPatientGender] = useState('');
  const [patientId, setPatientId] = useState('');
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (location.state && location.state.patientId) {
      const fetchPatientData = async (patientId) => {
        try {
          const response = await axios.get(`http://127.0.0.1:5000/patient/${patientId}`);
          const { patientName, patientAddress, patientContact, patientGender, patientId } = response.data;
          setPatientName(patientName);
          setPatientAddress(patientAddress);
          setPatientContact(patientContact);
          setPatientGender(patientGender);
          setPatientId(patientId);
        } catch (error) {
          toast.error('Error fetching patient data');
        }
      };

      fetchPatientData(location.state.patientId);
    }
  }, [location.state]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error('No file selected');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('patientName', patientName);
    formData.append('patientAddress', patientAddress);
    formData.append('patientContact', patientContact);
    formData.append('patientGender', patientGender);
    formData.append('patientId', patientId);

    setLoading(true);
    try {
      const response = await axios.post('http://127.0.0.1:5000/predict', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setPrediction(response.data.result);
      toast.success('File uploaded successfully!');
    } catch (error) {
      toast.error('Error uploading file');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveReport = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:5000/save-report', {}, { responseType: 'blob' });
      const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      FileSaver.saveAs(blob, 'predictions.xlsx');
      toast.success('Report saved successfully!');
    } catch (error) {
      toast.error('Error saving report');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200">
      <ToastContainer />
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-4xl">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Upload X-ray</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="w-1/2">
              <label className="block text-gray-700 font-bold mb-2">File</label>
              <input
                type="file"
                onChange={handleFileChange}
                className="w-full p-3 rounded bg-gray-100 text-gray-700 focus:outline-none"
                required
              />
            </div>
            <div className="w-1/2">
              <label className="block text-gray-700 font-bold mb-2">Patient Name</label>
              <input
                type="text"
                placeholder="Patient Name"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                className="w-full p-3 rounded bg-gray-100 text-gray-700 focus:outline-none"
                required
              />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="w-1/2">
              <label className="block text-gray-700 font-bold mb-2">Patient Address</label>
              <input
                type="text"
                placeholder="Patient Address"
                value={patientAddress}
                onChange={(e) => setPatientAddress(e.target.value)}
                className="w-full p-3 rounded bg-gray-100 text-gray-700 focus:outline-none"
                required
              />
            </div>
            <div className="w-1/2">
              <label className="block text-gray-700 font-bold mb-2">Patient Contact</label>
              <input
                type="text"
                placeholder="Patient Contact"
                value={patientContact}
                onChange={(e) => setPatientContact(e.target.value)}
                className="w-full p-3 rounded bg-gray-100 text-gray-700 focus:outline-none"
                required
              />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="w-1/2">
              <label className="block text-gray-700 font-bold mb-2">Patient Gender</label>
              <select
                value={patientGender}
                onChange={(e) => setPatientGender(e.target.value)}
                className="w-full p-3 rounded bg-gray-100 text-gray-700 focus:outline-none"
                required
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            <div className="w-1/2">
              <label className="block text-gray-700 font-bold mb-2">Patient ID</label>
              <input
                type="text"
                placeholder="Patient ID"
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                className="w-full p-3 rounded bg-gray-100 text-gray-700 focus:outline-none"
                required
              />
            </div>
          </div>
          <div className="flex justify-between mt-6">
            <button type="button" onClick={handleSaveReport} className="w-1/2 p-3 bg-gray-600 text-white rounded-lg hover:bg-gray-500 mr-2">
              Save
            </button>
            <button type="submit" className="w-1/2 p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-500" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </form>
        {prediction && (
          <div className="mt-6 bg-gray-100 text-gray-800 p-4 rounded">
            <h3 className="text-xl font-bold">Prediction Result:</h3>
            <p>{prediction}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Upload;
