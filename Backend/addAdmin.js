const mongoose = require('mongoose');
const argon2 = require('argon2'); // Import argon2
const dotenv = require('dotenv');
const User = require('./models/userModel'); // Adjust the path based on your project structure

dotenv.config();

// Connect to MongoDB using Mongoose
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Database connected successfully');
    createAdminUser(); // Call the function to create an admin user
  })
  .catch((error) => {
    console.error('Database connection error:', error);
  });

// Function to create an admin user
const createAdminUser = async () => {
  const email = 'admin@example.com'; // Set the admin's email
  const password = 'admin@123'; // Set the admin's password
  const role = 'admin'; // Set the admin's role

  // Check if the admin already exists
  const adminExists = await User.findOne({ email });
  if (adminExists) {
    console.log('Admin user already exists.');
    process.exit(); // Exit the process if admin already exists
  }

  // Hash the password using argon2
  const hashedPassword = await argon2.hash(password);
  console.log('Password hashed successfully:', hashedPassword);

  // Create the admin user
  const newAdmin = new User({
    email,
    password: hashedPassword,
    role,
  });

  try {
    // Save the new admin user to the database
    await newAdmin.save();
    console.log('Admin user created successfully:', newAdmin);
    process.exit(); // Exit the process after successful creation
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1); // Exit the process with error status
  }
};
