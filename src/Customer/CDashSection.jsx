import React, { useEffect, useState } from "react";
import { useCustomerAuth } from "./CustomerAuthContext";

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
		fetchData();
	}, []);

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
								<p>Price: ₹{service.actualPrice}</p>
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

export default CDashSection;
