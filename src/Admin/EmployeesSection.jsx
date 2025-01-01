import React, { useState, useContext } from "react";
import axios from "./utils/axiosConfig";
import { AdminDashboardContext } from "./AdminDashboardContext";

const EmployeesSection = () => {
	const [showEmployeeForm, setShowEmployeeForm] = useState(false);
	const [showAssignCustomerForm, setShowAssignCustomerForm] = useState(false);
	const [filterQuery, setFilterQuery] = useState("");
	const [filterCriteria, setFilterCriteria] = useState("name");
	const [error, setError] = useState("");

	const {
		users,
		setUsers,
		services,
		employees,
		newEmployee,
		setNewEmployee,
		assignCustomer,
		setAssignCustomer,
		handleCreateEmployee,
		handleAssignCustomer, // Make sure this function is available in your context
		handleActivateUser,
		handleDeactivateUser,
		handleDeleteUser,
	} = useContext(AdminDashboardContext);

	// Filter employees based on criteria
	const filteredEmployees = employees.filter((employee) => {
		const lowercasedQuery = filterQuery.toLowerCase();

		if (filterCriteria === "name") {
			return employee.name.toLowerCase().includes(lowercasedQuery);
		} else if (filterCriteria === "email") {
			return employee.email.toLowerCase().includes(lowercasedQuery);
		} else if (filterCriteria === "service") {
			const serviceName = services.find(
				(service) => service._id === employee.serviceId
			)?.name;
			return serviceName?.toLowerCase().includes(lowercasedQuery);
		}

		return employee.name.toLowerCase().includes(lowercasedQuery);
	});

	return (
		<div className='tax-dashboard-employee'>
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
						<th>Assigned Customers</th>
						<th>Action</th>
					</tr>
				</thead>
				<tbody>
					{filteredEmployees.map((employee) => (
						<tr key={employee._id}>
							<td>{employee._id}</td>
							<td>
								{employee.createdAt
									? new Date(employee.createdAt).toLocaleDateString("en-GB")
									: "Not available"}
							</td>
							<td>{employee.name}</td>
							<td>{employee.email}</td>
							<td>
								{employee.serviceId
									? services.find(
											(service) => service._id === employee.serviceId
									  )?.name
									: "No service assigned"}
							</td>
							<td>
								{employee.assignedCustomers &&
								employee.assignedCustomers.length > 0 ? (
									<select>
										{employee.assignedCustomers.map((customerId) => {
											const customer = users.find(
												(user) => user._id === customerId
											);
											return (
												<option key={customerId} value={customerId}>
													{customer ? customer.name : "Unknown Customer"}
												</option>
											);
										})}
									</select>
								) : (
									"No customers assigned"
								)}
							</td>
							<td>
								<button
									onClick={() =>
										employee.isActive
											? handleDeactivateUser(employee._id)
											: handleActivateUser(employee._id)
									}>
									{employee.isActive ? "Deactivate" : "Activate"}
								</button>
								<button
									onClick={() => handleDeleteUser(employee._id)}
									disabled={employee.isActive}>
									Delete
								</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>

			{/* Employee Creation Form */}

			{showEmployeeForm && (
				<div className='smodal'>
					<h3>Add Employee</h3>
					<input
						type='text'
						placeholder='Employee Full Name'
						value={newEmployee.name}
						onChange={(e) =>
							setNewEmployee({ ...newEmployee, name: e.target.value })
						}
					/>
					<input
						type='email'
						placeholder='Email ID'
						value={newEmployee.email}
						onChange={(e) =>
							setNewEmployee({ ...newEmployee, email: e.target.value })
						}
					/>

					{/* Service Dropdown */}
					<select
						value={newEmployee.serviceId}
						onChange={(e) =>
							setNewEmployee({ ...newEmployee, serviceId: e.target.value })
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
						value={newEmployee.username}
						onChange={(e) =>
							setNewEmployee({ ...newEmployee, username: e.target.value })
						}
					/>
					<input
						type='password'
						placeholder='Password'
						value={newEmployee.password}
						onChange={(e) =>
							setNewEmployee({ ...newEmployee, password: e.target.value })
						}
					/>
					<div id='modal-div'>
					<button onClick={handleCreateEmployee}>Create</button>
					<button onClick={() => setShowEmployeeForm(false)}>Cancel</button>
					</div>
					
				</div>
			)}

			{/* Assign Customer to Employee Form */}
			{showAssignCustomerForm && (
				<div className='smodal'>
					<h3>Assign Customer to Employee</h3>
					<select
						value={assignCustomer.customerId}
						onChange={(e) =>
							setAssignCustomer({
								...assignCustomer,
								customerId: e.target.value,
							})
						}>
						<option value=''>Select Customer</option>
						{users
							.filter((user) => user.role === "customer")
							.map((customer) => (
								<option key={customer._id} value={customer._id}>
									{customer.name}
								</option>
							))}
					</select>
					<select
						value={assignCustomer.employeeId}
						onChange={(e) =>
							setAssignCustomer({
								...assignCustomer,
								employeeId: e.target.value,
							})
						}>
						<option value=''>Select Employee</option>
						{employees.map((employee) => (
							<option key={employee._id} value={employee._id}>
								{employee.name}
							</option>
						))}
					</select>
					<div id='modal-div'>
						<button onClick={handleAssignCustomer}>Assign</button>
						<button onClick={() => setShowAssignCustomerForm(false)}>
							Cancel
						</button>
					</div>
				</div>
			)}

			<div id='employee-btn-cont'>
				<button
					className='tax-service-btn'
					onClick={() => setShowEmployeeForm(true)}>
					Add Employee
				</button>
				<button
					className='tax-service-btn'
					onClick={() => setShowAssignCustomerForm(true)}>
					Assign Customer
				</button>
			</div>
		</div>
	);
};

export default EmployeesSection;
