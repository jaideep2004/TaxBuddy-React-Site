const User = require("../models/userModel");
const Message = require("../models/messageModel");

// Send to a message

// const sendMessage = async (req, res) => {
// 	console.log("Request body:", req.body);
// 	console.log("Headers:", req.headers);

// 	const { recipientId, content, service } = req.body;
// 	const sender = req.user?.id || req.body.sender;

// 	if (!sender || sender === "undefined") {
// 		return res.status(400).json({ message: "Sender is invalid or missing" });
// 	}

// 	if (!recipientId || !content || !service) {
// 		return res.status(400).json({
// 			message: "Missing required fields: recipientId, content, or service",
// 		});
// 	}

// 	try {
// 		const messageData = {
// 			sender,
// 			recipient: recipientId,
// 			content,
// 			service,
// 			files:
// 				req.files?.map((file) => ({
// 					fileUrl: `${req.protocol}://${req.get("host")}/uploads/${
// 						file.filename
// 					}`,
// 					fileName: file.originalname,
// 					fileType: file.mimetype,
// 				})) || [],
// 		};

// 		const newMessage = new Message(messageData);
// 		console.log("Creating message with data:", messageData);

// 		await newMessage.save();
// 		res.status(201).json({
// 			message: "Message sent successfully",
// 			newMessage,
// 		});
// 	} catch (err) {
// 		console.error("Error sending message:", err);
// 		res.status(500).json({
// 			message: "Error sending message",
// 			error: err.message,
// 		});
// 	}
// };

const sendMessage = async (req, res) => {
	console.log("Request body:", req.body);
	console.log("Headers:", req.headers);

	const { recipientId, content, service } = req.body;
	const sender = req.user?.id || req.body.sender;

	if (!sender || sender === "undefined") {
		return res.status(400).json({ message: "Sender is invalid or missing" });
	}

	if (!recipientId || !content || !service) {
		return res.status(400).json({
			message: "Missing required fields: recipientId, content, or service",
		});
	}

	try {
		const messageData = {
			sender,
			recipient: recipientId,
			content,
			service,
			files:
				req.files?.map((file) => ({
					fileUrl: `${req.protocol}://${req.get(
						"host"
					)}/uploads/${req.user.userId.toString()}/${file.filename}`,
					fileName: file.originalname,
					fileType: file.mimetype,
				})) || [],
		};

		const newMessage = new Message(messageData);
		console.log("Creating message with data:", messageData);

		await newMessage.save();
		res.status(201).json({
			message: "Message sent successfully",
			newMessage,
		});
	} catch (err) {
		console.error("Error sending message:", err);
		res.status(500).json({
			message: "Error sending message",
			error: err.message,
		});
	}
};

//reply

// const replyToMessage = async (req, res) => {
// 	const { messageId } = req.params;
// 	const { replyContent } = req.body;
// 	const repliedBy = req.user?._id;

// 	if (!replyContent) {
// 		return res.status(400).json({ message: "Reply content is missing" });
// 	}

// 	try {
// 		const message = await Message.findById(messageId);
// 		if (!message) {
// 			return res.status(404).json({ message: "Message not found" });
// 		}

// 		const files = (req.files || []).map((file) => ({
// 			fileUrl: `/uploads/${file.filename}`,
// 			fileName: file.originalname,
// 			fileType: file.mimetype,
// 		}));

// 		const replyData = {
// 			repliedBy,
// 			content: replyContent,
// 			files,
// 			createdAt: new Date(),
// 		};

// 		message.replyContent.push(replyData);
// 		message.isReplied = true;
// 		message.isRead = true;

// 		await message.save();
// 		res
// 			.status(200)
// 			.json({ message: "Reply sent successfully", updatedMessage: message });
// 	} catch (err) {
// 		console.error("Error replying to message:", err);
// 		res
// 			.status(500)
// 			.json({ message: "Error replying to message", error: err.message });
// 	}
// };

const replyToMessage = async (req, res) => {
	const { messageId } = req.params;
	const { replyContent } = req.body;
	const repliedBy = req.user?._id;

	if (!replyContent) {
		return res.status(400).json({ message: "Reply content is missing" });
	}

	try {
		const message = await Message.findById(messageId);
		if (!message) {
			return res.status(404).json({ message: "Message not found" });
		}

		const files = (req.files || []).map((file) => ({
			fileUrl: `${req.protocol}://${req.get(
				"host"
			)}/uploads/${req.user.userId.toString()}/${file.filename}`,
			fileName: file.originalname,
			fileType: file.mimetype,
		}));

		const replyData = {
			repliedBy,
			content: replyContent,
			files,
			createdAt: new Date(),
		};

		message.replyContent.push(replyData);
		message.isReplied = true;
		message.isRead = true;

		await message.save();
		res
			.status(200)
			.json({ message: "Reply sent successfully", updatedMessage: message });
	} catch (err) {
		console.error("Error replying to message:", err);
		res
			.status(500)
			.json({ message: "Error replying to message", error: err.message });
	}
};

//get messages

const getMessages = async (req, res) => {
	const { name, role } = req.user; // userId is the username (e.g., "CUS084")
	console.log("User ID (Username):", name); // Debug log

	try {
		// Query based on role
		const query =
			role === "admin"
				? {} // Admin sees all messages
				: { $or: [{ sender: name }, { recipient: name }] }; // Customer sees only their messages

		// Fetch the messages based on the query
		const messages = await Message.find(query).sort({ createdAt: -1 }).lean();

		// Debug log to check messages fetched
		console.log("Fetched Messages:", messages);

		// If no messages are found for the customer, check if they are a participant in any thread
		if (messages.length === 0 && role === "customer") {
			// Let's also check if the customer has any messages as the recipient
			const fallbackQuery = { recipient: name };
			const fallbackMessages = await Message.find(fallbackQuery)
				.sort({ createdAt: -1 })
				.lean();
			console.log("Fallback Messages:", fallbackMessages);
			messages.push(...fallbackMessages); // Add fallback messages to the main list
		}

		// Populate sender and recipient names based on the username
		const populatedMessages = await Promise.all(
			messages.map(async (msg) => {
				// Look up the sender and recipient by username (not _id)
				const senderUser = await User.findOne({ username: msg.sender }) // Query by username
					.select("name")
					.lean();
				const recipientUser = await User.findOne({ username: msg.recipient }) // Query by username
					.select("name")
					.lean();

				// Return the message with sender and recipient names populated
				return {
					...msg,
					sender: { _id: msg.sender, name: senderUser?.name || "Unknown" },
					recipient: {
						_id: msg.recipient,
						name: recipientUser?.name || "Unknown",
					},
				};
			})
		);

		// Send the populated messages back to the client
		res.status(200).json({ messages: populatedMessages });
	} catch (err) {
		console.error("Error fetching messages:", err);
		res
			.status(500)
			.json({ message: "Error fetching messages", error: err.message });
	}
};

const markMessageAsRead = async (req, res) => {
	const { messageId } = req.params;

	try {
		const message = await Message.findById(messageId);
		if (!message) {
			return res.status(404).json({ message: "Message not found" });
		}

		if (message.isRead) {
			return res.status(200).json({
				message: "Message is already marked as read",
				updatedMessage: message,
			});
		}

		message.isRead = true;
		await message.save();

		res.json({ message: "Message marked as read", updatedMessage: message });
	} catch (err) {
		console.error("Error marking message as read:", err);
		res
			.status(500)
			.json({ message: "Error marking message as read", error: err.message });
	}
};

module.exports = {
	sendMessage,
	getMessages,
	markMessageAsRead,
	replyToMessage,
};
