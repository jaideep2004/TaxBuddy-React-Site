const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const {
	registerCustomer,
	loginUser,
	getServiceById,
	initiatePayment,
	getUserServices,
	getCustomerDashboard,
	handlePaymentSuccess,
} = require("../controllers/customerController");
const router = express.Router();

router.get("/cdashboard",authMiddleware, getCustomerDashboard);
// Service details
router.get("/user-services/:serviceId", getServiceById);

// Customer registration
router.post("/user-register", registerCustomer);

// Customer login
router.post("/user-login", loginUser);

// Initiate payment
router.post("/user-payment", initiatePayment);
router.get("/user-services", getUserServices);
router.post("/payment-success", handlePaymentSuccess);

module.exports = router;
