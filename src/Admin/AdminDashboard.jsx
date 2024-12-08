// import React, { useState, useEffect, useContext } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "./utils/axiosConfig";
// import Sidebar from "./Sidebar";
// import Topbar from "./Topbar";
// import DashboardSection from "./DashboardSection";
// import ServicesSection from "./ServicesSection";
// import EmployeesSection from "./EmployeesSection";
// import UsersSection from "./UsersSection";
// import ManagersSection from "./ManagersSection";
// import "./admin.css";
// import { Navigate } from "react-router-dom";
// import { AdminDashboardContext } from "./AdminDashboardContext";

// const AdminDashboard = () => {
// 	const {
// 		servicesCount,
// 		usersCount,
// 		employeesCount,
// 		customersCount,
// 		loading,
// 		error,
// 		services,
// 		users,
// 		newService,
// 		setNewService,
// 		newEmployee,
// 		setNewEmployee,
// 		newManager,
// 		setNewManager,
// 		newUser,
// 		setNewUser,
// 		fetchDashboardData,
// 		handleCreateService,
// 		handleCreateManager,
// 		handleActivateUser,
// 		handleDeactivateUser,
// 		handleCreateUser,
// 		handleDeleteUser,
// 		assignCustomer,
// 		setAssignCustomer,
// 		handleCreateEmployee,
// 		handleAssignCustomer,
// 		handleUpdateService,
// 		handleDeleteService,
// 	} = useContext(AdminDashboardContext);
// 	const [activeSection, setActiveSection] = useState("Dashboard");

// 	const [showServiceForm, setShowServiceForm] = useState(false);
// 	const [showEmployeeForm, setShowEmployeeForm] = useState(false);
// 	const [showManagerForm, setShowManagerForm] = useState(false);
// 	const [showUserForm, setShowUserForm] = useState(false);
// 	const [showAssignCustomerForm, setShowAssignCustomerForm] = useState(false);
// 	const [showAssignEmployeeForm, setShowAssignEmployeeForm] = useState(false);
// 	const [isLoggedOut, setIsLoggedOut] = useState(false);

// 	const navigate = useNavigate();

// 	const handleLogout = () => {
// 		localStorage.removeItem("adminToken");
// 		setIsLoggedOut(true);
// 	};

// 	if (isLoggedOut || !localStorage.getItem("adminToken")) {
// 		return <Navigate to='/admin/login' replace />;
// 	}

// 	const handleBackToDashboard = () => {
// 		navigate("/dashboard"); // Navigate back to the dashboard
// 	};

// 	if (error) {
// 		// Only show 'Login Again' when the error is due to token expiration
// 		if (error === "Failed to load dashboard data.") {
// 			return (
// 				<div>
// 					<p style={{ color: "red" }}>{error}</p>
// 					<button
// 						style={{
// 							padding: "10px 15px",
// 							backgroundColor: "#007bff",
// 							color: "#fff",
// 							border: "none",
// 							borderRadius: "5px",
// 							cursor: "pointer",
// 						}}
// 						onClick={() => setIsLoggedOut(true)}>
// 						Login Again
// 					</button>
// 				</div>
// 			);
// 		} else {
// 			// For other errors, just show the error message without "Login Again"
// 			return (
// 				<div>
// 					<p style={{ color: "red" }}>{error}</p>
// 					<button
// 						style={{
// 							padding: "10px 15px",
// 							backgroundColor: "#f0ad4e",
// 							color: "#fff",
// 							border: "none",
// 							borderRadius: "5px",
// 							cursor: "pointer",
// 						}}
// 						onClick={handleBackToDashboard}>
// 						Back to Dashboard
// 					</button>
// 				</div>
// 			);
// 		}
// 	}

// 	if (loading) {
// 		return <p>Loading...</p>;
// 	}

