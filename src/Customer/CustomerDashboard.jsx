import React from "react";
// import { useCustomerAuth } from "../CustomerAuthContext";
import { useCustomerAuth } from "./CustomerAuthContext";

const CustomerDashboard = () => {
	const { logout, user } = useCustomerAuth();

	return (
		<div>
			<h1>Welcome, {user?.email}!</h1>
			<button onClick={logout}>Logout</button>
		</div>
	);
};

export default CustomerDashboard;
