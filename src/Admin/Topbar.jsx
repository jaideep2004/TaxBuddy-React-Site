import React from "react";
import { AdminDashboardContext } from "./AdminDashboardContext";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
const Topbar = () => {
	const { logout, isAuthenticated } = useContext(AdminDashboardContext);
	const navigate = useNavigate();
	const handleLogout = () => {
		logout(); // Clear authentication state
		navigate("/admin/login"); // Redirect to login page
	};

	return (
		<div className='topbar'>
			{isAuthenticated && (
				<button onClick={handleLogout} className='logout-button'>
					Logout
				</button>
			)}
		</div>
	);
};

export default Topbar;
