import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const CustomerAuthContext = createContext();

export const CustomerAuthProvider = ({ children }) => {
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const [services, setServices] = useState([]); // Unified state for user-specific and all services
	const [serviceMap, setServiceMap] = useState({});
	const [employeeMap, setEmployeeMap] = useState({});

	useEffect(() => {
		const token = localStorage.getItem("token");
		if (token) {
			(async () => {
				try {
					await fetchCustomerDashboard(token); // Fetch dashboard data if token is present
				} catch (error) {
					console.error("Token validation failed", error);
					localStorage.removeItem("token");
					setIsLoggedIn(false);
					setUser(null);
				}
			})();
		} else {
			setIsLoggedIn(false); // Ensure logged-out state without redirecting
		}
		setLoading(false); // Stop loading whether token exists or not
	}, []);

	const fetchCustomerDashboard = async (token) => {
		try {
			setLoading(true); // Start loading
			const response = await axios.get(
				"http://localhost:5000/api/customers/dashboard",
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);

			const userData = response.data.user;
			setUser(userData);
			setServices(userData.services || []);
			await fetchServiceAndEmployeeMaps(token); // Fetch additional mappings
		} catch (error) {
			console.error("Error fetching dashboard data:", error);
			localStorage.removeItem("token"); // Clear invalid token
			setIsLoggedIn(false);
			setUser(null);
			// Optional: You can redirect here if necessary.
		} finally {
			setLoading(false); // Stop loading
		}
	};

	const fetchAllServices = async (token) => {
		try {
			const response = await axios.get(
				"http://localhost:5000/api/customers/user-services",
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			return response.data.services || [];
		} catch (error) {
			console.error("Error fetching all services:", error);
			return [];
		}
	};

	const fetchServiceAndEmployeeMaps = async (token) => {
		try {
			// Fetch all services for service map
			const serviceResponse = await axios.get(
				"http://localhost:5000/api/customers/user-services"
			);
			const serviceData = serviceResponse.data.services.reduce(
				(map, service) => {
					map[service._id] = service.name;
					return map;
				},
				{}
			);
			setServiceMap(serviceData);

			// Fetch all users (Protected endpoint, requires token)
			const employeeResponse = await axios.get(
				"http://localhost:5000/api/admin/users",
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);

			// Filter for users with the role of "employee"
			const employeeData = employeeResponse.data
				.filter((user) => user.role === "employee")
				.reduce((map, employee) => {
					map[user._id] = { name: employee.name, email: employee.email };
					return map;
				}, {});

			setEmployeeMap(employeeData);
		} catch (error) {
			console.error("Error fetching service or employee data:", error);
		}
	};

	const getAllServicesForCDash = async () => {
		const token = localStorage.getItem("token");
		if (token) {
			return await fetchAllServices(token); // Returns all available services
		}
		return [];
	};

	const login = async (email, password) => {
		try {
			const response = await axios.post(
				"http://localhost:5000/api/customers/user-login",
				{
					email,
					password,
				}
			);

			if (response.status === 200) {
				const { token, user } = response.data;
				localStorage.setItem("token", token);
				setIsLoggedIn(true);
				setUser(user);
				setServices(user.services || []); // Set services during login
				await fetchServiceAndEmployeeMaps(token); // Ensure mappings are populated
				return { success: true };
			} else {
				console.error("Unexpected response status: ", response.status);
				return { success: false, message: "Unexpected error" };
			}
		} catch (error) {
			console.error("Error during login", error);
			return {
				success: false,
				message: error.response?.data?.message || "Login failed",
			};
		}
	};

	const logout = () => {
		localStorage.removeItem("token");
		setIsLoggedIn(false);
		setUser(null);
		setServices([]);
	};

	return (
		<CustomerAuthContext.Provider
			value={{
				isLoggedIn,
				user,
				services,
				serviceMap,
				employeeMap,
				loading,
				login,
				logout,
				getAllServicesForCDash, // Expose this function for CDash
			}}>
			{children}
		</CustomerAuthContext.Provider>
	);
};

export const useCustomerAuth = () => useContext(CustomerAuthContext);
