import React from "react";
import { useCustomerAuth } from "./CustomerAuthContext";

const CServiceStatus = () => {
	const { services, serviceMap, loading } = useCustomerAuth();

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
							<th>Status</th>
							{/* <th>Activation Status</th> */}
							<th>Managed By</th>
						</tr>
					</thead>

					<tbody>
						{services.length > 0 ? (
							services.map((service, index) => (
								<tr key={index}>
									<td>{service.serviceName}</td>
									<td>{service.serviceDescription}</td>
									<td>
										{service.purchasedAt
											? new Date(service.purchasedAt).toLocaleDateString(
													"en-GB"
											  )
											: "N/A"}
									</td>
									<td>{service.status}</td>
									
									<td>{service.managedBy}</td>
								</tr>
							))
						) : (
							<tr>
								<td colSpan='6' className='text-center'>
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
