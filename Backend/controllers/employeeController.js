const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const Service = require("../models/serviceModel");
const Message = require("../models/messageModel");
// Utility: Hash password using SHA-256
const hashPassword = (password, salt) => {
	const hash = crypto.createHmac("sha256", salt);
	hash.update(password);
	return hash.digest("hex");
};

// Employee login
const employeeLogin = async (req, res) => {
	const { email, password } = req.body;

	try {
		const user = await User.findOne({ email });

		if (!user || user.role !== "employee") {
			return res
				.status(400)
				.json({ message: "Invalid credentials or not an employee" });
		}

		const { passwordHash, salt } = user;
		const hashedPassword = hashPassword(password, salt);

		if (hashedPassword !== passwordHash) {
			return res.status(400).json({ message: "Invalid credentials" });
		}

		// Include additional fields in the token payload
		const token = jwt.sign(
			{
				_id: user._id,
				role: user.role,
				name: user.name,
				email: user.email,
			},
			process.env.JWT_SECRET,
			{ expiresIn: "1h" }
		);

		res.json({ token });
	} catch (err) {
		console.error("Error during employee login:", err);
		res.status(500).json({ message: "Error logging in" });
	}
};

// Controller function to fetch assigned customers for the employee
const getAssignedCustomers = async (req, res) => {
	const employeeId = req.user._id; // Extract employee ID from the JWT

	try {
		// Find the employee document by ID in the 'users' collection
		const employee = await User.findById(employeeId);

		if (!employee) {
			return res.status(404).json({ message: "Employee not found" });
		}

		// Get the list of customer IDs assigned to the employee
		const assignedCustomerIds = employee.assignedCustomers;

		if (!assignedCustomerIds || assignedCustomerIds.length === 0) {
			return res
				.status(200)
				.json({ message: "No customers assigned to this employee" });
		}

		// Fetch the details of the assigned customers from the 'users' collection (filtered by 'role: "customer"')
		const customers = await User.find({
			_id: { $in: assignedCustomerIds }, // Match customer IDs in the assignedCustomers array
			role: "customer", // Ensure that only customers are returned
		});

		// Return the list of customers assigned to the employee
		res.json(customers);
	} catch (err) {
		console.error("Error fetching assigned customers:", err);
		res.status(500).json({ message: "Error fetching assigned customers" });
	}
};

const updateServiceStatus = async (req, res) => {
	const { serviceId } = req.params; // serviceId of the service to update
	const { status } = req.body; // new status passed in the request body
	// const { email } = req.user; // Assuming the employee's email is stored in the JWT (use this for employee validation)

	try {
		// Validate the status input
		if (!["approved", "in-process", "rejected"].includes(status)) {
			return res.status(400).json({ message: "Invalid status" });
		}

		// Find and update the service within the user's services array
		const customer = await User.findOneAndUpdate(
			{  role: "customer", "services.serviceId": serviceId }, // Match the customer by email, role, and serviceId
			{ $set: { "services.$.status": status } }, // Update the status of the specific service in the array
			{ new: true } // Return the updated customer document
		);

		if (!customer) {
			return res.status(404).json({ message: "Customer or service not found" });
		}

		// Return the updated service status
		const updatedService = customer.services.find(
			(service) => service.serviceId === serviceId
		);
		res.json({
			message: `Service status updated to ${status}`,
			service: updatedService,
		});
	} catch (err) {
		console.error("Error updating service status:", err);
		res.status(500).json({ message: "Error updating service status" });
	}
};

module.exports = {
	updateServiceStatus,
	getAssignedCustomers,
	employeeLogin,
};
