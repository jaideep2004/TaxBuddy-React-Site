require('dotenv').config();
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const Service = require("../models/serviceModel");
const Razorpay = require("razorpay");

const hashPassword = (password, salt) => {
	const hash = crypto.createHmac("sha256", salt);
	hash.update(password);
	return hash.digest("hex");
};

const getCustomerDashboard = async (req, res) => {
	try {
		const { userId } = req.user; // Extract the logged-in user's ID using middleware

		// Fetch user's own data
		const user = await User.findById(userId);

		// Fetch all available services
		const services = await Service.find({});

		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		res.status(200).json({
			message: "Customer dashboard data fetched successfully",
			user,
			services,
		});
	} catch (err) {
		console.error("Error fetching customer dashboard:", err);
		res.status(500).json({ message: "Error loading customer dashboard" });
	}
};

module.exports = {
	getCustomerDashboard,
};


const getUserServices = async (req, res) => {
	try {
		const services = await Service.find({});
		res.json({ services });
	} catch (err) {
		res.status(500).json({ message: "Error fetching services" });
	}
};

//customer register
const registerCustomer = async (req, res) => {
    const { name, email, username, password } = req.body;

    if (!name || !email || !username || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        // Check for existing email or username
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists with this email or username" });
        }

        // Hash password
        const salt = crypto.randomBytes(16).toString("hex");
        const hashedPassword = hashPassword(password, salt);

        // Create customer user
        const newUser = new User({
            name,
            email,
            username,
            passwordHash: hashedPassword,
            salt,
            role: "customer",
        });

        await newUser.save();
        res.status(201).json({ message: "Customer registered successfully!" });
    } catch (error) {
        console.error("Error registering customer:", error);
        res.status(500).json({ message: "Error registering customer" });
    }
};

//login customer
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const hashedPassword = hashPassword(password, user.salt);
        if (hashedPassword !== user.passwordHash) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // Generate JWT
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.status(200).json({ token, user });
    } catch (err) {
        console.error("Error logging in user:", err);
        res.status(500).json({ message: "Login failed" });
    }
};

// Razorpay Payment Integration
// Razorpay Payment Integration
const initiatePayment = async (req, res) => {
    const { amount, currency } = req.body;

    try {
        // Initialize Razorpay instance with credentials from environment variables
        const razorpayInstance = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,  // This will now be loaded from .env
            key_secret: process.env.RAZORPAY_KEY_SECRET,  // This will now be loaded from .env
        });

        // Check if the keys are loaded properly
        if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
            return res.status(500).json({ message: "Razorpay keys are not properly set" });
        }

        // Create order
        const order = await razorpayInstance.orders.create({
            amount: amount * 100, // Razorpay expects amount in paise
            currency: currency || "INR",
            payment_capture: 1,
        });

        res.json({ order });
    } catch (error) {
        console.error("Error initiating payment:", error);
        res.status(500).json({ message: "Error initiating payment" });
    }
};

const getServiceById = async (req, res) => {
    try {
        const { serviceId } = req.params;
        const service = await Service.findById(serviceId);  // Assuming you're using Mongoose to fetch services
        if (!service) {
            return res.status(404).json({ message: "Service not found" });
        }
        res.json({ service });
    } catch (err) {
        console.error("Error fetching service:", err);
        res.status(500).json({ message: "Error fetching service" });
    }
};


module.exports = {
	registerCustomer,
	loginUser,
    initiatePayment,
    getServiceById,
    getUserServices,
    getCustomerDashboard
};

