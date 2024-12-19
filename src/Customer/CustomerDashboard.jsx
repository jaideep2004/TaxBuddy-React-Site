import React from "react";
import { useCustomerAuth } from "./CustomerAuthContext";
import CustomerSidebar from "./CustomerSidebar";
import CustomerTopbar from "./CustomerTopbar";
import { useState } from "react";
import CDashSection from "./CDashSection";
import PaymentHistory from "./PaymentHistory";
import CProfileSection from "./CProfileSection";
import CSettings from "./CSettings";
import { Navigate, useParams } from "react-router-dom"; // Import useParams
import CServiceStatus from "./CServiceStatus";
import CMessageCenter from "./CMessageCenter";

const CustomerDashboard = () => {
	const { logout, user } = useCustomerAuth();
	const { isLoggedIn, loading, error } = useCustomerAuth();
	const [activeSection, setActiveSection] = useState("Dashboard");
	const { email } = useParams(); // Get email from the URL

	if (loading) {
		return <p>Loading...</p>;
	}

	if (!isLoggedIn) {
		return <Navigate to='customers/login' replace />;
	}

	if (error) {
		return <p style={{ color: "red" }}>{error}</p>;
	}
	return (
		<div className='customer-dashboard'>
			<CustomerSidebar
				activeSection={activeSection}
				setActiveSection={setActiveSection}
			/>
			<div className='tax-main-content'>
				<CustomerTopbar />
				<div className='content'>
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