// 	return (
// 		<div className='admin-dashboard'>
// 			<Sidebar
// 				activeSection={activeSection}
// 				setActiveSection={setActiveSection}
// 			/>
// 			<div className='tax-main-content'>
// 				<Topbar handleLogout={handleLogout} />
// 				<div className='content'>
// 					{activeSection === "Dashboard" && (
// 						<DashboardSection
// 							servicesCount={servicesCount}
// 							usersCount={usersCount}
// 							employeesCount={employeesCount}
// 							customersCount={customersCount}
// 							services={services}
// 							newService={newService}
// 							setNewService={setNewService}
// 							showServiceForm={showServiceForm}
// 							setShowServiceForm={setShowServiceForm}
// 							handleCreateService={handleCreateService}
// 							users={users}
// 							newUser={newUser}
// 							setNewUser={setNewUser}
// 							showUserForm={showUserForm}
// 							setShowUserForm={setShowUserForm}
// 							handleCreateUser={handleCreateUser}
// 							handleActivateUser={handleActivateUser}
// 							handleDeactivateUser={handleDeactivateUser}
// 							handleDeleteUser={handleDeleteUser}
// 							newEmployee={newEmployee}
// 							setNewEmployee={setNewEmployee}
// 							showEmployeeForm={showEmployeeForm}
// 							setShowEmployeeForm={setShowEmployeeForm}
// 							showAssignCustomerForm={showAssignCustomerForm}
// 							setShowAssignCustomerForm={setShowAssignCustomerForm}
// 							handleCreateEmployee={handleCreateEmployee}
// 						/>
// 					)}
// 					{activeSection === "Services" && (
// 						<ServicesSection
// 							services={services}
// 							newService={newService}
// 							setNewService={setNewService}
// 							showServiceForm={showServiceForm}
// 							setShowServiceForm={setShowServiceForm}
// 							handleCreateService={handleCreateService}
// 							handleUpdateService={handleUpdateService}
// 							handleDeleteService={handleDeleteService}
// 						/>
// 					)}
// 					{activeSection === "Managers" && (
// 						<ManagersSection
// 							newUser={newUser}
// 							setNewUser={setNewUser}
// 							users={users}
// 							services={services}
// 							newManager={newManager}
// 							setNewManager={setNewManager}
// 							showManagerForm={showManagerForm}
// 							setShowManagerForm={setShowManagerForm}
// 							showAssignEmployeeForm={showAssignEmployeeForm}
// 							setShowAssignEmployeeForm={setShowAssignEmployeeForm}
// 							handleCreateManager={handleCreateManager}
// 							handleActivateUser={handleActivateUser}
// 							handleDeactivateUser={handleDeactivateUser}
// 							handleDeleteUser={handleDeleteUser}
// 						/>
// 					)}
// 					{activeSection === "Employees" && (
// 						<EmployeesSection
// 							newUser={newUser}
// 							setNewUser={setNewUser}
// 							users={users}
// 							services={services}
// 							newEmployee={newEmployee}
// 							setNewEmployee={setNewEmployee}
// 							showEmployeeForm={showEmployeeForm}
// 							setShowEmployeeForm={setShowEmployeeForm}
// 							showAssignCustomerForm={showAssignCustomerForm}
// 							setShowAssignCustomerForm={setShowAssignCustomerForm}
// 							handleCreateEmployee={handleCreateEmployee}
// 							handleActivateUser={handleActivateUser}
// 							handleDeactivateUser={handleDeactivateUser}
// 							handleDeleteUser={handleDeleteUser}
// 						/>
// 					)}
// 					{activeSection === "Customers" && (
// 						<UsersSection
// 							users={users}
// 							services={services}
// 							newUser={newUser}
// 							setNewUser={setNewUser}
// 							showUserForm={showUserForm}
// 							setShowUserForm={setShowUserForm}
// 							handleCreateUser={handleCreateUser}
// 							handleActivateUser={handleActivateUser}
// 							handleDeactivateUser={handleDeactivateUser}
// 							handleDeleteUser={handleDeleteUser}
// 						/>
// 					)}
// 				</div>
// 			</div>
// 		</div>
// 	);
// };

// export default AdminDashboard;


import React, { useState, useContext } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import DashboardSection from "./DashboardSection";
import ServicesSection from "./ServicesSection";
import EmployeesSection from "./EmployeesSection";
import UsersSection from "./UsersSection";
import ManagersSection from "./ManagersSection";
import "./admin.css";
import { AdminDashboardContext } from "./AdminDashboardContext";

