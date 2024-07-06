import React, { useState } from 'react';
import axios from 'axios';
import FileSaver from 'file-saver';

const Upload = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage('No file selected');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://127.0.0.1:5000/predict', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setMessage(`Prediction: ${response.data.result}`);
    } catch (error) {
      setMessage('Error uploading file');
    }
  };

  const handleSaveReport = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:5000/save-report', {}, { responseType: 'blob' });
      const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      FileSaver.saveAs(blob, 'predictions.xlsx');
    } catch (error) {
      setMessage('Error saving report');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-900">
      <div className="bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Upload X-ray</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="file"
              onChange={handleFileChange}
              className="w-full p-3 rounded bg-gray-700 text-gray-300 focus:outline-none"
              required
            />
          </div>
          <div className="flex justify-between">
            <button type="button" onClick={handleSaveReport} className="w-full p-3 bg-gray-600 text-white rounded-lg hover:bg-gray-500 mr-2">Save</button>
            <button type="submit" className="w-full p-3 bg-orange-600 text-white rounded-lg hover:bg-orange-500">Submit</button>
          </div>
        </form>
        {message && <p className="text-red-500 mt-4">{message}</p>}
      </div>
    </div>
  );
};

export default Upload;
