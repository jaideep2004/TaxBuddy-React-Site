import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const CustomerAuthContext = createContext();

export const CustomerAuthProvider = ({ children }) => {
	// const [isLoggedIn, setIsLoggedIn] = useState(
	// 	!!localStorage.getItem("customerToken")
	// );
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const [services, setServices] = useState([]); // Unified state for user-specific and all services
	const [serviceMap, setServiceMap] = useState({});
	const [employeeMap, setEmployeeMap] = useState({});
	const [error, setError] = useState(null);

	useEffect(() => {
		const token = localStorage.getItem("customerToken");

		if (token) {
			try {
				const decodedToken = jwtDecode(token);
				// Check if the token has expired
				if (decodedToken.exp < Date.now() / 1000) {
					logout(); // Token expired, log out
					setError("Session expired. Please log in again.");
					console.error("Session expired. Please log in again.");
				} else {
					setIsLoggedIn(true);
					fetchCustomerDashboard(); // Fetch data if the token is valid
				}
			} catch (error) {
				console.error("Error decoding token:", error); // Log any decoding errors
				// logout();
				setError("Invalid token structure. Please log in again.");
			}
		} else {
			setIsLoggedIn(false); // No token, set as logged out
			console.log("No token found, user is logged out.");
		}
	}, []);

	const fetchCustomerDashboard = async () => {
		const token = localStorage.getItem("customerToken");

		if (!token) {
			setError("Session expired. Please log in again.");
			console.error("No token found. Session expired.");
			logout();
			setLoading(false);
			return;
		}

		try {
			setLoading(true);
			const { data } = await axios.get(
				"http://localhost:5000/api/customers/cdashboard",
				{ headers: { Authorization: `Bearer ${token}` } }
			);
			setUser(data.user);
			setServices(data.user.services || []);
			await fetchServiceAndEmployeeMaps(token);
		} catch (error) {
			console.error("Error fetching customer dashboard:", error); // Log API call errors
			setError(
				error.response?.data?.message || "Failed to load dashboard data."
			);
			if (error.response?.status === 401) logout(); // Handle unauthorized errors
		} finally {
			setLoading(false);
		}
	};

	const fetchAllServices = async (token) => {
		try {
			const response = await axios.get(
				"http://localhost:5000/api/customers/user-services",
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);
			return response.data.services || [];
		} catch (error) {
			console.error("Error fetching all services:", error); // Log errors during service fetching
			return [];
		}
	};

	const fetchServiceAndEmployeeMaps = async (token) => {
		try {
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

			const employeeResponse = await axios.get(
				"http://localhost:5000/api/admin/users",
				{ headers: { Authorization: `Bearer ${token}` } }
			);

			const employeeData = Array.isArray(employeeResponse.data.users)
				? employeeResponse.data.users
						.filter((user) => user.role === "employee")
						.reduce((map, employee) => {
							map[employee._id] = {
								name: employee.name,
								email: employee.email,
							};
							return map;
						}, {})
				: {}; // Empty map if not an array

			setEmployeeMap(employeeData);
		} catch (error) {
			console.error("Error fetching service or employee data:", error); // Log errors during service or employee fetching
		}
	};

	const login = async (email, password) => {
		setLoading(true);
		setError(null);

		try {
			const response = await axios.post(
				"http://localhost:5000/api/customers/user-login",
				{ email, password }
			);

			const token = response.data.token;
			const user = response.data.user;

			if (token) {
				console.log("Received Token:", token); // Log token on successful login

				try {
					const decodedToken = jwtDecode(token);
					console.log("Decoded Token:", decodedToken);
					if (decodedToken.exp < Date.now() / 1000) {
						logout();
						setError("Session expired. Please log in again.");
						console.error("Token expired.");
					}

					localStorage.setItem("customerToken", token); // Save token
					setIsLoggedIn(true);
					setUser(user);
					setServices(user?.services || []); // Handle services

					await fetchServiceAndEmployeeMaps(token);

					return { success: true }; // Successful login
				} catch (decodeError) {
					console.error("Error decoding token:", decodeError); // Log token decoding errors
					throw new Error("Invalid token structure received.");
				}
			} else {
				throw new Error("Token not received from server.");
			}
		} catch (err) {
			console.error("Login error:", err.response?.data?.message || err.message); // Log login errors
			setError(
				err.response?.data?.message || "An error occurred during login."
			);
			return {
				success: false,
				message: err.response?.data?.message || "Login failed",
			};
		} finally {
			setLoading(false);
		}
	};

	const logout = () => {
		localStorage.removeItem("customerToken");
		setIsLoggedIn(false);
		setUser(null);
		setServices([]);
		setServiceMap({});
		setEmployeeMap({});
		console.log("Logged out.");
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
				getAllServicesForCDash: fetchAllServices, // Expose fetchAllServices function
			}}>
			{children}
		</CustomerAuthContext.Provider>
	);
};

export const useCustomerAuth = () => useContext(CustomerAuthContext);
