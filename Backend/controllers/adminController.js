const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
require("dotenv").config(); // Add this at the top of your file

const User = require("../models/userModel");
const Service = require("../models/serviceModel");
const Message = require("../models/messageModel");
// Utility: Hash password using SHA-256
const hashPassword = (password, salt) => {
	const hash = crypto.createHmac("sha256", salt);
	hash.update(password);
	return hash.digest("hex");
};

// Email transport configuration
const transporter = nodemailer.createTransport({
	service: "gmail", // Use your email service provider
	auth: {
		user: process.env.EMAIL_USER, // Your email address
		pass: process.env.EMAIL_PASS, // Your email app-specific password
	},
});

// Function to send emails
const sendEmail = async (to, subject, text) => {
	try {
		await transporter.sendMail({
			from: process.env.EMAIL_USER,
			to,
			subject,
			text,
		});
		console.log(`Email sent to ${to}`);
	} catch (error) {
		console.error(`Failed to send email to ${to}:`, error);
	}
};

// Admin login

const adminLogin = async (req, res) => {
	const { email, password } = req.body;

	try {
		const user = await User.findOne({ email });

		if (!user) {
			return res.status(400).json({ message: "Invalid credentials" });
		}

		const { passwordHash, salt } = user;
		const hashedPassword = hashPassword(password, salt);

		if (hashedPassword !== passwordHash) {
			return res.status(400).json({ message: "Invalid credentials" });
		}

		// Include additional fields in the token payload
		const token = jwt.sign(
			{
				_id: user._id, // Use _id to align with middleware expectations
				role: user.role,
				name: user.name, // Include the name for additional context if needed
				email: user.email, // Include email if needed
			},
			process.env.JWT_SECRET,
			{ expiresIn: "1h" }
		);

		res.json({ token });
	} catch (err) {
		console.error("Error during admin login:", err);
		res.status(500).json({ message: "Error logging in" });
	}
};

// Get all users

const getAllUsers = async (req, res) => {
	try {
		// Fetch all users
		const users = await User.find();

		// Populate services and messages for each user
		const usersWithDetails = await Promise.all(
			users.map(async (user) => {
				// Fetch and populate services by matching customerId
				const services = await Service.find(
					{ customerId: user._id },
					"name description status"
				);

				// Fetch messages for the user
				const messages = await Message.find({ recipient: user._id });

				// Return user details along with services and messages
				return { ...user.toObject(), services, messages };
			})
		);

		res.json(usersWithDetails); // Send the result to the client
	} catch (error) {
		console.error("Error fetching users with services and messages:", error);
		res
			.status(500)
			.json({ message: "Error fetching users with services and messages" });
	}
};

const getAllServices = async (req, res) => {
	try {
		// Fetch all fields, including createdAt
		const services = await Service.find(
			{},
			"serviceId name description actualPrice salePrice status hsncode createdAt"
		);
		res.json({ services });
	} catch (err) {
		res.status(500).json({ message: "Error fetching services" });
	}
};

// Get dashboard data

const getDashboardData = async (req, res) => {
	try {
		// Fetch users with populated services
		const users = await User.find({}).populate({
			path: "services.serviceId",
			select: "name description status",
		});

		// Fetch all services
		const services = await Service.find({});

		// Fetch all messages with populated references
		const messages = await Message.find({})
			.populate("sender", "name email")
			.populate("recipient", "name email")
			.populate("service", "name description");

		// Combine data into response
		const dashboardData = {
			users: users.map((user) => ({
				...user.toObject(),
				services: user.services.map((service) => ({
					...service,
					name: service.serviceId ? service.serviceId.name : "Unknown Service",
				})),
			})),
			services,
			messages,
		};

		res.json(dashboardData);
	} catch (err) {
		console.error("Error fetching dashboard data:", err);
		res.status(500).json({ message: "Error fetching dashboard data" });
	}
};

// Create new service
const createService = async (req, res) => {
	const { name, description, actualPrice, salePrice, hsncode } = req.body;
	try {
		const newService = new Service({
			name,
			description,
			actualPrice,
			salePrice,
			hsncode,
		});
		await newService.save();
		res.status(201).json({ service: newService });
	} catch (err) {
		res.status(500).json({ message: "Error creating service" });
	}
};

// Activate user
const activateUser = async (req, res) => {
	const { userId } = req.params;
	try {
		const user = await User.findByIdAndUpdate(
			userId,
			{ isActive: true },
			{ new: true }
		);
		res.json({ message: "User activated", user });
	} catch (err) {
		res.status(500).json({ message: "Error activating user" });
	}
};

