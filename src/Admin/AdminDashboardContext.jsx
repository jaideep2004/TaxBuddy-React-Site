import React, { createContext, useState, useEffect } from "react";
import axios from "./utils/axiosConfig";

// Create a Context
const AdminDashboardContext = createContext();

// Create a provider component
const AdminDashboardProvider = ({ children }) => {
	const [servicesCount, setServicesCount] = useState(0);
	const [usersCount, setUsersCount] = useState(0);
	const [managersCount, setManagersCount] = useState(0);
	
	const [employeesCount, setEmployeesCount] = useState(0);
	const [customersCount, setCustomersCount] = useState(0);

	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [services, setServices] = useState([]);
	const [users, setUsers] = useState([]);
	const [newService, setNewService] = useState({
		name: "",
		description: "",
		price: "",
	});
	const [newEmployee, setNewEmployee] = useState({
		name: "",
		email: "",
		role: "",
		serviceId: "",
		username: "",
		password: "",
	});
	const [newManager, setNewManager] = useState({
		name: "",
		email: "",
		role: "",
		serviceId: "",
		username: "",
		password: "",
	});
	const [newUser, setNewUser] = useState({
		role: "",
		name: "",
		email: "",
		serviceId: "",
		username: "",
		password: "",
	});
	const [assignCustomer, setAssignCustomer] = useState({
		customerId: "",
		employeeId: "",
	});

	const fetchDashboardData = async () => {
		const token = localStorage.getItem("adminToken");
		if (!token) {
			setError("Unauthorized access");
			return;
		}

		const headers = { Authorization: `Bearer ${token}` };

		try {
			const dashboardResponse = await axios.get(
				"http://localhost:5000/api/admin/dashboard",
				{ headers }
			);

			const { services, users } = dashboardResponse.data;
			setServices(services);
			setUsers(users);
			setServicesCount(services.length);
			setUsersCount(users.length);

			// Count employees from users
			const employees = users.filter((user) => user.role === "employee");
			setEmployeesCount(employees.length);
			const customers = users.filter((user) => user.role === "customer");
			setCustomersCount(customers.length);
			const managers = users.filter((user) => user.role === "manager");
			setManagersCount(managers.length);

			setLoading(false);
		} catch (err) {
			setLoading(false);
			setError("Failed to load dashboard data.");
		}
	};

	useEffect(() => {
		fetchDashboardData();
	}, []);

	// Handler Functions
	const handleCreateService = async () => {
		const { name, description, price } = newService;

		if (!name || !description || !price) {
			setError("Please provide all fields.");
			return;
		}

		try {
			const token = localStorage.getItem("adminToken");
			const response = await axios.post(
				"http://localhost:5000/api/admin/services",
				{ name, description, price },
				{ headers: { Authorization: `Bearer ${token}` } }
			);

			setServices([...services, response.data.service]);
			alert("Service created successfully.");
		} catch (err) {
			setError("Error creating service.");
		}
	};

	const handleCreateManager = async () => {
		const { name, email, role, serviceId, username, password } = newManager;

		if (!name || !email || !role || !serviceId || !username || !password) {
			setError("Please provide all fields.");
			return;
		}

		try {
			const token = localStorage.getItem("adminToken");
			const response = await axios.post(
				"http://localhost:5000/api/admin/manager",
				{ name, email, role, serviceId, username, password },
				{ headers: { Authorization: `Bearer ${token}` } }
			);

			alert("Manager created successfully.");
		} catch (err) {
			setError("Error creating manager.");
		}
	};

	const handleCreateEmployee = async () => {
		const { name, email, role, serviceId, username, password } = newEmployee;

		if (!name || !email || !role || !serviceId || !username || !password) {
			setError("Please provide all fields.");
			return;
		}

		try {
			const token = localStorage.getItem("adminToken");
			await axios.post(
				"http://localhost:5000/api/admin/employee",
				{ name, email, role, serviceId, username, password },
				{ headers: { Authorization: `Bearer ${token}` } }
			);

			alert("Employee created successfully.");
			setShowEmployeeForm(false);
			setNewEmployee({
				name: "",
				email: "",
				role: "",
				serviceId: "",
				username: "",
				password: "",
			});
		} catch (err) {
			console.error("Error creating employee:", err);
			setError("Error creating employee.");
		}
	};

	const handleActivateUser = async (userId) => {
		// Optimistically update the state
		setUsers((prevUsers) =>
			prevUsers.map((user) =>
				user._id === userId ? { ...user, isActive: true } : user
			)
		);

		try {
			const token = localStorage.getItem("adminToken");
			await axios.put(
				`http://localhost:5000/api/admin/user/activate/${userId}`,
				{},
				{ headers: { Authorization: `Bearer ${token}` } }
			);
			alert("User activated successfully.");
			fetchDashboardData();
		} catch (err) {
			console.error("Error activating user:", err);

			// Revert state if the API call fails
			setUsers((prevUsers) =>
				prevUsers.map((user) =>
					user._id === userId ? { ...user, isActive: false } : user
				)
			);

			alert("Failed to activate user. Please try again.");
		}
	};

	const handleDeactivateUser = async (userId) => {
		try {
			setUsers((prevUsers) =>
				prevUsers.map((user) =>
					user._id === userId ? { ...user, isActive: true } : user
				)
			);
			const token = localStorage.getItem("adminToken");
			await axios.put(
				`http://localhost:5000/api/admin/user/deactivate/${userId}`,
				{},
				{ headers: { Authorization: `Bearer ${token}` } }
			);

			alert("User deactivated successfully.");
			fetchDashboardData();
			setUsers(
				users.map((user) =>
					user._id === userId ? { ...user, isActive: false } : user
				)
			);
		} catch (err) {
			console.error("Error deactivating user:", err);
		}
	};

	const handleCreateUser = async () => {
		if (!newUser.name || !newUser.email || !newUser.role) {
			setError("Please provide all required fields.");
			return;
		}

		try {
			const token = localStorage.getItem("adminToken");
			const response = await axios.post(
				"http://localhost:5000/api/admin/createUser",
				newUser,
				{ headers: { Authorization: `Bearer ${token}` } }
			);

			alert("User created successfully.");
			setUsers([...users, response.data.employee]); // Update users with the new employee
		} catch (err) {
			console.error("Error creating user:", err);
			setError("Error creating user.");
		}
	};

	const handleDeleteUser = async (userId) => {
		try {
			const token = localStorage.getItem("adminToken");
			await axios.delete(`http://localhost:5000/api/admin/user/${userId}`, {
				headers: { Authorization: `Bearer ${token}` },
			});

			alert("User deleted successfully.");
			setUsers(users.filter((user) => user._id !== userId));
		} catch (err) {
			console.error("Error deleting user:", err);
		}
	};

	const handleAssignCustomer = async () => {
		const { customerId, employeeId } = assignCustomer;

		if (!customerId || !employeeId) {
			setError("Please provide all fields.");
			return;
		}

		try {
			const token = localStorage.getItem("adminToken");
			await axios.post(
				"http://localhost:5000/api/admin/assign-customer",
				{ customerId, employeeId },
				{ headers: { Authorization: `Bearer ${token}` } }
			);

			alert("Customer assigned to employee successfully.");
			setShowAssignCustomerForm(false);
			setAssignCustomer({ customerId: "", employeeId: "" });
		} catch (err) {
			console.error("Error assigning customer:", err);
			setError("Error assigning customer.");
		}
	};

	const handleUpdateService = async (updatedService) => {
		try {
			const token = localStorage.getItem("adminToken");
			const response = await axios.put(
				`http://localhost:5000/api/admin/services/${updatedService._id}`,
				updatedService,
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);

			// Update the services in t he frontend after successful response
			setServices((prevServices) =>
				prevServices.map((service) =>
					service._id === updatedService._id ? response.data.service : service
				)
			);

			alert("Service updated successfully!");
		} catch (error) {
			console.error("Error updating service:", error);
			alert("Failed to update service. Please try again.");
		}
	};

	const handleDeleteService = async (serviceId) => {
		try {
			const token = localStorage.getItem("adminToken");
			await axios.delete(
				`http://localhost:5000/api/admin/services/${serviceId}`,
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);
			setServices((prevServices) =>
				prevServices.filter((service) => service._id !== serviceId)
			);

			alert("Service deleted successfully!");
		} catch (error) {
			console.error("Error deleting service:", error);
			alert("Failed to delete service. Please try again.");
		}
	};

	return (
		<AdminDashboardContext.Provider
			value={{
				servicesCount,
				usersCount,
				employeesCount,
				managersCount,
				customersCount,
				loading,
				error,
				services,
				users,
				newService,
				setNewService,
				newEmployee,
				setNewEmployee,
				newManager,
				setNewManager,
				newUser,
				setNewUser,
				fetchDashboardData,
				handleCreateService,
				handleCreateManager,
				handleActivateUser,
				handleDeactivateUser,
				handleCreateUser,
				handleDeleteUser,
				assignCustomer,
				setAssignCustomer,
				handleCreateEmployee,
				handleAssignCustomer,
				handleUpdateService,
				handleDeleteService,
			}}>
			{children}
		</AdminDashboardContext.Provider>
	);
};

// Export the context and provider
export { AdminDashboardContext, AdminDashboardProvider };
