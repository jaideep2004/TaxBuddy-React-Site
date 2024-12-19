// const mongoose = require("mongoose");
// const User = require("../models/userModel");

// const messageSchema = new mongoose.Schema({
// 	content: { type: String, required: true },
// 	recipient: { type: String, ref: "User" }, // Use String instead of ObjectId
// 	sender: { type: String, ref: "User" }, // Update sender as well if needed
// 	service: { type: String },
//   replyContent: { type: String },
//   repliedBy: { type: String, ref: "User" }, // This needs to be added
// 	isReplied: { type: Boolean, default: false },
// 	isRead: { type: Boolean, default: false },
// 	createdAt: { type: Date, default: Date.now },
// });

// const Message = mongoose.model("Message", messageSchema);
// module.exports = Message;

const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
	content: { type: String, required: true },
	sender: { type: String, ref: "User", required: true },
	recipient: {
		type: String,
		ref: "User",
		required: true,
	},

	service: {
		type: String,
		ref: "Service",
		required: true,
	},
	isReplied: { type: Boolean, default: false },
	isRead: { type: Boolean, default: false },
	createdAt: { type: Date, default: Date.now },
	replyContent: [
		{
			repliedBy: { type: String, ref: "User" },
			content: { type: String },
			files: [
				{
					fileUrl: { type: String },
					fileName: { type: String },
					fileType: { type: String },
				},
			],
			createdAt: { type: Date, default: Date.now },
		},
	],
	repliedBy: { type: String, ref: "User" },
});

const Message = mongoose.model("Message", messageSchema);
module.exports = Message;