// Deactivate user
const deactivateUser = async (req, res) => {
	const { userId } = req.params;
	try {
		const user = await User.findByIdAndUpdate(
			userId,
			{ isActive: false },
			{ new: true }
		);
		res.json({ message: "User deactivated", user });
	} catch (err) {
		res.status(500).json({ message: "Error deactivating user" });
	}
};

// Delete user
const deleteUser = async (req, res) => {
	const { userId } = req.params;

	try {
		const user = await User.findByIdAndDelete(userId);
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		res.json({ message: "User deleted successfully", user });
	} catch (err) {
		console.error("Error deleting user:", err);
		res.status(500).json({ message: "Error deleting user" });
	}
};

const createEmployee = async (req, res) => {
	const { name, email, role, serviceId, username, password } = req.body;

	try {
		if (!name || !email || !role || !username || !password) {
			return res.status(400).json({ message: "All fields are required" });
		}

		if (role !== "employee") {
			return res.status(400).json({ message: "Role must be 'employee'" });
		}

		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return res
				.status(400)
				.json({ message: "User already exists with this email" });
		}

		const salt = crypto.randomBytes(16).toString("hex");
		const hashedPassword = hashPassword(password, salt);

		const newEmployee = new User({
			name,
			email,
			role,
			serviceId,
			username,
			passwordHash: hashedPassword,
			salt,
		});

		await newEmployee.save();

		await sendEmail(
			email,
			"Welcome to the Team",
			`Hello ${name},\n\nYour account has been created as an employee. Please log in with your credentials.\n\nUsername: ${username}\nPassword: ${password}`
		);

		res.status(201).json({ employee: newEmployee });
	} catch (err) {
		console.error("Error creating employee:", err);
		res.status(500).json({ message: "Error creating employee" });
	}
};

// Assign a customer to an employee
const assignCustomerToEmployee = async (req, res) => {
	const { employeeId, customerId } = req.body;

	try {
		const employee = await User.findById(employeeId);
		if (!employee || employee.role !== "employee") {
			return res.status(400).json({ message: "Invalid employee" });
		}

		const customer = await User.findById(customerId);
		if (!customer || customer.role !== "customer") {
			return res.status(400).json({ message: "Invalid customer" });
		}

		customer.assignedEmployeeId = employeeId;
		customer.services = customer.services.map((service) => {
			if (service.activated) {
				service.employeeId = employeeId;
			}
			return service;
		});

		await customer.save();

		if (!employee.assignedCustomers.includes(customerId)) {
			employee.assignedCustomers.push(customerId);
			await employee.save();
		}

		await sendEmail(
			employee.email,
			"New Customer Assigned",
			`Hello ${employee.name},\n\nA new customer has been assigned to you.\n\nCustomer ID: ${customerId}\nCustomer Name: ${customer.name}`
		);

		await sendEmail(
			customer.email,
			"Employee Assigned",
			`Hello ${customer.name},\n\nAn employee has been assigned to assist you.\n\nEmployee Name: ${employee.name}\nEmployee Email: ${employee.email}`
		);

		res.json({
			message: "Customer assigned to employee successfully",
			customer,
		});
	} catch (err) {
		console.error("Error assigning customer to employee:", err);
		res.status(500).json({ message: "Error assigning customer to employee" });
	}
};

// Create a new manager
const createManager = async (req, res) => {
	const { name, email, role, serviceId, username, password } = req.body;

	try {
		if (!name || !email || !role || !username || !password) {
			return res.status(400).json({ message: "All fields are required" });
		}

		if (role !== "manager") {
			return res.status(400).json({ message: "Role must be 'manager'" });
		}

		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return res
				.status(400)
				.json({ message: "User already exists with this email" });
		}

		const salt = crypto.randomBytes(16).toString("hex");
		const hashedPassword = hashPassword(password, salt);

		const newManager = new User({
			name,
			email,
			role,
			serviceId,
			username,
			passwordHash: hashedPassword,
			salt,
		});

		await newManager.save();

		await sendEmail(
			email,
			"Welcome to the Team",
			`Hello ${name},\n\nYour account has been created as a manager. Please log in with your credentials.\n\nUsername: ${username}\nPassword: ${password}`
		);

		res.status(201).json({ manager: newManager });
	} catch (err) {
		console.error("Error creating manager:", err);
		res.status(500).json({ message: "Error creating manager" });
	}
};

