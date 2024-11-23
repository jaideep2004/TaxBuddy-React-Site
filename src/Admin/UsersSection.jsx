import React, { useContext ,useState} from "react";
import { AdminDashboardContext } from "./AdminDashboardContext";

const UsersSection = () => {
	const {
		users,
		services,
		// showUserForm,
		// setShowUserForm,
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

	return (
		<div className='tax-dashboard-customers'>
			<h2>Customers</h2>
			<table>
				<thead>
					<tr>
						<th>ID</th>
						<th>Name</th>
						<th>Email</th>
						<th>Role</th>
						<th>Assigned Service</th>
						<th>Action</th>
					</tr>
				</thead>
				<tbody>
					{customers.map((customer) => (
						<tr key={customer._id}>
							<td>{customer._id}</td>
							<td>{customer.name}</td>
							<td>{customer.email}</td>
							<td>{customer.role}</td>
							<td>
								{/* Display assigned service name or "No service assigned" */}
								{customer.serviceId
									? services.find(
											(service) => service._id === customer.serviceId
									  )?.name
									: "No service assigned"}
							</td>
							<td className='tax-btn-cont'>
								{/* Single Toggle Button */}
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
					))}
				</tbody>
			</table>

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
