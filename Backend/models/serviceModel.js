const mongoose = require("mongoose");
const { CustomObjectId } = require("../utils/idGenerator");

const serviceSchema = new mongoose.Schema(
	{
		_id: {
			type: String,
			default: () => CustomObjectId.generate("SER"),
			required: true,
		},
		name: { type: String, required: true },
		description: { type: String },
		price: { type: Number, required: true },
		status: { type: String, default: "inactive" },
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Service", serviceSchema);
