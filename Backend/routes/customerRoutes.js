const express = require("express");
const {
	registerCustomer,
	loginUser,
	getServiceById,
	initiatePayment,
	getUserServices,
	getCustomerDashboard,
} = require("../controllers/customerController");
const router = express.Router();

router.get("/dashboard", getCustomerDashboard);
// Service details
router.get("/user-services/:serviceId", getServiceById);

// Customer registration
router.post("/user-register", registerCustomer);

// Customer login
router.post("/user-login", loginUser);

// Initiate payment
router.post("/user-payment", initiatePayment);
router.get("/user-services", getUserServices);

module.exports = router;
