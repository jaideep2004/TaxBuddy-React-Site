import React, { useState, useEffect } from "react";
import { useCustomerAuth } from "./CustomerAuthContext";
import CustomerSidebar from "./CustomerSidebar";
import CustomerTopbar from "./CustomerTopbar";
import CDashSection from "./CDashSection";
import PaymentHistory from "./PaymentHistory";
import CProfileSection from "./CProfileSection";
import CSettings from "./CSettings";
import { Navigate, useParams } from "react-router-dom";
import CServiceStatus from "./CServiceStatus";
import CMessageCenter from "./CMessageCenter";
import CDocumentUpload from "./CDocumentUpload";

const CustomerDashboard = () => {
  const { isLoggedIn, error, loading, user, fetchCustomerDashboard } = useCustomerAuth();
  const [activeSection, setActiveSection] = useState("Dashboard");
  const { email } = useParams(); // Get email from the URL

  console.log("Email from URL params:", email);
  console.log("Is user logged in:", isLoggedIn);

  useEffect(() => {
    if (isLoggedIn) {
      fetchCustomerDashboard();
    }
  }, [isLoggedIn]);

  if (loading) return <div>Loading...</div>;
  if (!isLoggedIn) return <Navigate to='/customers/login' replace />;
  if (error) {
    return (
      <div className='error-message'>
        <p>{error}</p>
        <button onClick={() => <Navigate to='/customers/login' replace />}>Login Again</button>
      </div>
    );
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
          {activeSection === "Documents Upload" && <CDocumentUpload />}
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
