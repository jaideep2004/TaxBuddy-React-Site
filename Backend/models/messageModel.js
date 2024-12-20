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
