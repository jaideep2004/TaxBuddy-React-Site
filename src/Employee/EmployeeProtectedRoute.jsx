// EmployeeProtectedRoute.jsx
import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { EmployeeContext } from "./EmployeeContext";

const EmployeeProtectedRoute = ({ element }) => {
  const { isAuthenticated } = useContext(EmployeeContext);

  if (!isAuthenticated) {
    return <Navigate to="/employees/login" />; // Redirect to login if not authenticated
  }

  return element; // Show the protected element if authenticated
};

export default EmployeeProtectedRoute;
