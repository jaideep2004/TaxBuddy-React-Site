import React from "react";
import { useCustomerAuth } from "./CustomerAuthContext";

const CServiceStatus = () => {
	const { services, serviceMap, loading } = useCustomerAuth();

	// Display a loading indicator while data is being fetched
	if (loading) return <p>Loading...</p>;

	return (
		<div className='ctax-dashboard-section'>
			<div className='service-status'>
				<h2>Service Status</h2>
				<table>
					<thead>
						<tr>
							<th>Service Name</th>
							<th>Description</th>
							<th>Purchased At</th>
							<th>Activation Status</th>
							<th>Managed By</th>
						</tr>
					</thead>
					<tbody>
						{services.length > 0 ? (
							services.map((service, index) => {
								// Get the service name using the serviceId from serviceMap
								const serviceName =
									serviceMap[service.serviceId] || "Unknown Service";

								return (
									<tr key={index}>
										<td>{serviceName}</td>
										<td>
											{service.serviceDescription || "No description available"}
										</td>
										<td>
											{service.purchasedAt
												? new Date(service.purchasedAt).toLocaleDateString(
														"en-GB"
												  )
												: "N/A"}
										</td>
										<td>{service.activated ? "Activated" : "Not Activated"}</td>
										<td>{service.managedBy || "Unassigned"}</td>
									</tr>
								);
							})
						) : (
							<tr>
								<td colSpan='5' className='text-center'>
									No services found.
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default CServiceStatus;
