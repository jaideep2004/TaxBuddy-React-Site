import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "../Admin/utils/axiosConfig";
import { jwtDecode } from "jwt-decode";

const CustomerAuthContext = createContext();

export const CustomerAuthProvider = ({ children }) => {
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const [services, setServices] = useState([]);
	const [serviceMap, setServiceMap] = useState({});
	const [employeeMap, setEmployeeMap] = useState({});
	const [error, setError] = useState(null);
	const [message, setMessage] = useState("");

	const [formData, setFormData] = useState({
		pan: "",
		gst: "",
		address: "",
		city: "",
		state: "",
		country: "",
		postalcode: "",
		natureEmployement: "",
		annualIncome: "",
		education: "",
		certifications: "",
		institute: "",
		completiondate: "",
	});

	const [isEditing, setIsEditing] = useState(
		Object.keys(formData).reduce((acc, key) => ({ ...acc, [key]: false }), {})
	);

	// Upload documents

	const uploadDocuments = async (serviceName, files) => {
		const token = localStorage.getItem("customerToken");

		// Find the service object from the services array that matches the serviceName
		const service = services.find((s) => s.serviceName === serviceName);

		if (!service) {
			console.error("Service not found for the provided service name.");
			throw new Error("Service not found");
		}

		const formData = new FormData();
		formData.append("serviceId", service.serviceId);

		Array.from(files).forEach((file) => {
			formData.append("documents", file);
		});

		try {
			const { data } = await axios.post(
				"http://localhost:5000/api/customers/upload-documents",
				formData,
				{
					headers: {
						Authorization: `Bearer ${token}`,
						"Content-Type": "multipart/form-data",
					},
				}
			);

			// Refresh dashboard data after successful upload
			await fetchCustomerDashboard();
			return data;
		} catch (error) {
			console.error(
				"Upload failed:",
				error.response ? error.response.data.message : error.message
			);
			throw error;
		}
	};

	useEffect(() => {
		const validateTokenAndFetchData = async () => {
			const token = localStorage.getItem("customerToken");
			setLoading(true);

			if (!token) {
				setIsLoggedIn(false);
				setLoading(false);
				return;
			}

			try {
				const decodedToken = jwtDecode(token);
				const isTokenValid = decodedToken.exp * 1000 > Date.now();

				if (!isTokenValid) {
					throw new Error("Token expired");
				}

				setIsLoggedIn(true);
				await fetchCustomerDashboard();
			} catch (err) {
				console.error("Token validation failed:", err.message);
				setIsLoggedIn(false);
				setError("Session expired. Please log in again.");
				localStorage.removeItem("customerToken");
			} finally {
				setLoading(false);
			}
		};

		validateTokenAndFetchData();
	}, []);

	const fetchCustomerDashboard = async () => {
		const token = localStorage.getItem("customerToken");

		if (!token) {
			setError("Session expired. Please log in again.");
			logout();
			return;
		}

		try {
			setLoading(true);
			const { data } = await axios.get(
				"http://localhost:5000/api/customers/cdashboard",
				{ headers: { Authorization: `Bearer ${token}` } }
			);

			setUser(data.user);

			// Add the formatted services mapping
			const formattedServices = data.user.services.map((service) => ({
				serviceId: service.serviceId,
				serviceName: service.serviceName || service.name,
				serviceDescription: service.description || "N/A", // Include description
				purchasedAt: service.purchasedAt || null, // Include purchasedAt
				status: service.status || "N/A",
				activationStatus: service.activated ? "Active" : "Inactive", // Include activation status
				managedBy: service.managedBy || "Not Assigned", // Include managedBy
				documents: service.documents || [],
			}));

			setServices(formattedServices);
			setFormData((prev) => ({
				...prev,
				pan: data.user.pan || "",
				// Update other fields similarly
			}));

			await fetchServiceAndEmployeeMaps(token);
		} catch (error) {
			handleErrorResponse(error, "Failed to load dashboard data");
		} finally {
			setLoading(false);
		}
	};

	const fetchServiceAndEmployeeMaps = async (token) => {
		try {
			const serviceResponse = await axios.get(
				"http://localhost:5000/api/customers/user-services",
				{ headers: { Authorization: `Bearer ${token}` } }
			);

			const services = serviceResponse.data.services || [];
			console.log("Fetched services:", services); // Add this line to debug

			const serviceData = services.reduce((map, service) => {
				map[service.serviceId] = service.name;
				return map;
			}, {});
			console.log("Service Map:", serviceData); // Debug the serviceMap

			setServiceMap(serviceData);
		} catch (error) {
			console.error("Error fetching service or employee mappings:", error);
		}
	};

	const login = async (email, password) => {
		setLoading(true);
		setError(null);

		try {
			const { data } = await axios.post(
				"http://localhost:5000/api/customers/user-login",
				{ email, password }
			);

			const { token, user } = data;
			if (!token) throw new Error("Token not received from server.");

			localStorage.setItem("customerToken", token);
			setIsLoggedIn(true);
			setUser(user);
			setServices(user.services || []);
			await fetchCustomerDashboard();
			return { success: true };
		} catch (err) {
			handleErrorResponse(err, "Login failed");
			return { success: false, message: err.message };
		} finally {
			setLoading(false);
		}
	};

	const logout = () => {
		localStorage.removeItem("customerToken");
		setIsLoggedIn(false);
	};

	const handleErrorResponse = (error, defaultMessage) => {
		if (error.response?.status === 401) {
			logout();
			setError("Unauthorized access. Please log in again.");
		} else {
			setError(error.response?.data?.message || defaultMessage);
		}
	};

	const getAllServicesForCDash = async () => {
		const token = localStorage.getItem("customerToken");

		try {
			const { data } = await axios.get(
				"http://localhost:5000/api/customers/user-services",
				{ headers: { Authorization: `Bearer ${token}` } }
			);
			return data.services || [];
		} catch (error) {
			handleErrorResponse(error, "Failed to fetch services");
			return [];
		}
	};

	return (
		<CustomerAuthContext.Provider
			value={{
				uploadDocuments,
				message,
				isLoggedIn,
				user,
				loading,
				services,
				serviceMap,
				employeeMap,
				formData,
				isEditing,
				login,
				logout,
				fetchCustomerDashboard,
				getAllServicesForCDash,
				setFormData,
				handleInputChange: (e) =>
					setFormData({ ...formData, [e.target.name]: e.target.value }),
				handleEditClick: (field) =>
					setIsEditing((prev) => ({ ...prev, [field]: true })),
				handleSaveProfile: async () => {
					const token = localStorage.getItem("customerToken");

					if (!token) {
						alert("Session expired. Please log in again.");
						logout();
						return;
					}

					try {
						const { data } = await axios.put(
							"http://localhost:5000/api/customers/update-profile",
							formData,
							{ headers: { Authorization: `Bearer ${token}` } }
						);

						setUser(data.user);
						await fetchCustomerDashboard();
						setIsEditing(
							Object.keys(isEditing).reduce(
								(acc, key) => ({ ...acc, [key]: false }),
								{}
							)
						);
						alert("Profile updated successfully!");
					} catch (err) {
						handleErrorResponse(
							err,
							"An error occurred while updating the profile."
						);
					}
				},
			}}>
			{children}
		</CustomerAuthContext.Provider>
	);
};

export const useCustomerAuth = () => useContext(CustomerAuthContext);
