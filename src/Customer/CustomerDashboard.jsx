// import React from "react";
// import { useCustomerAuth } from "./CustomerAuthContext";
// import CustomerSidebar from "./CustomerSidebar";
// import CustomerTopbar from "./CustomerTopbar";
// import { useState } from "react";
// import CDashSection from "./CDashSection";
// import PaymentHistory from "./PaymentHistory";
// import CProfileSection from "./CProfileSection";
// import CSettings from "./CSettings";
// import { Navigate, useParams } from "react-router-dom"; // Import useParams
// import CServiceStatus from "./CServiceStatus";
// import CMessageCenter from "./CMessageCenter";
// import { jwtDecode } from "jwt-decode";

// const CustomerDashboard = () => {
// 	// const { logout, user } = useCustomerAuth();
// 	const { isLoggedIn, error } = useCustomerAuth();
// 	const [activeSection, setActiveSection] = useState("Dashboard");
// 	const { email } = useParams(); // Get email from the URL

// 	// if (loading) {
// 	// 	return <p>Loading...</p>;
// 	// }

// 	if (!isLoggedIn) {
// 		return <Navigate to='customers/login' replace />;
// 	}

// 	if (error) {
// 		return <p style={{ color: "red" }}>{error}</p>;
// 	}
// 	const token = localStorage.getItem("token");
// 	const user = token ? jwtDecode(token) : null;
// 	return (
// 		<div className='customer-dashboard'>
// 			<CustomerSidebar
// 				activeSection={activeSection}
// 				setActiveSection={setActiveSection}
// 			/>
// 			<div className='tax-main-content'>
// 				<CustomerTopbar />
// 				<div className='content'>
// 					{activeSection === "Dashboard" && <CDashSection />}
// 					{activeSection === "Service Status" && <CServiceStatus />}
// 					{activeSection === "Payment History" && <PaymentHistory />}
// 					{activeSection === "Profile" && <CProfileSection />}
// 					{activeSection === "Message Center" && <CMessageCenter />}

// 					{activeSection === "Settings" && <CSettings />}
// 				</div>
// 			</div>
// 		</div>
// 	);
// };

// export default CustomerDashboard;

import React, { useState, useEffect } from "react";
import { useCustomerAuth } from "./CustomerAuthContext";
import CustomerSidebar from "./CustomerSidebar";
import CustomerTopbar from "./CustomerTopbar";
import CDashSection from "./CDashSection";
import PaymentHistory from "./PaymentHistory";
import CProfileSection from "./CProfileSection";
import CSettings from "./CSettings";
import { Navigate, useParams } from "react-router-dom"; // Import useParams
import CServiceStatus from "./CServiceStatus";
import CMessageCenter from "./CMessageCenter";
import { jwtDecode } from "jwt-decode";

const CustomerDashboard = () => {
	// const { logout, user } = useCustomerAuth();
	const { isLoggedIn, error } = useCustomerAuth();
	const [activeSection, setActiveSection] = useState("Dashboard");
	const { email } = useParams(); // Get email from the URL

	// Add console logs to debug
	console.log("Email from URL params:", email);  // Log the email from URL params
	console.log("Is user logged in:", isLoggedIn); // Log the login state

	const token = localStorage.getItem("customerToken");
	console.log("Token from localStorage:", token);  // Log the token from localStorage

	const user = token ? jwtDecode(token) : null;
	console.log("Decoded user info:", user);  // Log the decoded user information from token

	// Optionally, check if the email from URL matches the user email
	useEffect(() => {
		if (user && user.email !== email) {
			console.log("Email mismatch: User email", user.email, "URL email", email);
		}
	}, [user, email]);

	// Check if user is logged in, if not redirect to login
	if (!isLoggedIn) {
		console.log("User not logged in, redirecting to login page");
		return <Navigate to="/customers/login" replace />;
	}

	// Display error message if any
	if (error) {
		console.log("Error found:", error);
		return <p style={{ color: "red" }}>{error}</p>;
	}

	return (
		<div className="customer-dashboard">
			<CustomerSidebar
				activeSection={activeSection}
				setActiveSection={setActiveSection}
			/>
			<div className="tax-main-content">
				<CustomerTopbar />
				<div className="content">
					{activeSection === "Dashboard" && <CDashSection />}
					{activeSection === "Service Status" && <CServiceStatus />}
					{activeSection === "Payment History" && <PaymentHistory />}
					{activeSection === "Profile" && <CProfileSection />}
					{activeSection === "Message Center" && <CMessageCenter />}
					{activeSection === "Settings" && <CSettings />}
				</div>
			</div>
		</div>
	);
};

export default CustomerDashboard;

