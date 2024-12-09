import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios"; // You can use axios for HTTP requests

const CustomerAuthContext = createContext();

export const CustomerAuthProvider = ({ children }) => {
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [user, setUser] = useState(null);

	// Check token on page refresh
	useEffect(() => {
		const token = localStorage.getItem("token");
		if (token) {
			setIsLoggedIn(true);
			const userDetails = JSON.parse(localStorage.getItem("user"));
			setUser(userDetails);
		}
	}, []);

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
				localStorage.setItem("user", JSON.stringify(user));
				setIsLoggedIn(true);
				setUser(user);
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
		localStorage.removeItem("user");
		setIsLoggedIn(false);
		setUser(null);
	};

	return (
		<CustomerAuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
			{children}
		</CustomerAuthContext.Provider>
	);
};

export const useCustomerAuth = () => useContext(CustomerAuthContext);
