const express = require('express');
const multer = require('multer');
const xlsx = require('xlsx');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware setup
app.use(cors());
app.use(express.json());
const upload = multer({ storage: multer.memoryStorage() });

// API Endpoint for file upload
app.post('/upload', upload.array('files'), (req, res) => {
  try {
    const files = req.files;
    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const data = files.map(file => {
      const workbook = xlsx.read(file.buffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      return xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
    });

    res.json({ filesData: data });
  } catch (error) {
    console.error('Error processing files:', error);
    res.status(500).json({ error: 'Error processing Excel files' });
  }
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '..', 'build')));
  
  // Handle React routing, return all requests to React app
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'build', 'index.html'));
  });
}

// Export the app for Electron to require
module.exports = app;

// Start server only when not in Electron production
if (!process.versions.electron || process.env.NODE_ENV === 'development') {
  const port = process.env.PORT || 5000;
  app.listen(port, () => console.log(`Server running on port ${port}`));
}