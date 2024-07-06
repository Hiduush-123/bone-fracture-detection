const express = require('express');
const xlsx = require('xlsx');

const router = express.Router();

const history = []; // This should be replaced with a database

router.get('/', (req, res) => {
  res.send(history);
});

router.post('/save', (req, res) => {
  const { data } = req.body;
  const ws = xlsx.utils.json_to_sheet(data);
  const wb = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(wb, ws, 'History');
  xlsx.writeFile(wb, 'history.xlsx');
  res.send('File saved');
});

module.exports = router;
