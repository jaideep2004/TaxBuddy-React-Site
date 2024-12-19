const mongoose = require("mongoose");
const { CustomObjectId } = require("../utils/idGenerator");

const userSchema = new mongoose.Schema(
	{
		_id: {
			type: String,
			required: true,
		},
		name: { type: String, required: true },
		email: { type: String, required: true, unique: true },
		mobile: { type: Number, unique: true },
		dob: {
			type: Date,
			required: function () {
				return this.role === "customer";
			},
			unique: true,
		},
		gender: {
			type: String,
			required: function () {
				return this.role === "customer";
			},
			unique: true,
		},
		pan: {
			type: String,
			required: function () {
				return this.role === "customer";
			},
			unique: true,
		},
		gst: {
			type: String,
			required: function () {
				return this.role === "customer";
			},
			unique: true,
		},
		address: {
			type: String,
			required: function () {
				return this.role === "customer";
			},
			unique: true,
		},
		city: {
			type: String,
			required: function () {
				return this.role === "customer";
			},
			unique: true,
		},
		state: {
			type: String,
			required: function () {
				return this.role === "customer";
			},
			unique: true,
		},
		country: {
			type: String,
			required: function () {
				return this.role === "customer";
			},
			unique: true,
		},
		postalcode: {
			type: Number,
			required: function () {
				return this.role === "customer";
			},
			unique: true,
		},
		natureEmployement: {
			type: String,
			required: function () {
				return this.role === "customer";
			},
			unique: true,
		},
		annualIncome: {
			type: String,
			required: function () {
				return this.role === "customer";
			},
			unique: true,
		},
		education: {
			type: String,
			required: function () {
				return this.role === "customer";
			},
			unique: true,
		},
		certifications: {
			type: String,
			required: function () {
				return this.role === "customer";
			},
			unique: true,
		},
		institute: {
			type: String,
			required: function () {
				return this.role === "customer";
			},
			unique: true,
		},
		completiondate: {
			type: Date,
			required: function () {
				return this.role === "customer";
			},
			unique: true,
		},
		activefrom: { type: String },
		activetill: { type: String },
		customerCreateDate: { type: String },
		username: {
			type: String,
			required: function () {
				return this.role === "customer";
			},
			unique: true,
		},
		passwordHash: { type: String, required: true },

		services: [
			{
				serviceId: { type: String, ref: "Service" },
				activated: { type: Boolean, default: true },
				purchasedAt: { type: Date, default: Date.now },
				employeeId: { type: String, ref: "User" },
			},
		],
		paymentHistory: [
			{
				paymentId: { type: String },
				amount: { type: Number },
				date: { type: Date, default: Date.now },
				status: { type: String, enum: ["success", "failed", "pending"] },
				paymentMethod: { type: String },
			},
		],
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
	},
	{ timestamps: true } // This adds the createdAt and updatedAt fields
);

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
	} else {
		// Clear customer-specific fields for non-customers
		this.mobile = undefined;
		this.dob = undefined;
		this.gender = undefined;
		this.pan = undefined;
		this.gst = undefined;
		this.address = undefined;
		this.city = undefined;
		this.state = undefined;
		this.country = undefined;
		this.postalcode = undefined;
		this.natureEmployement = undefined;
		this.annualIncome = undefined;
		this.education = undefined;
		this.certifications = undefined;
		this.institute = undefined;
		this.completiondate = undefined;
		this.activefrom = undefined;
		this.activetill = undefined;
		this.customerCreateDate = undefined;
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

//active or deactive user
userSchema.pre("save", function (next) {
	// Automatically manage activeFrom and activeTill based on isActive
	if (this.isModified("isActive")) {
		if (this.isActive) {
			this.activeFrom = new Date().toISOString(); // Set the current date
			this.activeTill = null; // Clear activeTill if reactivated
		} else {
			this.activeTill = new Date().toISOString(); // Set activeTill when deactivated
		}
	}
	next();
});

const User = mongoose.model("User", userSchema);
module.exports = User;
