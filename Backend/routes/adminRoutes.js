const express = require('express');
const { adminLogin, getAllUsers, getAllServices } = require('../controllers/adminController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Admin login route
router.post('/login', adminLogin);

// Protected routes for admin
router.get('/users', authMiddleware, getAllUsers);  // Fetch users (protected)
router.get('/services', authMiddleware, getAllServices);  // Fetch services (protected)

module.exports = router;