const AdminDashboard = () => {
  const {
    servicesCount,
    usersCount,
    employeesCount,
    managersCount,
    customersCount,
    loading,
    error,
    services,
    users,
    newService,
    setNewService,
    newEmployee,
    setNewEmployee,
    newManager,
    setNewManager,
    newUser,
    setNewUser,
    assignCustomer,
    setAssignCustomer,
    handleCreateService,
    handleCreateManager,
    handleCreateEmployee,
    handleCreateUser,
    handleActivateUser,
    handleDeactivateUser,
    handleDeleteUser,
    handleAssignCustomer,
    handleUpdateService,
    handleDeleteService,
  } = useContext(AdminDashboardContext);

  const [activeSection, setActiveSection] = useState("Dashboard");
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [showEmployeeForm, setShowEmployeeForm] = useState(false);
  const [showManagerForm, setShowManagerForm] = useState(false);
  const [showUserForm, setShowUserForm] = useState(false);
  const [showAssignCustomerForm, setShowAssignCustomerForm] = useState(false);
  const [isLoggedOut, setIsLoggedOut] = useState(false);
  
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    setIsLoggedOut(true);
  };

  if (isLoggedOut || !localStorage.getItem("adminToken")) {
    return <Navigate to="/admin/login" replace />;
  }

  if (error) {
    return (
      <div>
        <p style={{ color: "red" }}>{error}</p>
        <button
          style={{
            padding: "10px 15px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
          onClick={handleLogout}
        >
          Login Again
        </button>
      </div>
    );
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="admin-dashboard">
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      <div className="tax-main-content">
        <Topbar handleLogout={handleLogout} />
        <div className="content">
          {activeSection === "Dashboard" && (
            <DashboardSection
              servicesCount={servicesCount}
              usersCount={usersCount}
              employeesCount={employeesCount}
              managersCount={managersCount}
              customersCount={customersCount}
              showServiceForm={showServiceForm}
              setShowServiceForm={setShowServiceForm}
              handleCreateService={handleCreateService}
              showEmployeeForm={showEmployeeForm}
              setShowEmployeeForm={setShowEmployeeForm}
              showUserForm={showUserForm}
              setShowUserForm={setShowUserForm}
              handleCreateUser={handleCreateUser}
              handleActivateUser={handleActivateUser}
              handleDeactivateUser={handleDeactivateUser}
              handleDeleteUser={handleDeleteUser}
              services={services}
              users={users}
            />
          )}
          {activeSection === "Services" && (
            <ServicesSection
              services={services}
              newService={newService}
              setNewService={setNewService}
              showServiceForm={showServiceForm}
              setShowServiceForm={setShowServiceForm}
              handleCreateService={handleCreateService}
              handleUpdateService={handleUpdateService}
              handleDeleteService={handleDeleteService}
            />
          )}
          {activeSection === "Managers" && (
            <ManagersSection
              services={services}
              users={users}
              newManager={newManager}
              setNewManager={setNewManager}
              showManagerForm={showManagerForm}
              setShowManagerForm={setShowManagerForm}
              handleCreateManager={handleCreateManager}
              handleActivateUser={handleActivateUser}
              handleDeactivateUser={handleDeactivateUser}
              handleDeleteUser={handleDeleteUser}
            />
          )}
         {activeSection === "Employees" && (
						<EmployeesSection
							newUser={newUser}
							setNewUser={setNewUser}
							users={users}
							services={services}
							newEmployee={newEmployee}
							setNewEmployee={setNewEmployee}
							showEmployeeForm={showEmployeeForm}
							setShowEmployeeForm={setShowEmployeeForm}
							showAssignCustomerForm={showAssignCustomerForm}
							setShowAssignCustomerForm={setShowAssignCustomerForm}
							handleCreateEmployee={handleCreateEmployee}
							handleActivateUser={handleActivateUser}
							handleDeactivateUser={handleDeactivateUser}
							handleDeleteUser={handleDeleteUser}
						/>
					)}
					{activeSection === "Customers" && (
						<UsersSection
							users={users}
							services={services}
							newUser={newUser}
							setNewUser={setNewUser}
							showUserForm={showUserForm}
							setShowUserForm={setShowUserForm}
							handleCreateUser={handleCreateUser}
							handleActivateUser={handleActivateUser}
							handleDeactivateUser={handleDeactivateUser}
							handleDeleteUser={handleDeleteUser}
						/>
					)}
				</div>
			</div>
		</div>
	);
};

export default AdminDashboard;

