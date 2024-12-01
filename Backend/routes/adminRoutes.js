const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const {
	adminLogin,
	getAllUsers,
	getAllServices,
	getDashboardData,
	createService,
	activateUser,
	deactivateUser,
	createEmployee,
	deleteUser,
	assignCustomerToEmployee,
	createUser,
	updateService, // Import the update service function
	deleteService,
	createManager,
	assignEmployeeToManager,
	registerCustomer,
	loginUser,
} = require("../controllers/adminController");

// Admin login
router.post("/login", adminLogin);

// Dashboard data
router.get("/dashboard", authMiddleware, getDashboardData);

// User and Service management routes
router.get("/users", authMiddleware, getAllUsers);
router.get("/services",authMiddleware, getAllServices);
// router.get("/services", getAllServices);
router.post("/services", authMiddleware, createService);
router.put("/user/activate/:userId", authMiddleware, activateUser);
router.put("/user/deactivate/:userId", authMiddleware, deactivateUser);
router.delete("/user/:userId", authMiddleware, deleteUser);
// Employee management
router.post("/employee", authMiddleware, createEmployee);

// Customer assignment
router.post("/assign-customer", authMiddleware, assignCustomerToEmployee);
router.post("/createUser", createUser);
// New Update Service route
router.put("/services/:serviceId", authMiddleware, updateService);

// New Delete Service route
router.delete("/services/:serviceId", authMiddleware, deleteService);
router.post("/manager", authMiddleware, createManager); // Create a manager
router.post("/assign-employee", authMiddleware, assignEmployeeToManager); 

//customer register themseleves
router.post("/customer-register", registerCustomer); 
router.post("/customer-login", authMiddleware, loginUser); 

module.exports = router;
