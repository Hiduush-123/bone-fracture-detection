import React, { useState, useEffect } from 'react';
import axios from 'axios';

const History = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      const res = await axios.get('http://localhost:5000/api/history');
      setHistory(res.data);
    };
    fetchHistory();
  }, []);

  return (
    <div>
      {history.map((item, index) => (
        <div key={index}>
          <p>{item.date}</p>
          <p>{item.result}</p>
        </div>
      ))}
    </div>
  );
};

export default History;
