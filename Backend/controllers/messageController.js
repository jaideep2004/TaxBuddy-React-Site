const User = require("../models/userModel");
const Message = require("../models/messageModel");

// Send a new message
// const sendMessage = async (req, res) => {
// 	const { recipientId, content, service } = req.body;
// 	const senderId = req.user.userId;
// 	const files = req.files || []; // Uploaded files from Multer middleware
// 	console.log("Received message data:", {
//         senderId,
//         recipientId,
//         content,
//         service,
//         files: files.length
//     });
// 	try {
// 		// Prepare file data
// 		const fileData = files.map((file) => ({
// 			// fileUrl: `/uploads/${file.filename}`,
// 			fileUrl: `${req.protocol}://${req.get("host")}/uploads/${file.filename}`,
// 			fileName: file.originalname, // Original file name
// 			fileType: file.mimetype, // MIME type (e.g., image/png, application/pdf)
// 		}));

// 		// Create new message
// 		const newMessage = new Message({
// 			sender: senderId,
// 			recipient: recipientId,
// 			content,
// 			service,
// 			files: fileData, // Add uploaded files to the message
// 		});

// 		await newMessage.save();

// 		res.status(201).json({
// 			message: "Message sent successfully",
// 			newMessage,
// 		});
// 	} catch (err) {
// 		console.error("Error sending message:", err);
// 		res.status(500).json({ message: "Error sending message" });
// 	}
// };

const sendMessage = async (req, res) => {
	console.log("Request body:", req.body);
	console.log("Files:", req.files);
	console.log("Headers:", req.headers);

	const { recipientId, content, service } = req.body;
	const sender = req.body.sender; // Try to get sender directly from body

	console.log("Extracted values:", {
		sender,
		recipientId,
		content,
		service,
	});

	try {
		// Create message with explicit logging
		const messageData = {
			sender: sender,
			recipient: recipientId,
			content,
			service,
			files: req.files
				? req.files.map((file) => ({
						fileUrl: `${req.protocol}://${req.get("host")}/uploads/${
							file.filename
						}`,
						fileName: file.originalname,
						fileType: file.mimetype,
				  }))
				: [],
		};

		console.log("Creating message with data:", messageData);

		const newMessage = new Message(messageData);
		console.log("Created message object:", newMessage);

		await newMessage.save();

		res.status(201).json({
			message: "Message sent successfully",
			newMessage,
		});
	} catch (err) {
		console.error("Full error details:", {
			message: err.message,
			stack: err.stack,
			errors: err.errors,
		});
		res.status(500).json({
			message: "Error sending message",
			error: err.message,
			validationErrors: err.errors,
		});
	}
};
// Reply to a message
const replyToMessage = async (req, res) => {
	const { messageId } = req.params;
	const { replyContent } = req.body;
	const repliedBy = req.user.userId; // Admin/Employee ID
	const files = req.files || [];

	try {
		// Find the existing message
		const message = await Message.findById(messageId);

		if (!message) {
			return res.status(404).json({ message: "Message not found" });
		}

		// Prepare file data
		const fileData = files.map((file) => ({
			fileUrl: `/uploads/${file.filename}`,
			fileName: file.originalname,
			fileType: file.mimetype,
		}));

		// Append the reply to replyContent array
		message.replyContent.push({
			repliedBy,
			content: replyContent,
			files: fileData,
			createdAt: new Date(),
		});

		// Update message status
		message.isReplied = true;
		message.isRead = true;

		await message.save();

		res.status(200).json({
			message: "Reply sent successfully",
			updatedMessage: message,
		});
	} catch (err) {
		console.error("Error replying to message:", err);
		res.status(500).json({ message: "Error replying to message" });
	}
};

// Get messages between two users

const getMessages = async (req, res) => {
	const { _id: userId, role } = req.user; // Extract userId and role from req.user
	const { page = 1, limit = 10 } = req.query; // Default to page 1, limit 10

	try {
		let query;

		if (role === "admin") {
			// Admins get access to all messages
			query = {};
		} else {
			// Non-admin users only see messages involving them
			query = { $or: [{ sender: userId }, { recipient: userId }] };
		}

		const messages = await Message.find(query)
			.sort({ createdAt: -1 })
			.skip((page - 1) * limit) // Pagination: Skip based on page
			.limit(limit) // Limit to the specified number
			.populate("sender", "name")
			.populate("repliedBy", "name");

		const totalMessages = await Message.countDocuments(query);

		res.status(200).json({
			messages,
			totalMessages,
			totalPages: Math.ceil(totalMessages / limit),
			currentPage: page,
		});
	} catch (err) {
		console.error("Error fetching messages:", err);
		res.status(500).json({ message: "Error fetching messages" });
	}
};

// Mark a message as read
const markMessageAsRead = async (req, res) => {
	const { messageId } = req.params;

	try {
		const message = await Message.findById(messageId);
		if (!message) {
			return res.status(404).json({ message: "Message not found" });
		}

		// If message is already marked as read, no need to update
		if (message.isRead) {
			return res
				.status(200)
				.json({ message: "Message is already marked as read" });
		}

		// Mark as read
		message.isRead = true;
		await message.save();

		res.json({ message: "Message marked as read", updatedMessage: message });
	} catch (err) {
		console.error("Error marking message as read:", err);
		res.status(500).json({ message: "Error marking message as read" });
	}
};

module.exports = {
	sendMessage,
	getMessages,
	markMessageAsRead,
	replyToMessage,
};
