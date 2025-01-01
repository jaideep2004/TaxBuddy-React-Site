// EmployeeDashboard.jsx
import React, { useState, useEffect } from "react";
import EmSidebar from "./EmSidebar";
import EmDash from "./EmDash";
import EmAssignedCustomers from "./EmAssignedCustomers";

const EmployeeDashboard = () => {
	const [activeSection, setActiveSection] = useState("Dashboard");
	return (
		<div className='employee-dashboard'>
			<EmSidebar
				activeSection={activeSection}
				setActiveSection={setActiveSection}
			/>

			<div className='tax-main-content'>
				{/* <CustomerTopbar /> */}
				<div className='content'>
					{activeSection === "Dashboard" && <EmDash />}
					{activeSection === "Customers" && <EmAssignedCustomers />}
				</div>
			</div>
		</div>
	);
};

export default EmployeeDashboard;
