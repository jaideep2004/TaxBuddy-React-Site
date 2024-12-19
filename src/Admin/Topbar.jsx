import React from "react";
import { AdminDashboardContext } from "./AdminDashboardContext";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";

const Topbar = ({ activeSection }) => {
	const { logout, isAuthenticated } = useContext(AdminDashboardContext);
	const navigate = useNavigate();

	const handleLogout = () => {
		logout(); // Clear authentication state
		navigate("/admin/login"); // Redirect to login page
	};

	// Dynamically change the title based on activeSection
	const getTitle = () => {
		switch (activeSection) {
			case "Dashboard":
				return "Admin Dashboard";
			case "Services":
				return "Manage Services";
			case "Managers":
				return "Manage Managers";
			case "Customers":
				return "Manage Customers";
			case "Employees":
				return "Manage Employees";
			case "Message Center":
				return "Message Center";

			default:
				return "Admin Dashboard";
		}
	};

	return (
		<div className='topbar'>
			<div>
				<h1>{getTitle()}</h1>
			</div>
			<div>
				{/* {isAuthenticated && (
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        )} */}
				<i class='fa-solid fa-user fa-xl'></i>
			</div>
		</div>
	);
};

export default Topbar;
