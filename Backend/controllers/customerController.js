require("dotenv").config();
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const Service = require("../models/serviceModel");
const Razorpay = require("razorpay");
const nodemailer = require("nodemailer");

const hashPassword = (password, salt) => {
	const hash = crypto.createHmac("sha256", salt);
	hash.update(password);
	return hash.digest("hex");
};

const transporter = nodemailer.createTransport({
	service: "gmail",
	auth: {
	  user: process.env.EMAIL_USER,
	  pass: process.env.EMAIL_PASS,
	},
  });
  
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
  
const getCustomerDashboard = async (req, res) => {
	try {
		const { userId } = req.user;

		// Fetch user with populated service and employee details
		const user = await User.findById(userId)
			.populate({
				path: "services.serviceId",
				select: "name description",
			})
			.populate({
				path: "services.employeeId",
				select: "name email",
			})
			.select("-passwordHash -salt");

		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		// Format services with additional fields
		const formattedServices = user.services.map((service) => ({
			serviceId: service.serviceId?._id,
			serviceName: service.serviceId?.name || "Unknown Service",
			serviceDescription: service.serviceId?.description || "No Description",
			status: service.status || "In Process",
			activationStatus: service.activated ? "Active" : "Inactive",
			purchasedAt: service.purchasedAt,
			managedBy: service.employeeId
				? `${service.employeeId.name} (${service.employeeId.email})`
				: "Unassigned",
			documents: service.documents || [], // Include documents array
		}));

		// Respond with formatted user and service data
		res.status(200).json({
			message: "Customer dashboard data fetched successfully",
			user: {
				...user._doc,
				services: formattedServices,
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

const registerCustomer = async (req, res) => {
	const { name, email, mobile, username, password, dob, gender } = req.body;
  
	if (!name || !email || !username || !password) {
	  return res.status(400).json({ message: "All fields are required" });
	}
  
	try {
	  const existingUser = await User.findOne({ $or: [{ email }, { username }] });
	  if (existingUser) {
		return res
		  .status(400)
		  .json({ message: "User already exists with this email or username" });
	  }
  
	  const salt = crypto.randomBytes(16).toString("hex");
	  const hashedPassword = hashPassword(password, salt);
  
	  const newUser = new User({
		name,
		email,
		mobile,
		username,
		dob,
		gender,
		passwordHash: hashedPassword,
		salt,
		role: "customer",
		isProfileComplete: false,
		serviceStatus: "active",
	  });
  
	  await newUser.save();
  
	  // Send welcome email
	  await sendEmail(email, "Welcome to Our Service", `Hello ${name},\nThank you for registering with us!`);
  
	  res.status(201).json({
		message: "Customer registered successfully!",
		userId: newUser._id,
	  });
	} catch (error) {
	  console.error("Error registering customer:", error);
	  res.status(500).json({ message: "Error registering customer" });
	}
  };
  
  const updateCustomerProfile = async (req, res) => {
	const { userId } = req.user;
	const updateFields = req.body;
  
	try {
	  const user = await User.findById(userId);
	  if (!user) {
		return res.status(404).json({ message: "User not found" });
	  }
  
	  Object.keys(updateFields).forEach((field) => {
		if (updateFields[field] !== undefined) {
		  user[field] = updateFields[field];
		}
	  });
  
	  const requiredFields = [
		"pan",
		"gst",
		"address",
		"city",
		"state",
		"country",
		"postalcode",
		"natureEmployement",
		"annualIncome",
		"education",
	  ];
	  user.isProfileComplete = requiredFields.every((field) => user[field]);
  
	  await user.save();
  
	  // Notify user of profile update
	  await sendEmail(user.email, "Profile Updated", "Your profile has been successfully updated.");
  
	  res.status(200).json({
		message: "Profile updated successfully",
		user,
	  });
	} catch (error) {
	  console.error("Error updating profile:", error);
	  res.status(500).json({ message: "Error updating profile" });
	}
  };
  
  const handlePaymentSuccess = async (req, res) => {
	try {
	  const { razorpay_payment_id, amount, userId, serviceId, employeeId } = req.body;
  
	  const razorpayInstance = new Razorpay({
		key_id: process.env.RAZORPAY_KEY_ID,
		key_secret: process.env.RAZORPAY_KEY_SECRET,
	  });
  
	  const paymentDetails = await razorpayInstance.payments.fetch(razorpay_payment_id);
	  if (!paymentDetails) {
		return res.status(404).json({ message: "Payment details not found" });
	  }
  
	  const user = await User.findById(userId);
	  if (!user) {
		return res.status(404).json({ message: "User not found" });
	  }
  
	  const amountInRupees = amount / 100;
	  user.paymentHistory.push({
		paymentId: razorpay_payment_id,
		amount: amountInRupees,
		date: new Date(),
		status: "success",
		paymentMethod: paymentDetails.method,
	  });
  
	  user.services.push({
		serviceId,
		employeeId,
		activated: true,
		purchasedAt: new Date(),
	  });
  
	  await user.save();
  
	  // Notify user of successful payment
	  await sendEmail(user.email, "Payment Successful", `Your payment of Rs.${amountInRupees} has been successfully processed.`);
  
	  res.status(200).json({ message: "Payment and service added successfully" });
	} catch (error) {
	  console.error("Error handling payment success:", error);
	  res.status(500).json({ message: "Error processing payment" });
	}
  };
  
  const uploadDocuments = async (req, res) => {
	try {
	  const { userId } = req.user;
	  const { serviceId } = req.body;
  
	  if (!req.files || req.files.length === 0) {
		return res.status(400).json({ message: "No files uploaded" });
	  }
  
	  const user = await User.findById(userId);
	  if (!user) {
		await Promise.all(req.files.map((file) => fs.unlink(file.path)));
		return res.status(404).json({ message: "User not found" });
	  }
  
	  const serviceIndex = user.services.findIndex(
		(service) => service.serviceId === serviceId
	  );
  
	  if (serviceIndex === -1) {
		await Promise.all(req.files.map((file) => fs.unlink(file.path)));
		return res.status(404).json({
		  message: "Service not found in user's services",
		});
	  }
  
	  const documentRecords = req.files.map((file) => ({
		filename: file.filename,
		originalName: file.originalname,
		path: file.path.replace(/\\/g, "/"),
		mimetype: file.mimetype,
		size: file.size,
		uploadedAt: new Date(),
	  }));
  
	  user.services[serviceIndex].documents.push(...documentRecords);
	  user.services[serviceIndex].status = "Documents Uploaded";
  
	  const savedUser = await user.save();
  
	  // Notify user of successful document upload
	  await sendEmail(user.email, "Documents Uploaded", "Your documents have been successfully uploaded.");
  
	  res.status(200).json({
		message: "Documents uploaded successfully",
		documents: documentRecords,
		service: savedUser.services[serviceIndex],
	  });
	} catch (error) {
	  if (req.files) {
		await Promise.all(
		  req.files.map((file) =>
			fs
			  .unlink(file.path)
			  .catch((err) => console.error(`Error deleting file ${file.path}:`, err))
		  )
		);
	  }
  
	  console.error("Upload error:", error);
	  res.status(500).json({
		message: "Error uploading documents",
		error: error.message,
	  });
	}
};
  
// const registerCustomer = async (req, res) => {
// 	const { name, email, mobile, username, password, dob, gender } = req.body;

// 	if (!name || !email || !username || !password) {
// 		return res.status(400).json({ message: "All fields are required" });
// 	}

// 	try {
// 		// Check for existing email or username
// 		const existingUser = await User.findOne({ $or: [{ email }, { username }] });
// 		if (existingUser) {
// 			return res
// 				.status(400)
// 				.json({ message: "User already exists with this email or username" });
// 		}

// 		// Hash password
// 		const salt = crypto.randomBytes(16).toString("hex");
// 		const hashedPassword = hashPassword(password, salt);

// 		// Create customer user
// 		const newUser = new User({
// 			name,
// 			email,
// 			mobile,
// 			username,
// 			dob,
// 			gender,
// 			passwordHash: hashedPassword,
// 			salt,
// 			role: "customer",
// 			isProfileComplete: false, // Profile is not complete upon registration
// 			// Initially, other fields like PAN, GST, etc., will be null or empty
// 			pan: null,
// 			gst: null,
// 			address: null,
// 			city: null,
// 			state: null,
// 			country: null,
// 			postalcode: null,
// 			natureEmployement: null,
// 			annualIncome: null,
// 			education: null,
// 			certifications: null,
// 			institute: null,
// 			completiondate: null,
// 			serviceStatus: "active", // Service status initially set to active
// 		});

// 		await newUser.save();
// 		res.status(201).json({
// 			message: "Customer registered successfully!",
// 			userId: newUser._id, // Send the userId back
// 		});
// 	} catch (error) {
// 		console.error("Error registering customer:", error);
// 		res.status(500).json({ message: "Error registering customer" });
// 	}
// };

const deleteUser = async (req, res) => {
	try {
		const { userId } = req.params;

		// Find the user by ID and delete it
		const user = await User.findByIdAndDelete(userId);

		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		res.status(200).json({ message: "User deleted successfully" });
	} catch (error) {
		console.error("Error deleting user:", error);
		res.status(500).json({ message: "Error deleting user" });
	}
};

// const updateCustomerProfile = async (req, res) => {
// 	const { userId } = req.user;
// 	const updateFields = ({
// 		pan,
// 		gst,
// 		address,
// 		city,
// 		state,
// 		country,
// 		postalcode,
// 		natureEmployement,
// 		annualIncome,
// 		education,
// 		certifications,
// 		institute,
// 		completiondate,
// 	} = req.body);

// 	try {
// 		const user = await User.findById(userId);
// 		if (!user) {
// 			return res.status(404).json({ message: "User not found" });
// 		}

// 		// Update only the fields provided in the request
// 		Object.keys(updateFields).forEach((field) => {
// 			if (updateFields[field] !== undefined) {
// 				user[field] = updateFields[field];
// 			}
// 		});

// 		// Check if the profile is complete
// 		const requiredFields = [
// 			"pan",
// 			"gst",
// 			"address",
// 			"city",
// 			"state",
// 			"country",
// 			"postalcode",
// 			"natureEmployement",
// 			"annualIncome",
// 			"education",
// 		];
// 		const isProfileComplete = requiredFields.every((field) => user[field]);
// 		user.isProfileComplete = isProfileComplete;

// 		await user.save();

// 		res.status(200).json({
// 			message: "Profile updated successfully",
// 			user, // Send back updated user data
// 		});
// 	} catch (error) {
// 		console.error("Error updating profile:", error);
// 		res.status(500).json({
// 			message: "Error updating profile",
// 			error: error.message,
// 		});
// 	}
// };

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

// 		const razorpayInstance = new Razorpay({
// 			key_id: process.env.RAZORPAY_KEY_ID,
// 			key_secret: process.env.RAZORPAY_KEY_SECRET,
// 		});

// 		// Fetch payment details from Razorpay
// 		const paymentDetails = await razorpayInstance.payments.fetch(
// 			razorpay_payment_id
// 		);

// 		if (!paymentDetails) {
// 			return res.status(404).json({ message: "Payment details not found" });
// 		}

// 		const paymentMethod = paymentDetails.method; // Extract the payment method

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
// 			paymentMethod, // Store the payment method retrieved from Razorpay
// 		});

// 		// Add service details, including employeeId
// 		user.services.push({
// 			serviceId,
// 			employeeId,
// 			activated: true,
// 			purchasedAt: new Date(),
// 		});

// 		await user.save();

// 		res.status(200).json({ message: "Payment and service added successfully" });
// 	} catch (error) {
// 		console.error("Error handling payment success:", error);
// 		res.status(500).json({ message: "Error processing payment" });
// 	}
// };

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

// const uploadDocuments = async (req, res) => {
// 	try {
// 		const { userId } = req.user;
// 		const { serviceId } = req.body;

// 		// Check if files were uploaded
// 		if (!req.files || req.files.length === 0) {
// 			return res.status(400).json({ message: "No files uploaded" });
// 		}

// 		// Find user and validate
// 		const user = await User.findById(userId);
// 		if (!user) {
// 			// Clean up uploaded files
// 			await Promise.all(req.files.map((file) => fs.unlink(file.path)));
// 			return res.status(404).json({ message: "User not found" });
// 		}

// 		// Find service in user's services array
// 		const serviceIndex = user.services.findIndex(
// 			(service) => service.serviceId === serviceId
// 		);

// 		if (serviceIndex === -1) {
// 			// Clean up uploaded files
// 			await Promise.all(req.files.map((file) => fs.unlink(file.path)));
// 			return res.status(404).json({
// 				message: "Service not found in user's services",
// 			});
// 		}

// 		// Create document records
// 		const documentRecords = req.files.map((file) => ({
// 			filename: file.filename,
// 			originalName: file.originalname,
// 			path: file.path.replace(/\\/g, "/"), // Normalize path for cross-platform
// 			mimetype: file.mimetype,
// 			size: file.size,
// 			uploadedAt: new Date(),
// 		}));

// 		// Add documents to service
// 		user.services[serviceIndex].documents.push(...documentRecords);
// 		user.services[serviceIndex].status = "Documents Uploaded";

// 		// Save user with new documents
// 		const savedUser = await user.save();

// 		if (!savedUser) {
// 			// Clean up uploaded files if save failed
// 			await Promise.all(req.files.map((file) => fs.unlink(file.path)));
// 			throw new Error("Failed to save documents to database");
// 		}

// 		res.status(200).json({
// 			message: "Documents uploaded successfully",
// 			documents: documentRecords,
// 			service: savedUser.services[serviceIndex],
// 		});
// 	} catch (error) {
// 		// Clean up files on error
// 		if (req.files) {
// 			await Promise.all(
// 				req.files.map((file) =>
// 					fs
// 						.unlink(file.path)
// 						.catch((err) =>
// 							console.error(`Error deleting file ${file.path}:`, err)
// 						)
// 				)
// 			);
// 		}

// 		console.error("Upload error:", error);
// 		res.status(500).json({
// 			message: "Error uploading documents",
// 			error: error.message,
// 		});
// 	}
// };

module.exports = {
	registerCustomer,
	loginUser,
	initiatePayment,
	getServiceById,
	getUserServices,
	getCustomerDashboard,
	handlePaymentSuccess,
	updateCustomerProfile,
	deleteUser,
	uploadDocuments,
};
