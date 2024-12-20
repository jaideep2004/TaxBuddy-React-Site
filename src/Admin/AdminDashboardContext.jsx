import React, { createContext, useState, useEffect, useMemo } from "react";
import axios from "./utils/axiosConfig";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const AdminDashboardContext = createContext();

const AdminDashboardProvider = ({ children }) => {
	const [servicesCount, setServicesCount] = useState(0);
	const [usersCount, setUsersCount] = useState(0);
	const [managersCount, setManagersCount] = useState(0);
	const [employeesCount, setEmployeesCount] = useState(0);
	const [customersCount, setCustomersCount] = useState(0);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [services, setServices] = useState([]);
	const [users, setUsers] = useState([]);
	const [messages, setMessages] = useState([]);
	//login
	const [isAuthenticated, setIsAuthenticated] = useState(
		!!localStorage.getItem("adminToken")
	);

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
	const [showUserForm, setShowUserForm] = useState(false);
	const [showAssignCustomerForm, setShowAssignCustomerForm] = useState(false);
	// Fetch Dashboard Data

	const fetchDashboardData = async () => {
		const token = localStorage.getItem("adminToken");
		if (!token) {
			setError("Session expired. Please log in again");
			setLoading(false);
			setIsAuthenticated(false);
			return;
		}
		const headers = { Authorization: `Bearer ${token}` };
		setLoading(true);
		setError(null);

		try {
			const { data } = await axios.get(
				"http://localhost:5000/api/admin/dashboard",
				{ headers }
			);

			// Log the data for debugging
			console.log(data);

			const { services, users } = data;

			setServices(services);
			setUsers(users);
			setServicesCount(services.length);
			setUsersCount(users.length);
			setEmployeesCount(
				users.filter((user) => user.role === "employee").length
			);
			setCustomersCount(
				users.filter((user) => user.role === "customer").length
			);
			setManagersCount(users.filter((user) => user.role === "manager").length);
		} catch (err) {
			if (err.response && err.response.status === 401) {
				// Handle unauthorized or token expired errors
				setIsAuthenticated(false);
				localStorage.removeItem("adminToken");
				navigate("/admin/login");
			} else {
				console.error("Dashboard fetch error:", err);
				setError(
					err.response?.data?.message || "Failed to load dashboard data."
				);
			}
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		const token = localStorage.getItem("adminToken");
		if (token) {
			fetchDashboardData();
		}
	}, []);

	// Generic Error Reset Function
	const resetError = () => setError(null);

	//login

	const login = async (email, password) => {
		setLoading(true);
		setError(null);

		try {
			// Send login request
			const response = await axios.post(
				"http://localhost:5000/api/admin/login",
				{
					email,
					password,
				}
			);
			const token = response.data.token;

			if (token) {
				// Debugging: Log received token
				console.log("Received Token:", token);

				// Validate and decode token
				try {
					const decodedToken = jwtDecode(token);
					console.log("Decoded Token:", decodedToken); // Check token structure

					// Save token and update state
					localStorage.setItem("adminToken", token);
					setIsAuthenticated(true);
					await fetchDashboardData();
					return true; // Successful login
				} catch (decodeError) {
					console.error("Error decoding token:", decodeError);
					throw new Error("Invalid token structure received.");
				}
			} else {
				throw new Error("Token not received from server.");
			}
		} catch (err) {
			console.error("Login error:", err.response?.data?.message || err.message);
			setError(
				err.response?.data?.message || "An error occurred during login."
			);
			return false; // Login failed
		} finally {
			setLoading(false);
		}
	};

	const logout = () => {
		localStorage.removeItem("adminToken"); // Clear the token
		setIsAuthenticated(false); // Update authentication state
	};

	// Create Service Handler
	const handleCreateService = async () => {
		resetError();
		const { name, description, price } = newService;

		if (!name || !description || !price) {
			setError("Please fill in all fields.");
			return;
		}

		try {
			const token = localStorage.getItem("adminToken");
			const { data } = await axios.post(
				"http://localhost:5000/api/admin/services",
				{ name, description, price },
				{ headers: { Authorization: `Bearer ${token}` } }
			);
			setServices([...services, data.service]);
			alert("Service created successfully.");
			setNewService({
				name: "",
				description: "",
				price: "",
			});
		} catch (err) {
			console.error("Service creation error:", err);
			setError(err.response?.data?.message || "Error creating service.");
		}
	};

	// Other functions follow the same error handling pattern
	const handleCreateManager = async () => {
		resetError();
		const { name, email, role, serviceId, username, password } = newManager;

		if (!name || !email || !role || !serviceId || !username || !password) {
			setError("Please provide all fields.");
			return;
		}

		try {
			const token = localStorage.getItem("adminToken");
			const data = await axios.post(
				"http://localhost:5000/api/admin/manager",
				{ name, email, role, serviceId, username, password },
				{ headers: { Authorization: `Bearer ${token}` } }
			);
			setUsers((prevUsers) => [...prevUsers, data.user]);

			alert("Manager created successfully.");
			setNewManager({
				name: "",
				email: "",
				role: "",
				serviceId: "",
				username: "",
				password: "",
			});
		} catch (err) {
			setError(err.response?.data?.message || "Error creating user.");
		}
	};

	const handleCreateEmployee = async () => {
		const { name, email, role, serviceId, username, password } = newEmployee;

		// Validate required fields
		if (!name || !email || !role || !serviceId || !username || !password) {
			setError("Please provide all fields.");
			return;
		}

		try {
			const token = localStorage.getItem("adminToken");

			// Send the request to the server to create a new employee
			const { data } = await axios.post(
				"http://localhost:5000/api/admin/employee",
				{ name, email, role, serviceId, username, password },
				{ headers: { Authorization: `Bearer ${token}` } }
			);

			// Add the newly created employee to the users state
			setUsers((prevUsers) => [...prevUsers, data.user]);

			alert("Employee created successfully.");

			// Reset the employee form
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
		// Validate required fields
		if (!newUser.name || !newUser.email || !newUser.role) {
			setError("Please provide all required fields.");
			return;
		}

		try {
			const token = localStorage.getItem("adminToken");

			// Send the request to create a new user
			const { data } = await axios.post(
				"http://localhost:5000/api/admin/createUser",
				newUser,
				{ headers: { Authorization: `Bearer ${token}` } }
			);

			// Dynamically add the newly created user to the `users` state
			setUsers((prevUsers) => [...prevUsers, data.user]);

			alert("User created successfully.");

			// Reset the form state for new user creation
			setNewUser({
				role: "",
				name: "",
				email: "",
				serviceId: "",
				username: "",
				password: "",
			});
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
	const employees = useMemo(() => {
		return users.filter((user) => user && user.role === "employee");
	}, [users]);
	const managers = useMemo(() => {
		return users.filter((user) => user && user.role === "manager");
	}, [users]);

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
				setServices,
				users,
				setUsers,
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
				resetError,
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
				//login
				isAuthenticated,
				login,
				logout,
				employees,
				managers,
			}}>
			{children}
		</AdminDashboardContext.Provider>
	);
};

export { AdminDashboardContext, AdminDashboardProvider };
