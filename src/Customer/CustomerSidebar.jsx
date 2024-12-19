import React from "react";
import { useCustomerAuth } from "./CustomerAuthContext";
import "./customer.css";
const Sidebar = ({ activeSection, setActiveSection }) => {
	const sections = [
		"Dashboard",
		"Service Status",
		"Payment History",
		"Profile",
		"Message Center",
		"Settings",
	];
	const { user, logout } = useCustomerAuth();
	return (
		<div className='csidebar'>
			<ul>
				{sections.map((section) => (
					<li
						key={section}
						className={activeSection === section ? "li-active" : ""}
						onClick={() => setActiveSection(section)}>
						{section}
					</li>
				))}
				<button onClick={logout}>Logout</button>
			</ul>
		</div>
	);
};

export default Sidebar;