// Assign an employee to a manager
const assignEmployeeToManager = async (req, res) => {
	const { managerId, employeeId } = req.body;

	try {
		const manager = await User.findById(managerId);
		if (!manager || manager.role !== "manager") {
			return res.status(400).json({ message: "Invalid manager" });
		}

		const employee = await User.findById(employeeId);
		if (!employee || employee.role !== "employee") {
			return res.status(400).json({ message: "Invalid employee" });
		}

		employee.assignedManagerId = managerId;
		await employee.save();

		if (!manager.assignedEmployees.includes(employeeId)) {
			manager.assignedEmployees.push(employeeId);
			await manager.save();
		}

		await sendEmail(
			manager.email,
			"New Employee Assigned",
			`Hello ${manager.name},\n\nA new employee has been assigned to you.\n\nEmployee Name: ${employee.name}\nEmployee Email: ${employee.email}`
		);

		await sendEmail(
			employee.email,
			"Manager Assigned",
			`Hello ${employee.name},\n\nYou have been assigned a manager.\n\nManager Name: ${manager.name}\nManager Email: ${manager.email}`
		);

		res.json({
			message: "Employee assigned to manager successfully",
			manager,
			employee,
		});
	} catch (err) {
		console.error("Error assigning employee to manager:", err);
		res.status(500).json({ message: "Error assigning employee to manager" });
	}
};

// Create a new user (admin or employee)
const createUser = async (req, res) => {
	const { name, email, role, serviceId, username, password } = req.body;

	console.log("Received request to create user with data:", req.body);

	try {
		// Validate required fields
		if (!name || !email || !role || !username || !password) {
			console.log("Validation failed: Missing required fields.");
			return res.status(400).json({ message: "All fields are required" });
		}

		// Validate role
		if (!["employee", "admin", "customer"].includes(role)) {
			console.log(`Validation failed: Invalid role "${role}"`);
			return res.status(400).json({ message: "Invalid role" });
		}

		// Ensure serviceId is valid for employees
		if (role === "employee") {
			console.log("Role is employee; validating serviceId...");
			if (!serviceId) {
				console.log("Validation failed: Missing serviceId for employee role.");
				return res
					.status(400)
					.json({ message: "Service ID is required for employees" });
			}

			// Check if the provided serviceId exists
			const service = await Service.findById(serviceId);
			if (!service) {
				console.log(`Validation failed: Invalid serviceId "${serviceId}"`);
				return res.status(400).json({ message: "Invalid Service ID" });
			}
		}

		// Check if the email is already in use
		console.log(`Checking if email "${email}" already exists...`);
		const existingUser = await User.findOne({ email });
		if (existingUser) {
			console.log(`Validation failed: Email "${email}" already exists.`);
			return res
				.status(400)
				.json({ message: "User already exists with this email" });
		}

		// Hash the password
		console.log("Hashing the password...");
		const salt = crypto.randomBytes(16).toString("hex");
		const hashedPassword = hashPassword(password, salt);

		// Create the user (admin or employee)
		console.log("Creating new user...");
		const newUser = new User({
			name,
			email,
			role,
			serviceId,

			username,
			passwordHash: hashedPassword,
			salt,
		});

		// Save the user to the database
		await newUser.save();
		console.log("New user created successfully:", newUser);

		res.status(201).json({ user: newUser });
	} catch (err) {
		console.error("Error creating user:", err);
		res.status(500).json({ message: "Error creating user" });
	}
};
// Update a service
const updateService = async (req, res) => {
	const { serviceId } = req.params;
	const { name, description, actualPrice, salePrice, hsncode } = req.body;

	try {
		const updatedService = await Service.findByIdAndUpdate(
			serviceId,
			{ name, description, actualPrice, salePrice, hsncode },
			{ new: true }
		);

		if (!updatedService) {
			return res.status(404).json({ message: "Service not found" });
		}

		res.json({
			message: "Service updated successfully",
			service: updatedService,
		});
	} catch (err) {
		console.error("Error updating service:", err);
		res.status(500).json({ message: "Error updating service" });
	}
};

// Delete a service
const deleteService = async (req, res) => {
	const { serviceId } = req.params;

	try {
		const deletedService = await Service.findByIdAndDelete(serviceId);
		if (!deletedService) {
			return res.status(404).json({ message: "Service not found" });
		}

		res.json({
			message: "Service deleted successfully",
			service: deletedService,
		});
	} catch (err) {
		console.error("Error deleting service:", err);
		res.status(500).json({ message: "Error deleting service" });
	}
};

module.exports = {
	adminLogin,
	getAllUsers,
	getAllServices,
	getDashboardData,
	createService,
	activateUser,
	deactivateUser,
	deleteUser,
	createEmployee,
	assignCustomerToEmployee,
	createUser,
	updateService,
	deleteService,
	createManager,
	assignEmployeeToManager,
};
