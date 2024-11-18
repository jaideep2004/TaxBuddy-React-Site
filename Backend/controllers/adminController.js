const argon2 = require('argon2'); // Import argon2 for hashing
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const Service = require('../models/serviceModel'); // Assuming you have a service model

// Admin login controller
const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log(`Login attempt with email: ${email}`);
    
    // Find the admin user by email
    const admin = await User.findOne({ email });

    // If admin not found
    if (!admin) {
      console.log('Admin not found');
      return res.status(400).json({ message: 'Admin not found' });
    }

    console.log('Admin found:', admin);

    // Compare password with the hashed password in the database using argon2
    const isMatch = await argon2.verify(admin.password, password);
    console.log('Password comparison result:', isMatch);

    // If password does not match
    if (!isMatch) {
      console.log('Invalid credentials');
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create a JWT token with admin's user id and role
    const token = jwt.sign({ userId: admin._id, role: admin.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    console.log('JWT Token created:', token);

    // Respond with the generated token
    res.json({ token });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all users (admin only)
const getAllUsers = async (req, res) => {
  try {
    console.log('Fetching all users...');
    const users = await User.find({});
    console.log('Users fetched:', users);
    res.json({ users });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all services (admin only)
const getAllServices = async (req, res) => {
  try {
    console.log('Fetching all services...');
    const services = await Service.find({});
    console.log('Services fetched:', services);
    res.json({ services });
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  adminLogin,
  getAllUsers,
  getAllServices
};
