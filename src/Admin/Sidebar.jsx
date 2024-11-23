import React from "react";

const Sidebar = ({ activeSection, setActiveSection }) => {
	const sections = ["Dashboard", "Services","Managers", "Customers", "Employees"];

	return (
		<div className='sidebar'>
			<ul>
				{sections.map((section) => (
					<li
						key={section}
						className={activeSection === section ? "li-active" : ""}
						onClick={() => setActiveSection(section)}>
						{section}
					</li>
				))}
			</ul>
		</div>
	);
};
export default Sidebar;
