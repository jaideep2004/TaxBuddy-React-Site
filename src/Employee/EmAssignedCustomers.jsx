import React, { useState, useContext, useEffect } from "react";
import { EmployeeContext } from "./EmployeeContext"; // Adjust path as necessary

const EmAssignedCustomers = () => {
	const {
		assignedCustomers,
		loading,
		error,
		fetchAssignedCustomers,
		updateServiceStatus,
	} = useContext(EmployeeContext);

	const [isStatusUpdated, setIsStatusUpdated] = useState(false);

	useEffect(() => {
		// Fetch assigned customers when the component mounts or when status is updated
		if (!isStatusUpdated) {
			fetchAssignedCustomers();
		}
	}, [fetchAssignedCustomers, isStatusUpdated]);

	const handleStatusChange = async (event, serviceId, status) => {
		event.preventDefault();
		try {
			const response = await updateServiceStatus(serviceId, status);
			alert(response.message); // Show a success message
			setIsStatusUpdated(true);
		} catch (err) {
			alert("Failed to update service status.");
		}
	};

	return (
		<div className='assigned-customers tax-dashboard-employee'>
			<h3>Assigned Customers</h3>

			<table className='table'>
				<thead>
					<tr>
						<th>Name</th>
						<th>Email</th>
						{/* <th>Phone</th> */}
						{/* <th>Profile Complete</th> */}
						<th>Service Status</th>
						<th>Employee Remarks.
							
						</th>
						<th>Actions</th>
					</tr>
				</thead>
				<tbody>
					{assignedCustomers.map((customer) =>
						customer.services.map((service) => (
							<tr key={service._id}>
								<td>{customer.name}</td>
								<td>{customer.email}</td>
								{/* <td>{customer.mobile || "N/A"}</td> */}
								{/* <td>{customer.isProfileComplete ? "Yes" : "No"}</td> */}
								<td>{service.status}</td>
								<td></td>
								<td>
									{service.status === "Documents Uploaded" && (
										<>
											<button
												onClick={() =>
													handleStatusChange(service.serviceId, "approved")
												}>
												Approve
											</button>
											<button
												onClick={() =>
													handleStatusChange(service.serviceId, "rejected")
												}>
												Reject
											</button>
										</>
									)}
									{service.status === "approved" && (
										<button
											onClick={() =>
												handleStatusChange(service.serviceId, "in-process")
											}>
											Set In-Process
										</button>
									)}
									{service.status === "rejected" && (
										<button
											onClick={() =>
												handleStatusChange(service.serviceId, "in-process")
											}>
											Set In-Process
										</button>
									)}
									{service.status === "In Process" && (
										<button disabled>Already In Process</button>
									)}
								</td>
							</tr>
						))
					)}
				</tbody>
			</table>
		</div>
	);
};

export default EmAssignedCustomers;
