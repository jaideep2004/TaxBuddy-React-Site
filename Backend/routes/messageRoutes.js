const express = require("express");
const {
	sendMessage,
	getMessages,
	markMessageAsRead,
	replyToMessage,
} = require("../controllers/messageController");
const authMiddleware = require("../middlewares/authMiddleware");
const upload = require("../middlewares/upload"); // Multer middleware
const router = express.Router();

// Send a message
router.post("/send", authMiddleware, upload, sendMessage);

// Get all messages
router.get("/", authMiddleware, getMessages);

// Mark a message as read
router.patch("/:messageId/read", authMiddleware, markMessageAsRead);

// Reply to a message
router.patch("/:messageId/reply", upload, authMiddleware, replyToMessage);

module.exports = router;
