require("dotenv").config();
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

		const user = await User.findById(userId)
			.populate({
				path: "services.serviceId",
				select: "name description", // Populate service details
			})
			.populate({
				path: "services.employeeId",
				select: "name email", // Populate employee details
			})
			.select("-passwordHash -salt"); // Exclude sensitive fields

		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		res.status(200).json({
			message: "Customer dashboard data fetched successfully",
			user: {
				name: user.name,
				email: user.email,
				services: user.services.map((service) => ({
					serviceName: service.serviceId?.name || "Unknown Service",
					serviceDescription:
						service.serviceId?.description || "No Description",
					activationStatus: service.activated ? "Active" : "Inactive",
					purchasedAt: service.purchasedAt,
					managedBy: service.employeeId
						? `${service.employeeId.name} (${service.employeeId.email})`
						: "Unassigned",
				})),
				paymentHistory: user.paymentHistory,
			},
		});
	} catch (err) {
		console.error("Error fetching customer dashboard:", err);
		res.status(500).json({ message: "Error loading customer dashboard" });
	}
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
	const {
		name,
		email,
		mobile,
		dob,
		gender,
		pan,
		gst,
		address,
		city,
		state,
		country,
		postalcode,
		natureEmployement,
		annualIncome,
		education,
		certifications,
		institute,
		completiondate,
		username,
		password,
	} = req.body;

	if (!name || !email || !username || !password) {
		return res.status(400).json({ message: "All fields are required" });
	}

	try {
		// Check for existing email or username
		const existingUser = await User.findOne({ $or: [{ email }, { username }] });
		if (existingUser) {
			return res
				.status(400)
				.json({ message: "User already exists with this email or username" });
		}

		// Hash password
		const salt = crypto.randomBytes(16).toString("hex");
		const hashedPassword = hashPassword(password, salt);

		// Create customer user
		const newUser = new User({
			name,
			email,
			mobile,
			dob,
			gender,
			pan,
			gst,
			address,
			city,
			state,
			country,
			postalcode,
			natureEmployement,
			annualIncome,
			education,
			certifications,
			institute,
			completiondate,
			username,
			passwordHash: hashedPassword,
			salt,
			role: "customer",
		});

		await newUser.save();
		res.status(201).json({
			message: "Customer registered successfully!",
			userId: newUser._id, // Send the userId back
		});
	} catch (error) {
		console.error("Error registering customer:", error);
		res.status(500).json({ message: "Error registering customer" });
	}
};

//login customer

const loginUser = async (req, res) => {
	const { email, password } = req.body;

	try {  
		// Find the user by email
		const user = await User.findOne({ email });
		if (!user) {
			return res.status(400).json({ message: "Invalid email or password" });
		}

		// Hash the entered password and compare with stored hash
		const hashedPassword = hashPassword(password, user.salt);
		if (hashedPassword !== user.passwordHash) {
			return res.status(400).json({ message: "Invalid email or password" });
		}

		// Include additional fields in the token payload (similar to admin)
		const token = jwt.sign(
			{
				_id: user._id, // Use _id for consistency with middleware expectations
				role: user.role, // Role of the user (could be 'customer', 'admin', etc.)
				name: user.name, // Include the name for additional context if needed
				email: user.email, // Email for additional context if needed
			},
			process.env.JWT_SECRET,
			{ expiresIn: "1h" }
		);

		// Return the token and user details
		res.status(200).json({ token, user });
	} catch (err) {
		console.error("Error logging in user:", err);
		res.status(500).json({ message: "Login failed" });
	}
};

// Razorpay Payment Integration
const initiatePayment = async (req, res) => {
	const { amount, currency } = req.body;

	try {
		// Initialize Razorpay instance with credentials from environment variables
		const razorpayInstance = new Razorpay({
			key_id: process.env.RAZORPAY_KEY_ID, // This will now be loaded from .env
			key_secret: process.env.RAZORPAY_KEY_SECRET, // This will now be loaded from .env
		});

		// Check if the keys are loaded properly
		if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
			return res
				.status(500)
				.json({ message: "Razorpay keys are not properly set" });
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

// const handlePaymentSuccess = async (req, res) => {
// 	try {
// 		const { razorpay_payment_id, amount, userId, serviceId, employeeId } =
// 			req.body;

// 		const user = await User.findById(userId);
// 		if (!user) {
// 			return res.status(404).json({ message: "User not found" });
// 		}

// 		const amountInRupees = amount / 100;

// 		// Add payment history
// 		user.paymentHistory.push({
// 			paymentId: razorpay_payment_id,
// 			amount: amountInRupees,
// 			date: new Date(),
// 			status: "success",
// 		});

// 		// Add service details, including employeeId
// 		user.services.push({
// 			serviceId,
// 			employeeId, // Assign employee managing the service
// 			activated: true,
// 			purchasedAt: new Date(),
// 		});
// 		console.log(req.body);

// 		await user.save();

// 		res.status(200).json({ message: "Payment and service added successfully" });
// 	} catch (error) {
// 		console.error("Error handling payment success:", error);
// 		res.status(500).json({ message: "Error processing payment" });
// 	}
// };

const handlePaymentSuccess = async (req, res) => {
	try {
		const { razorpay_payment_id, amount, userId, serviceId, employeeId } =
			req.body;

		const razorpayInstance = new Razorpay({
			key_id: process.env.RAZORPAY_KEY_ID,
			key_secret: process.env.RAZORPAY_KEY_SECRET,
		});

		// Fetch payment details from Razorpay
		const paymentDetails = await razorpayInstance.payments.fetch(
			razorpay_payment_id
		);

		if (!paymentDetails) {
			return res.status(404).json({ message: "Payment details not found" });
		}

		const paymentMethod = paymentDetails.method; // Extract the payment method

		const user = await User.findById(userId);
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		const amountInRupees = amount / 100;

		// Add payment history
		user.paymentHistory.push({
			paymentId: razorpay_payment_id,
			amount: amountInRupees,
			date: new Date(),
			status: "success",
			paymentMethod, // Store the payment method retrieved from Razorpay
		});

		// Add service details, including employeeId
		user.services.push({
			serviceId,
			employeeId,
			activated: true,
			purchasedAt: new Date(),
		});

		await user.save();

		res.status(200).json({ message: "Payment and service added successfully" });
	} catch (error) {
		console.error("Error handling payment success:", error);
		res.status(500).json({ message: "Error processing payment" });
	}
};

const getServiceById = async (req, res) => {
	try {
		const { serviceId } = req.params;
		const service = await Service.findById(serviceId); // Assuming you're using Mongoose to fetch services
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
	getCustomerDashboard,
	handlePaymentSuccess,
};
