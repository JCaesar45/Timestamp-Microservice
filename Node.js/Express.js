// server.js - Timestamp Microservice API
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({ optionsSuccessStatus: 200 }));
app.use(express.static('public'));
app.use(express.json());

// Root route - serve the HTML documentation
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// API endpoint for timestamp conversion
app.get('/api/:date?', (req, res) => {
  const dateParam = req.params.date;
  let date;

  // If no date parameter provided, use current time
  if (!dateParam) {
    date = new Date();
  } else {
    // Check if the parameter is a Unix timestamp (all digits)
    if (/^\d+$/.test(dateParam)) {
      // Parse as integer (milliseconds)
      date = new Date(parseInt(dateParam));
    } else {
      // Parse as date string
      date = new Date(dateParam);
    }
  }

  // Check if date is valid
  if (date.toString() === 'Invalid Date') {
    return res.json({ error: 'Invalid Date' });
  }

  // Return the response
  res.json({
    unix: date.getTime(),
    utc: date.toUTCString()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Timestamp Microservice running on port ${PORT}`);
  console.log(`📁 Local: http://localhost:${PORT}/`);
});
