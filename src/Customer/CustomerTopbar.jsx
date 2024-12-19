import React from "react";
import { useCustomerAuth } from "./CustomerAuthContext";

const CustomerTopbar = () => {
	const { user, logout } = useCustomerAuth();
	return (
		<div className='topbar'>
			<div className='topbar-left'>
				<h1>Customer Dashboard</h1>
			</div>
			<div className='topbar-right'></div>
		</div>
	);
};

export default CustomerTopbar;
