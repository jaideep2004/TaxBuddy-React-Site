const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const adminRoutes = require('./routes/adminRoutes');

// Initialize environment variables
dotenv.config();

// Connect to the database
connectDB();

// Create Express app
const app = express();

// Middlewares
app.use(express.json()); // Parse JSON requests
app.use(cors()); // Enable CORS

// Routes
app.use('/api/admin', adminRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
