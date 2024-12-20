import React, { useEffect, useState } from "react";
import { useCustomerAuth } from "./CustomerAuthContext";
import { Navigate } from "react-router-dom"; // Assuming you're using react-router
import { jwtDecode } from "jwt-decode";

const CDashSection = () => {
	const {
		services,
		isLoggedIn,
		logout,
		user,
		loading,
		getAllServicesForCDash,
	} = useCustomerAuth();
	const [allServices, setAllServices] = useState([]);
	const [localLoading, setLocalLoading] = useState(true);

	useEffect(() => {
		// Fetch services only if the token is valid and services are available
		const fetchData = async () => {
			setLocalLoading(true);
			const fetchedServices = await getAllServicesForCDash();
			setAllServices(fetchedServices);
			setLocalLoading(false);
		};

		// Validate token and check login status
		const token = localStorage.getItem("customerToken");
		if (token && isLoggedIn && !loading) {
			fetchData();
		} else {
			logout(); // Logout the user if token is invalid
		}
	}, [isLoggedIn, loading, getAllServicesForCDash]);

	// const validateToken = (token) => {
	// 	try {
	// 		const decoded = jwtDecode(token);
	// 		const now = Date.now() / 1000; // Current time in seconds
	// 		return decoded.exp > now; // Token is valid if `exp` is greater than current time
	// 	} catch (error) {
	// 		return false; // Return false if token cannot be decoded
	// 	}
	// };

	// Redirect to login if not logged in
	if (!isLoggedIn) {
		return <Navigate to='/customers/login' replace />;
	}

	// Handle loading state for the context
	if (loading || localLoading) {
		return <p>Loading...</p>;
	}

	const totalServices = services.length;
	const totalPayments =
		user?.paymentHistory?.reduce(
			(total, payment) => total + payment.amount,
			0
		) || 0;

	return (
		<div className='ctax-dashboard-section'>
			<div className='cdashboard-summary'>
				<h1>Welcome, {user?.name}</h1>
				<div>
					<div className='cdashboard-card'>
						<p>Total Services: {totalServices}</p>
					</div>
					<div className='cdashboard-card'>
						<p>Total Payments: ₹{totalPayments}</p>
					</div>
				</div>
			</div>

			<div className='all-services-section'>
				<h3>Explore Our Services</h3>
				<div className='services-cards'>
					{allServices.length > 0 ? (
						allServices.map((service, index) => (
							<div key={index} className='service-card'>
								<h3>{service.name}</h3>
								<p>{service.description}</p>
								<p>Price: ₹{service.price}</p>
								<button onClick={() => handleServicePurchase(service)}>
									Buy Now
								</button>
							</div>
						))
					) : (
						<p>No services available at the moment.</p>
					)}
				</div>
			</div>
		</div>
	);
};

const handleServicePurchase = (service) => {
	alert(`You selected the service: ${service.name}`);
	// Add functionality to handle service purchase.
};

export default CDashSection;
