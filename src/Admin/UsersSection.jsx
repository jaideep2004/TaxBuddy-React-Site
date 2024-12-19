// import React, { useContext, useState } from "react";
// import { AdminDashboardContext } from "./AdminDashboardContext";

// const UsersSection = () => {
// 	const {
// 		users,
// 		services,
// 		newUser,
// 		setNewUser,
// 		handleCreateUser,
// 		handleActivateUser,
// 		handleDeactivateUser,
// 		handleDeleteUser,
// 	} = useContext(AdminDashboardContext);
// 	const [showUserForm, setShowUserForm] = useState(false);
// 	if (!users || !Array.isArray(users)) return <div>Loading Users...</div>;
// 	if (!services || !Array.isArray(services))
// 		return <div>Loading Services...</div>;

// 	// Filter users to get customers safely
// 	const customers = users.filter((user) => user?.role === "customer");

// 	const [filterQuery, setFilterQuery] = useState(""); // Filter query for search
// 	const [filterCriteria, setFilterCriteria] = useState("name"); // Filter criteria (name, email, service)
// 	// Filter employees based on selected criteria and search query
// 	const filteredCustomers = customers.filter((customer) => {
// 		const lowercasedQuery = filterQuery.toLowerCase();

// 		// Apply different filter logic based on selected filter criteria
// 		if (filterCriteria === "name") {
// 			return customer.name.toLowerCase().includes(lowercasedQuery);
// 		} else if (filterCriteria === "email") {
// 			return customer.email.toLowerCase().includes(lowercasedQuery);
// 		} else if (filterCriteria === "service") {
// 			const serviceName = services.find(
// 				(service) => service._id === customer.serviceId
// 			)?.name;
// 			return serviceName?.toLowerCase().includes(lowercasedQuery);
// 		}

// 		// Default to filtering by name
// 		return customer.name.toLowerCase().includes(lowercasedQuery);
// 	});

// 	return (
// 		<div className='tax-dashboard-customers'>
// 			<div className='filter-div'>
// 				<input
// 					type='text'
// 					placeholder={`Search by ${
// 						filterCriteria.charAt(0).toUpperCase() + filterCriteria.slice(1)
// 					}`}
// 					value={filterQuery}
// 					onChange={(e) => setFilterQuery(e.target.value)}
// 				/>
// 				<select
// 					value={filterCriteria}
// 					onChange={(e) => setFilterCriteria(e.target.value)}>
// 					<option value='name'>Filter by Name</option>
// 					<option value='email'>Filter by Email</option>
// 					<option value='service'>Filter by Service</option>
// 				</select>
// 			</div>
// 			<table>
// 				<thead>
// 					<tr>
// 						<th>ID</th>
// 						<th>Date</th>
// 						<th>Name</th>
// 						<th>Email</th>
// 						<th>Assigned Service</th>
// 						<th>Action</th>
// 					</tr>
// 				</thead>
// 				<tbody>
// 					{customers.map((customer) => (
// 						<tr key={customer._id}>
// 							<td>{customer._id}</td>
// 							<td>
// 								{customer.createdAt
// 									? new Date(customer.createdAt).toLocaleDateString("en-GB")
// 									: "No Date"}
// 							</td>

// 							<td>{customer.name}</td>
// 							<td>{customer.email}</td>

// 							<td>
// 								{/* Display assigned service name or "No service assigned" */}
// 								{customer.serviceId
// 									? services.find(
// 											(service) => service._id === customer.serviceId
// 									  )?.name
// 									: "No service assigned"}
// 							</td>
// 							<td className='tax-btn-cont'>
// 								{/* Single Toggle Button */}
// 								<button
// 									onClick={() =>
// 										customer.isActive
// 											? handleDeactivateUser(customer._id)
// 											: handleActivateUser(customer._id)
// 									}
// 									className={
// 										customer.isActive ? "userDeactivate" : "userActivate"
// 									}
// 									disabled={customer.isActive && false} // Optionally disable if needed
// 								>
// 									{customer.isActive ? "Deactivate" : "Activate"}
// 								</button>
// 								<button
// 									className='userDelete'
// 									onClick={() => handleDeleteUser(customer._id)}
// 									disabled={customer.isActive} // Optional: Disable delete if active
// 								>
// 									Delete
// 								</button>
// 							</td>
// 						</tr>
// 					))}
// 				</tbody>
// 			</table>

