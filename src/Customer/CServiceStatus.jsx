// import React from "react";
import { useCustomerAuth } from "./CustomerAuthContext";

const CServiceStatus = () => {
	const { services, serviceMap, employeeMap, loading } = useCustomerAuth();

	// if (loading) return <p>Loading...</p>;

	return (
		<div className='ctax-dashboard-section'>
			<div className='service-status'>
				<h2>Service Status</h2>
				<table className='table table-striped'>
					<thead>
						<tr>
							<th>ID</th>
							<th>Purchased At</th>
							<th>Service Name</th>
							<th>Activation Status</th>
							<th>Managed By</th>
						</tr>
					</thead>
					<tbody>
						{services.length > 0 ? (
							services.map((service, index) => (
								<tr key={index}>
									<td>{service.serviceId}</td>
									<td>
										{service.purchasedAt
											? new Date(service.purchasedAt).toLocaleDateString(
													"en-GB"
											  )
											: "N/A"}
									</td>

									<td>{serviceMap[service.serviceId] || "Unknown Service"}</td>

									<td>{service.activated ? "Active" : "Inactive"}</td>

									<td>{service.employeeId}</td>
								</tr>
							))
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
