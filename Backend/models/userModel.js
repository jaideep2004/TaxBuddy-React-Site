// const mongoose = require("mongoose");
// const { CustomObjectId } = require("../utils/idGenerator");

// const userSchema = new mongoose.Schema({
// 	_id: {
// 		type: String,
// 		default: () => CustomObjectId.generate("USR"),
// 		
// 		required: true,
// 	},
// 	name: { type: String, required: true },
// 	email: { type: String, required: true, unique: true },
// 	username: { type: String, required: true, unique: true },
// 	passwordHash: { type: String, required: true },
// 	serviceId: { type: String, ref: "Service" },
// 	salt: { type: String, required: true },
// 	role: {
// 		type: String,
// 		enum: ["admin", "manager", "employee", "customer"],
// 		required: true,
// 	},
// 	isActive: { type: Boolean, default: false },
// 	assignedEmployees: [
// 		{
// 			type: String,
// 			ref: "User",
// 			default: [],
// 		},
// 	], // Only for managers
// 	assignedCustomers: [
// 		{
// 			type: String,
// 			ref: "User",
// 			default: [],
// 		},
// 	], // Only for employees
// });

// // Middleware: Remove irrelevant fields for customers on save
// userSchema.pre("save", function (next) {
// 	if (this.role === "customer") {
// 		this.assignedCustomers = undefined; // Remove assignedCustomers for customers
// 		this.assignedEmployees = undefined; // Customers can't manage employees
// 	}
// 	next();
// });

// // Middleware: Exclude irrelevant fields when querying users
// userSchema.set("toJSON", {
// 	transform: (doc, ret) => {
// 		// For customers, hide assignedCustomers and assignedEmployees
// 		if (ret.role === "customer") {
// 			delete ret.assignedCustomers;
// 			delete ret.assignedEmployees;
// 		}
// 		// For employees, hide assignedEmployees
// 		if (ret.role === "employee") {
// 			delete ret.assignedEmployees;
// 		}
// 		// For all other users, return the object as is
// 		return ret;
// 	},
// });

// const User = mongoose.model("User", userSchema);
// module.exports = User;

const mongoose = require("mongoose");
const { CustomObjectId } = require("../utils/idGenerator");

const userSchema = new mongoose.Schema({
	_id: {
		type: String,
		required: true,
	},
	name: { type: String, required: true },
	email: { type: String, required: true, unique: true },
	username: { type: String, required: true, unique: true },
	passwordHash: { type: String, required: true },
	serviceId: { type: String, ref: "Service" },
	salt: { type: String, required: true },
	role: {
		type: String,
		enum: ["admin", "manager", "employee", "customer"],
		required: true,
	},
	isActive: { type: Boolean, default: false },
	assignedEmployees: [
		{
			type: String,
			ref: "User",
			default: [],
		},
	], // Only for managers
	assignedCustomers: [
		{
			type: String,
			ref: "User",
			default: [],
		},
	], // Only for employees
});

// Middleware: Generate _id based on role before validation
userSchema.pre("validate", async function (next) {
	if (!this._id) {
		let prefix = "USR"; // Default prefix
		switch (this.role) {
			case "admin":
				prefix = "ADM";
				break;
			case "manager":
				prefix = "MAN";
				break;
			case "employee":
				prefix = "EMP";
				break;
			case "customer":
				prefix = "CUS";
				break;
		}
		this._id = await CustomObjectId.generate(prefix);
	}
	next();
});

// Middleware: Remove irrelevant fields for customers on save
userSchema.pre("save", function (next) {
	if (this.role === "customer") {
		this.assignedCustomers = undefined; // Remove assignedCustomers for customers
		this.assignedEmployees = undefined; // Customers can't manage employees
	}
	next();
});

// Middleware: Exclude irrelevant fields when querying users
userSchema.set("toJSON", {
	transform: (doc, ret) => {
		// For customers, hide assignedCustomers and assignedEmployees
		if (ret.role === "customer") {
			delete ret.assignedCustomers;
			delete ret.assignedEmployees;
		}
		// For employees, hide assignedEmployees
		if (ret.role === "employee") {
			delete ret.assignedEmployees;
		}
		// For all other users, return the object as is
		return ret;
	},
});

const User = mongoose.model("User", userSchema);
module.exports = User;
