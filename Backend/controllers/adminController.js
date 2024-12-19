const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const Service = require("../models/serviceModel");

// Utility: Hash password using SHA-256
const hashPassword = (password, salt) => {
	const hash = crypto.createHmac("sha256", salt);
	hash.update(password);
	return hash.digest("hex");
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

		const token = jwt.sign(
			{ userId: user._id, role: user.role },
			process.env.JWT_SECRET,
			{ expiresIn: "2h" }
		);

		res.json({ token });
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: "Error logging in" });
	}
};

// Get all users
const getAllUsers = async (req, res) => {
	try {
		const users = await User.find({});
		res.json({ users });
	} catch (err) {
		res.status(500).json({ message: "Error fetching users" });
	}
};

const getAllServices = async (req, res) => {
	try {
		// Fetch all fields, including createdAt
		const services = await Service.find(
			{},
			"serviceId name description price status createdAt"
		);
		res.json({ services });
	} catch (err) {
		res.status(500).json({ message: "Error fetching services" });
	}
};

// Get dashboard data
const getDashboardData = async (req, res) => {
	try {
		const users = await User.find(
			{},
			"name email role assignedEmployees assignedCustomers serviceId createdAt"
		);
		const services = await Service.find(
			{},
			"name status description price createdAt"
		);
		res.json({ users, services });
	} catch (err) {
		res.status(500).json({ message: "Error fetching dashboard data" });
	}
};

// Create new service
const createService = async (req, res) => {
	const { name, description, price } = req.body;
	try {
		const newService = new Service({ name, description, price });
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

// Create a new employee
const createEmployee = async (req, res) => {
	const { name, email, role, serviceId, username, password } = req.body;

	console.log("Received request to create employee with data:", req.body);

	try {
		// Validate required fields
		if (!name || !email || !role || !username || !password) {
			console.log("Validation failed: Missing required fields.");
			return res.status(400).json({ message: "All fields are required" });
		}

		// Validate role
		if (!["employee", "admin"].includes(role)) {
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

		// Create the employee
		console.log("Creating new employee...");
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
		console.log("New employee created successfully:", newEmployee);

		res.status(201).json({ employee: newEmployee });
	} catch (err) {
		console.error("Error creating employee:", err);
		res.status(500).json({ message: "Error creating employee" });
	}
};

const assignCustomerToEmployee = async (req, res) => {
	const { customerId, employeeId } = req.body;

	try {
		// Validate the employee
		const employee = await User.findById(employeeId);
		if (!employee || employee.role !== "employee") {
			return res.status(400).json({ message: "Invalid employee" });
		}

		// Validate the customer
		const customer = await User.findById(customerId);
		if (!customer || customer.role !== "customer") {
			return res.status(400).json({ message: "Invalid customer" });
		}

		// Assign the customer to the employee
		customer.assignedEmployeeId = employeeId;

		// Update the services array to include the employeeId for all active services
		customer.services = customer.services.map((service) => {
			if (service.activated) {
				service.employeeId = employeeId; // Assign the employee
			}
			return service;
		});

		await customer.save();

		// Add the customer to the employee's assignedCustomers array
		if (!employee.assignedCustomers.includes(customerId)) {
			employee.assignedCustomers.push(customerId);
			await employee.save();
		}

		res.json({
			message: "Customer assigned to employee successfully",
			customer,
		});
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: "Error assigning customer to employee" });
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
	const { name, description, price } = req.body;

	try {
		const updatedService = await Service.findByIdAndUpdate(
			serviceId,
			{ name, description, price },
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

const createManager = async (req, res) => {
	const { name, email, username, password } = req.body;

	try {
		// Check if the email is already in use
		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return res
				.status(400)
				.json({ message: "User already exists with this email" });
		}

		// Hash the password
		const salt = crypto.randomBytes(16).toString("hex");
		const hashedPassword = hashPassword(password, salt);

		// Create the manager
		const newManager = new User({
			name,
			email,
			username,
			passwordHash: hashedPassword,
			salt,
			role: "manager",
		});

		await newManager.save();
		res.status(201).json({ manager: newManager });
	} catch (err) {
		console.error("Error creating manager:", err);
		res.status(500).json({ message: "Error creating manager" });
	}
};

const assignEmployeeToManager = async (req, res) => {
	const { managerId, employeeId } = req.body;

	try {
		// Validate the manager
		const manager = await User.findById(managerId);
		if (!manager || manager.role !== "manager") {
			return res.status(400).json({ message: "Invalid manager" });
		}

		// Validate the employee
		const employee = await User.findById(employeeId);
		if (!employee || employee.role !== "employee") {
			return res.status(400).json({ message: "Invalid employee" });
		}

		// Assign the employee to the manager
		employee.assignedManagerId = managerId;
		await employee.save();

		// Add the employee to the manager's list of assigned employees
		if (!manager.assignedEmployees.includes(employeeId)) {
			manager.assignedEmployees.push(employeeId);
			await manager.save();
		}

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