// 			{showUserForm && (
// 				<div className='modal'>
// 					<h3>Add Customer</h3>
// 					<input
// 						type='text'
// 						placeholder='Customer Name'
// 						value={newUser.name}
// 						onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
// 					/>
// 					<input
// 						type='email'
// 						placeholder='Customer Email'
// 						value={newUser.email}
// 						onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
// 					/>
// 					<input
// 						type='text'
// 						placeholder='Mobile'
// 						value={newUser.mobile}
// 						onChange={(e) => setNewUser({ ...newUser, mobile: e.target.value })}
// 					/>
// 					<input
// 						type='date'
// 						placeholder='Date of Birth'
// 						value={newUser.dob}
// 						onChange={(e) => setNewUser({ ...newUser, dob: e.target.value })}
// 					/>
// 					<input
// 						type='text'
// 						placeholder='Gender'
// 						value={newUser.gender}
// 						onChange={(e) => setNewUser({ ...newUser, gender: e.target.value })}
// 					/>
// 					<input
// 						type='text'
// 						placeholder='PAN'
// 						value={newUser.pan}
// 						onChange={(e) => setNewUser({ ...newUser, pan: e.target.value })}
// 					/>
// 					<input
// 						type='text'
// 						placeholder='GST'
// 						value={newUser.gst}
// 						onChange={(e) => setNewUser({ ...newUser, gst: e.target.value })}
// 					/>
// 					<input
// 						type='text'
// 						placeholder='Address'
// 						value={newUser.address}
// 						onChange={(e) =>
// 							setNewUser({ ...newUser, address: e.target.value })
// 						}
// 					/>
// 					<input
// 						type='text'
// 						placeholder='City'
// 						value={newUser.city}
// 						onChange={(e) => setNewUser({ ...newUser, city: e.target.value })}
// 					/>
// 					<input
// 						type='text'
// 						placeholder='State'
// 						value={newUser.state}
// 						onChange={(e) => setNewUser({ ...newUser, state: e.target.value })}
// 					/>
// 					<input
// 						type='text'
// 						placeholder='Country'
// 						value={newUser.country}
// 						onChange={(e) =>
// 							setNewUser({ ...newUser, country: e.target.value })
// 						}
// 					/>
// 					<input
// 						type='number'
// 						placeholder='Postal Code'
// 						value={newUser.postalcode}
// 						onChange={(e) =>
// 							setNewUser({ ...newUser, postalcode: e.target.value })
// 						}
// 					/>
// 					<input
// 						type='text'
// 						placeholder='Nature of Employment'
// 						value={newUser.natureEmployement}
// 						onChange={(e) =>
// 							setNewUser({ ...newUser, natureEmployement: e.target.value })
// 						}
// 					/>
// 					<input
// 						type='text'
// 						placeholder='Annual Income'
// 						value={newUser.annualIncome}
// 						onChange={(e) =>
// 							setNewUser({ ...newUser, annualIncome: e.target.value })
// 						}
// 					/>
// 					<input
// 						type='text'
// 						placeholder='Education'
// 						value={newUser.education}
// 						onChange={(e) =>
// 							setNewUser({ ...newUser, education: e.target.value })
// 						}
// 					/>
// 					<input
// 						type='text'
// 						placeholder='Certifications'
// 						value={newUser.certifications}
// 						onChange={(e) =>
// 							setNewUser({ ...newUser, certifications: e.target.value })
// 						}
// 					/>
// 					<input
// 						type='text'
// 						placeholder='Institute'
// 						value={newUser.institute}
// 						onChange={(e) =>
// 							setNewUser({ ...newUser, institute: e.target.value })
// 						}
// 					/>
// 					<input
// 						type='date'
// 						placeholder='Completion Date'
// 						value={newUser.completiondate}
// 						onChange={(e) =>
// 							setNewUser({ ...newUser, completiondate: e.target.value })
// 						}
// 					/>
// 					<select
// 						value={newUser.role}
// 						onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}>
// 						<option value=''>Select Role</option>
// 						<option value='admin'>Admin</option>
// 						<option value='employee'>Employee</option>
// 						<option value='customer'>Customer</option>
// 					</select>

