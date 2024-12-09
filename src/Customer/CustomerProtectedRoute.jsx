import React from "react";
import { Navigate } from "react-router-dom";
// import { useCustomerAuth } from "../CustomerAuthContext";
import { useCustomerAuth } from "./CustomerAuthContext";

const CustomerProtectedRoute = ({ element }) => {
	const { isLoggedIn } = useCustomerAuth(); // Implement a custom hook for auth state

	return isLoggedIn ? element : <Navigate to='/customers/login' replace />;
};

export default CustomerProtectedRoute;
