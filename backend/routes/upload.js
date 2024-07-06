const express = require('express');
const multer = require('multer');
const { predictFracture } = require('../utils/predict');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/', upload.single('file'), async (req, res) => {
  try {
    const result = await predictFracture(req.file.path);
    res.send({ result });
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