// 					<select
// 						value={newUser.serviceId}
// 						onChange={(e) =>
// 							setNewUser({ ...newUser, serviceId: e.target.value })
// 						}>
// 						<option value=''>Select Service</option>
// 						{services.map((service) => (
// 							<option key={service._id} value={service._id}>
// 								{service.name}
// 							</option>
// 						))}
// 					</select>
// 					<input
// 						type='text'
// 						placeholder='Username'
// 						value={newUser.username}
// 						onChange={(e) =>
// 							setNewUser({ ...newUser, username: e.target.value })
// 						}
// 					/>
// 					<input
// 						type='password'
// 						placeholder='Password'
// 						value={newUser.password}
// 						onChange={(e) =>
// 							setNewUser({ ...newUser, password: e.target.value })
// 						}
// 					/>
// 					<div id='modal-div'>
// 						<button onClick={handleCreateUser}>Create</button>
// 						<button onClick={() => setShowUserForm(false)}>Cancel</button>
// 					</div>
// 				</div>
// 			)}

// 			<button
// 				style={{ marginTop: "20px" }}
// 				className='tax-service-btn'
// 				onClick={() => setShowUserForm(true)}>
// 				Add Customer
// 			</button>
// 		</div>
// 	);
// };

// export default UsersSection;

import React, { useContext, useState } from "react";
import { AdminDashboardContext } from "./AdminDashboardContext";

