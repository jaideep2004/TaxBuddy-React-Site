import React, { useEffect, useState } from "react";
import axios from "./utils/axiosConfig";
import { Navigate } from "react-router-dom"; // We still use Navigate for protection

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Fetch admin dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        setError("You must be logged in to view this page.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get("/dashboard", {
          headers: { Authorization: `Bearer ${token}` }, // Include token in headers
        });
        setUsers(response.data.users); // Assuming the backend returns a list of users
        setServices(response.data.services); // Assuming the backend returns a list of services
        setLoading(false);
      } catch (err) {
        setError("Failed to load dashboard data.");
        console.error(err);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // If no admin token exists, redirect to login page
  if (!localStorage.getItem("adminToken")) {
    return <Navigate to="/admin/login" replace />;
  }

  // If data is loading, show a loading message
  if (loading) {
    return <p>Loading...</p>;
  }

  // If there's an error, display an error message
  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <div>
        <h3>Users</h3>
        <ul>
          {users.map((user) => (
            <li key={user._id}>
              {user.name} - {user.email} - {user.role}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3>Services</h3>
        <ul>
          {services.map((service) => (
            <li key={service._id}>
              {service.name} - {service.status}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminDashboard;
