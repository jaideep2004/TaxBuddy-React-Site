import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ProtectedRoute = ({ element, ...rest }) => {
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem("adminToken");

  useEffect(() => {
    // Redirect to login page if not authenticated
    if (!isAuthenticated) {
      navigate("/admin/login", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return isAuthenticated ? element : null;  // Render protected content if authenticated
};

export default ProtectedRoute;
