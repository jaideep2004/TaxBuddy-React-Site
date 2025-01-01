import React from "react";
import { EmployeeContext } from "./EmployeeContext";
import "./employee.css";
const EmSidebar = ({ activeSection, setActiveSection }) => {
	const sections = [
		"Dashboard",
		"Customers",
		"Service Status",

		"Profile",
		"Message Center",
		"Settings",
	];

	return (
		<div className='esidebar'>
			<ul>
				{sections.map((section) => (
					<li
						key={section}
						className={activeSection === section ? "li-active" : ""}
						onClick={() => setActiveSection(section)}>
						{section}
					</li>
				))}
				<button >Logout</button>
			</ul>
		</div>
	);
};

export default EmSidebar;