const UsersSection = () => {
	const {
		users,
		services,
		newUser,
		setNewUser,
		handleCreateUser,
		handleActivateUser,
		handleDeactivateUser,
		handleDeleteUser,
	} = useContext(AdminDashboardContext);

	const [showUserForm, setShowUserForm] = useState(false);

	if (!users || !Array.isArray(users)) return <div>Loading Users...</div>;
	if (!services || !Array.isArray(services))
		return <div>Loading Services...</div>;

	// Filter users to get customers safely
	const customers = users.filter((user) => user?.role === "customer");

	const [filterQuery, setFilterQuery] = useState(""); // Filter query for search
	const [filterCriteria, setFilterCriteria] = useState("name"); // Filter criteria (name, email, service)

	// Filter customers based on selected criteria and search query
	const filteredCustomers = customers.filter((customer) => {
		const lowercasedQuery = filterQuery.toLowerCase();

		// Apply different filter logic based on selected filter criteria
		if (filterCriteria === "name") {
			return customer.name.toLowerCase().includes(lowercasedQuery);
		} else if (filterCriteria === "email") {
			return customer.email.toLowerCase().includes(lowercasedQuery);
		} else if (filterCriteria === "service") {
			const serviceName = services.find(
				(service) => service._id === customer.serviceId
			)?.name;
			return serviceName?.toLowerCase().includes(lowercasedQuery);
		}

		// Default to filtering by name
		return customer.name.toLowerCase().includes(lowercasedQuery);
	});

	return (
		<div className='tax-dashboard-customers'>
			{/* Filter Section */}
			<div className='filter-div'>
				<input
					type='text'
					placeholder={`Search by ${
						filterCriteria.charAt(0).toUpperCase() + filterCriteria.slice(1)
					}`}
					value={filterQuery}
					onChange={(e) => setFilterQuery(e.target.value)}
				/>
				<select
					value={filterCriteria}
					onChange={(e) => setFilterCriteria(e.target.value)}>
					<option value='name'>Filter by Name</option>
					<option value='email'>Filter by Email</option>
					<option value='service'>Filter by Service</option>
				</select>
			</div>

			<table>
				<thead>
					<tr>
						<th>ID</th>
						<th>Date</th>
						<th>Name</th>
						<th>Email</th>
						<th>Assigned Service</th>
						<th>Action</th>
					</tr>
				</thead>
				{/* <tbody>
					{filteredCustomers.map((customer) => (
						<tr key={customer._id}>
							<td>{customer._id}</td>
							<td>
								{customer.createdAt
									? new Date(customer.createdAt).toLocaleDateString("en-GB")
									: "No Date"}
							</td>
							<td>{customer.name}</td>
							<td>{customer.email}</td>

							<td>
								
								{customer.serviceId
									? services.find(
											(service) => service._id === customer.serviceId
									  )?.name
									: "No service assigned"}
							</td>

							<td className='tax-btn-cont'>
								
								<button
									onClick={() =>
										customer.isActive
											? handleDeactivateUser(customer._id)
											: handleActivateUser(customer._id)
									}
									className={
										customer.isActive ? "userDeactivate" : "userActivate"
									}
									disabled={customer.isActive && false}
								>
									{customer.isActive ? "Deactivate" : "Activate"}
								</button>
								<button
									className='userDelete'
									onClick={() => handleDeleteUser(customer._id)}
									disabled={customer.isActive} 
								>
									Delete
								</button>
							</td>
						</tr>
					))}
				</tbody> */}
				<tbody>
					{filteredCustomers.map((customer) => {
						// Check if customer has services
						console.log("Customer Services:", customer.services);

						// Extract the serviceIds from the customer's services array
						const assignedServices = customer.services || [];

						// Map through the services and fetch the service name from the services list
						const serviceNames = assignedServices
							.map((service) => {
								// Check each service and log the serviceId
								console.log("Service ID:", service.serviceId);

								// Find the service in the global services array
								const serviceObj = services.find(
									(s) => s._id === service.serviceId
								);

								// Log the found service object
								console.log("Found Service:", serviceObj);

								// If a matching service is found, return its name, else return null
								return serviceObj ? serviceObj.name : null;
							})
							.filter(Boolean) // Filter out null/undefined values (if no matching service)
							.join(", "); // Join service names with commas

						return (
							<tr key={customer._id}>
								<td>{customer._id}</td>
								<td>
									{customer.createdAt
										? new Date(customer.createdAt).toLocaleDateString("en-GB")
										: "No Date"}
								</td>
								<td>{customer.name}</td>
								<td>{customer.email}</td>

								<td>
									{/* Display assigned service names */}
									{serviceNames || "No service assigned"}
								</td>

								<td className='tax-btn-cont'>
									{/* Toggle Active Status */}
									<button
										onClick={() =>
											customer.isActive
												? handleDeactivateUser(customer._id)
												: handleActivateUser(customer._id)
										}
										className={
											customer.isActive ? "userDeactivate" : "userActivate"
										}
										disabled={customer.isActive && false} // Optionally disable if needed
									>
										{customer.isActive ? "Deactivate" : "Activate"}
									</button>
									<button
										className='userDelete'
										onClick={() => handleDeleteUser(customer._id)}
										disabled={customer.isActive} // Optional: Disable delete if active
									>
										Delete
									</button>
								</td>
							</tr>
						);
					})}
				</tbody>
			</table>

			{/* Add User Form Modal */}
			{showUserForm && (
				<div className='modal'>
					<h3>Add Customer</h3>
					<input
						type='text'
						placeholder='Customer Name'
						value={newUser.name}
						onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
					/>
					<input
						type='email'
						placeholder='Customer Email'
						value={newUser.email}
						onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
					/>
					<input
						type='text'
						placeholder='Mobile'
						value={newUser.mobile}
						onChange={(e) => setNewUser({ ...newUser, mobile: e.target.value })}
					/>
					<input
						type='date'
						placeholder='Date of Birth'
						value={newUser.dob}
						onChange={(e) => setNewUser({ ...newUser, dob: e.target.value })}
					/>
					<input
						type='text'
						placeholder='Gender'
						value={newUser.gender}
						onChange={(e) => setNewUser({ ...newUser, gender: e.target.value })}
					/>
					<input
						type='text'
						placeholder='PAN'
						value={newUser.pan}
						onChange={(e) => setNewUser({ ...newUser, pan: e.target.value })}
					/>
					<input
						type='text'
						placeholder='GST'
						value={newUser.gst}
						onChange={(e) => setNewUser({ ...newUser, gst: e.target.value })}
					/>
					<input
						type='text'
						placeholder='Address'
						value={newUser.address}
						onChange={(e) =>
							setNewUser({ ...newUser, address: e.target.value })
						}
					/>
					<input
						type='text'
						placeholder='City'
						value={newUser.city}
						onChange={(e) => setNewUser({ ...newUser, city: e.target.value })}
					/>
					<input
						type='text'
						placeholder='State'
						value={newUser.state}
						onChange={(e) => setNewUser({ ...newUser, state: e.target.value })}
					/>
					<input
						type='text'
						placeholder='Country'
						value={newUser.country}
						onChange={(e) =>
							setNewUser({ ...newUser, country: e.target.value })
						}
					/>
					<input
						type='number'
						placeholder='Postal Code'
						value={newUser.postalcode}
						onChange={(e) =>
							setNewUser({ ...newUser, postalcode: e.target.value })
						}
					/>
					<input
						type='text'
						placeholder='Nature of Employment'
						value={newUser.natureEmployement}
						onChange={(e) =>
							setNewUser({ ...newUser, natureEmployement: e.target.value })
						}
					/>
					<input
						type='text'
						placeholder='Annual Income'
						value={newUser.annualIncome}
						onChange={(e) =>
							setNewUser({ ...newUser, annualIncome: e.target.value })
						}
					/>
					<input
						type='text'
						placeholder='Education'
						value={newUser.education}
						onChange={(e) =>
							setNewUser({ ...newUser, education: e.target.value })
						}
					/>
					<input
						type='text'
						placeholder='Certifications'
						value={newUser.certifications}
						onChange={(e) =>
							setNewUser({ ...newUser, certifications: e.target.value })
						}
					/>
					<input
						type='text'
						placeholder='Institute'
						value={newUser.institute}
						onChange={(e) =>
							setNewUser({ ...newUser, institute: e.target.value })
						}
					/>
					<input
						type='date'
						placeholder='Completion Date'
						value={newUser.completiondate}
						onChange={(e) =>
							setNewUser({ ...newUser, completiondate: e.target.value })
						}
					/>
					<select
						value={newUser.role}
						onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}>
						<option value=''>Select Role</option>
						<option value='admin'>Admin</option>
						<option value='employee'>Employee</option>
						<option value='customer'>Customer</option>
					</select>

					<select
						value={newUser.serviceId}
						onChange={(e) =>
							setNewUser({ ...newUser, serviceId: e.target.value })
						}>
						<option value=''>Select Service</option>
						{services.map((service) => (
							<option key={service._id} value={service._id}>
								{service.name}
							</option>
						))}
					</select>
					<input
						type='text'
						placeholder='Username'
						value={newUser.username}
						onChange={(e) =>
							setNewUser({ ...newUser, username: e.target.value })
						}
					/>
					<input
						type='password'
						placeholder='Password'
						value={newUser.password}
						onChange={(e) =>
							setNewUser({ ...newUser, password: e.target.value })
						}
					/>
					<div id='modal-div'>
						<button onClick={handleCreateUser}>Create</button>
						<button onClick={() => setShowUserForm(false)}>Cancel</button>
					</div>
				</div>
			)}

			{/* Add Customer Button */}
			<button
				style={{ marginTop: "20px" }}
				className='tax-service-btn'
				onClick={() => setShowUserForm(true)}>
				Add Customer
			</button>
		</div>
	);
};

export default UsersSection;
