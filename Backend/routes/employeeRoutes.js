const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");

const {
	employeeLogin,
	updateServiceStatus,
	getAssignedCustomers,
} = require("../controllers/employeeController");

router.post("/login", employeeLogin);
router.put("/update-service-status/:serviceId", updateServiceStatus);
router.get("/assigned-customers", authMiddleware, getAssignedCustomers);

module.exports = router;
 