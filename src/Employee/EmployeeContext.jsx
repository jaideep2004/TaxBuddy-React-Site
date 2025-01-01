// // EmployeeContext.jsx
// import React, { createContext, useState, useEffect } from "react";
// import axios from "../Admin/utils/axiosConfig"; // Adjust based on your project structure

// export const EmployeeContext = createContext();

// export const EmployeeProvider = ({ children }) => {
// 	const [assignedCustomers, setAssignedCustomers] = useState([]);
// 	const [loading, setLoading] = useState(false);
// 	const [error, setError] = useState(null);
// 	const [isAuthenticated, setIsAuthenticated] = useState(false);

// 	const fetchAssignedCustomers = async () => {
// 		setLoading(true);
// 		setError(null);

// 		try {
// 			const response = await axios.get(
// 				"http://localhost:5000/api/employees/assigned-customers",
// 				{
// 					headers: {
// 						Authorization: `Bearer ${localStorage.getItem("employeeToken")}`,
// 					},
// 				}
// 			);
// 			console.log("Fetched Customers:", response.data); // Log the fetched data
// 			setAssignedCustomers(response.data);
// 		} catch (err) {
// 			console.error("Error fetching assigned customers:", err);
// 			setError("Failed to fetch customers.");
// 		} finally {
// 			setLoading(false);
// 		}
// 	};

// 	useEffect(() => {
// 		// Fetch customers only if authenticated
// 		if (isAuthenticated) {
// 			fetchAssignedCustomers();
// 		}
// 	}, [isAuthenticated]);

// 	const login = async (email, password) => {
// 		setLoading(true);
// 		setError(null);

// 		try {
// 			const response = await axios.post(
// 				"http://localhost:5000/api/employees/login",
// 				{
// 					email,
// 					password,
// 				}
// 			);
// 			const token = response.data.token;

// 			if (token) {
// 				localStorage.setItem("employeeToken", token);
// 				setIsAuthenticated(true);
// 				return true;
// 			} else {
// 				throw new Error("Token not received from server.");
// 			}
// 		} catch (err) {
// 			setError(err.response?.data?.message || "Login failed");
// 			return false;
// 		} finally {
// 			setLoading(false);
// 		}
// 	};

// 	// Handle service status update
// 	const updateServiceStatus = async (serviceId, status) => {
// 		try {
// 			const response = await axios.put(
// 				`http://localhost:5000/api/employees/update-service-status/${serviceId}`,
// 				{ status }
// 			);
// 			// Optionally, update the status locally if needed
// 			setAssignedCustomers((prevCustomers) =>
// 				prevCustomers.map((customer) =>
// 					customer.services.map((service) =>
// 						service.serviceId === serviceId ? { ...service, status } : service
// 					)
// 				)
// 			);
// 			return response.data;
// 		} catch (err) {
// 			setError("Error updating service status");
// 			throw err; // re-throw error to be handled in the component
// 		}
// 	};

// 	return (
// 		<EmployeeContext.Provider
// 			value={{
// 				login,
// 				assignedCustomers,
// 				loading,
// 				error,
// 				isAuthenticated,
// 				fetchAssignedCustomers,
// 				setIsAuthenticated,
// 				updateServiceStatus,
// 			}}>
// 			{children}
// 		</EmployeeContext.Provider>
// 	);
// };

import React, { createContext, useState, useEffect } from "react";
import axios from "../Admin/utils/axiosConfig"; // Adjust based on your project structure

export const EmployeeContext = createContext();

export const EmployeeProvider = ({ children }) => {
  const [assignedCustomers, setAssignedCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Fetch assigned customers function
  const fetchAssignedCustomers = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        "http://localhost:5000/api/employees/assigned-customers",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("employeeToken")}`, // Assuming token is stored in localStorage
          },
        }
      );
      setAssignedCustomers(response.data);
    } catch (err) {
      console.error("Error fetching assigned customers:", err);
      setError("Failed to fetch customers.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && assignedCustomers.length === 0) {
      // Fetch assigned customers only if not already fetched
      fetchAssignedCustomers();
    }
  }, [isAuthenticated, assignedCustomers.length]); // Only fetch if not already fetched

  const login = async (email, password) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/employees/login",
        {
          email,
          password,
        }
      );
      const token = response.data.token;

      if (token) {
        localStorage.setItem("employeeToken", token);
        setIsAuthenticated(true);
        return true;
      } else {
        throw new Error("Token not received from server.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateServiceStatus = async (serviceId, status) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/employees/update-service-status/${serviceId}`,
        { status }
      );
      // Optionally, update the status locally if needed
      setAssignedCustomers((prevCustomers) =>
        prevCustomers.map((customer) =>
          customer.services.map((service) =>
            service.serviceId === serviceId ? { ...service, status } : service
          )
        )
      );
      return response.data;
    } catch (err) {
      setError("Error updating service status");
      throw err; // re-throw error to be handled in the component
    }
  };

  return (
    <EmployeeContext.Provider
      value={{
        login,
        assignedCustomers,
        loading,
        error,
        isAuthenticated,
        setIsAuthenticated,
        fetchAssignedCustomers, // Provide this function to components
        updateServiceStatus,
      }}
    >
      {children}
    </EmployeeContext.Provider>
  );
};
