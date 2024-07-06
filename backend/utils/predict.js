const { spawn } = require('child_process');

const predictFracture = (filePath) => {
  return new Promise((resolve, reject) => {
    const pythonProcess = spawn('python', ['predict.py', filePath]);
    pythonProcess.stdout.on('data', (data) => {
      resolve(data.toString());
    });
    pythonProcess.stderr.on('data', (data) => {
      reject(data.toString());
    });
  });
};

module.exports = { predictFracture };
