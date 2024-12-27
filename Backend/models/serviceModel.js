const mongoose = require("mongoose");
const { CustomObjectId } = require("../utils/idGenerator");

const serviceSchema = new mongoose.Schema(
	{
		_id: {
			type: String,
			required: true,
		},
		name: { type: String, required: true },
		description: { type: String },
		actualPrice: { type: Number, required: true },
		salePrice: { type: Number, required: true },
		hsncode: { type: String, required: true },
		status: { type: String, default: "In Process" },
	},
	{ timestamps: true }
);

// Middleware: Generate _id with "SER" prefix before validation
serviceSchema.pre("validate", async function (next) {
	if (!this._id) {
		this._id = await CustomObjectId.generate("SER");
	}
	next();
});

module.exports = mongoose.model("Service", serviceSchema);


