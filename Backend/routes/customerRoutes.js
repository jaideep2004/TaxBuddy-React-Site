const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const upload = require("../middlewares/upload");
const {
	registerCustomer,
	loginUser,
	getServiceById,
	initiatePayment,
	getUserServices,
	getCustomerDashboard,
	handlePaymentSuccess,
	updateCustomerProfile,
	uploadDocuments,
} = require("../controllers/customerController");
const router = express.Router();

router.get("/cdashboard", authMiddleware, getCustomerDashboard);
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
router.put("/update-profile", authMiddleware, updateCustomerProfile);
router.post("/upload-documents", authMiddleware, upload, uploadDocuments);

module.exports = router;
