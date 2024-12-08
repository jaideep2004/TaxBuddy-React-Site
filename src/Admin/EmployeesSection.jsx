import React, { useContext } from "react";
import { useState } from "react";
import axios from "./utils/axiosConfig";
import { AdminDashboardContext } from "./AdminDashboardContext";

const EmployeesSection = () => {
	const [showEmployeeForm, setShowEmployeeForm] = useState(false);
	const [showAssignCustomerForm, setShowAssignCustomerForm] = useState(false);

	const {
		users,
		setUsers,
		services,
		employees,
		newEmployee,
		setNewEmployee,
		handleCreateEmployee,
		handleActivateUser,
		handleDeactivateUser,
		handleDeleteUser,
		newUser,
		setNewUser,
	} = useContext(AdminDashboardContext);
	// Filter users to get employees
	const [error, setError] = useState("");
	// const employees = users.filter((user) => user.role === "employee");

	const [assignCustomer, setAssignCustomer] = useState({
		customerId: "",
		employeeId: "",
	});
	const handleAssignCustomer = async () => {
		const { customerId, employeeId } = assignCustomer;

		if (!customerId || !employeeId) {
			setError("Please provide all fields.");
			return;
		}

		try {
			const token = localStorage.getItem("adminToken");
			await axios.post(
				"http://localhost:5000/api/admin/assign-customer",
				{ customerId, employeeId },
				{ headers: { Authorization: `Bearer ${token}` } }
			);

			alert("Customer assigned to Employee successfully.");
			setShowAssignCustomerForm(false);
			setAssignCustomer({ customerId: "", employeeId: "" });
		} catch (err) {
			console.error("Error assigning customer:", err);
			setError("Error assigning customer.");
		}
	};
	return (
		<div className='tax-dashboard-employee'>
			<h3>Employees</h3>
			<table>
				<thead>
					<tr>
						<th>ID</th>
						<th>Name</th>
						<th>Email</th>
						<th>Role</th>
						<th>Assigned Service</th>
						<th>Assigned Customers</th>
						<th>Action</th>
					</tr>
				</thead>
				<tbody>
					{employees.map((employee) => (
						<tr key={employee._id}>
							<td>{employee._id}</td>
							<td>{employee.name}</td>
							<td>{employee.email}</td>
							<td>{employee.role}</td>
							<td>
								{/* Find the assigned service name */}
								{employee.serviceId
									? services.find(
											(service) => service._id === employee.serviceId
									  )?.name
									: "No service assigned"}
							</td>
							<td>
								{/* Check if assignedEmployees exists and has data */}
								{employee.assignedCustomers &&
								employee.assignedCustomers.length > 0 ? (
									<ul>
										{employee.assignedCustomers &&
										employee.assignedCustomers.length > 0 ? (
											<ul>
												{employee.assignedCustomers.map((customerId) => {
													console.log("Employee ID:", customerId); // Log the employee ID
													const customer = users.find(
														(user) => user._id === customerId
													);
													console.log("Customer:", customer); // Log the customer found
													return (
														<li key={customerId}>
															{customer ? customer.name : "Unknown Customer"}
														</li>
													);
												})}
											</ul>
										) : (
											"No customers assigned"
										)}
									</ul>
								) : (
									"No customers assigned"
								)}
							</td>
							<td className='tax-btn-cont'>
								{/* Single Toggle Button */}
								<button
									onClick={() =>
										employee.isActive
											? handleDeactivateUser(employee._id)
											: handleActivateUser(employee._id)
									}
									className={
										employee.isActive ? "userDeactivate" : "userActivate"
									}
									disabled={employee.isActive && false} // Optionally disable if needed
								>
									{employee.isActive ? "Deactivate" : "Activate"}
								</button>
								<button
									className='userDelete'
									onClick={() => handleDeleteUser(employee._id)}
									disabled={employee.isActive} // Optional: Disable delete if active
								>
									Delete
								</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>

			{showEmployeeForm && (
				<div className='modal'>
					<h3>Add Employee</h3>
					<input
						type='text'
						placeholder='Employee Name'
						value={newEmployee.name}
						onChange={(e) =>
							setNewEmployee({ ...newEmployee, name: e.target.value })
						}
					/>
					<input
						type='email'
						placeholder='Employee Email'
						value={newEmployee.email}
						onChange={(e) =>
							setNewEmployee({ ...newEmployee, email: e.target.value })
						}
					/>
					<select
						value={newEmployee.role}
						onChange={(e) =>
							setNewEmployee({ ...newEmployee, role: e.target.value })
						}>
						<option value=''>Select Role</option>
						<option value='admin'>Admin</option>
						<option value='employee'>Employee</option>
						<option value='customer'>Customer</option>
					</select>

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

			{showAssignCustomerForm && (
				<div className='modal'>
					<input
						type='text'
						placeholder='Customer ID'
						value={assignCustomer.customerId}
						onChange={(e) =>
							setAssignCustomer({
								...assignCustomer,
								customerId: e.target.value,
							})
						}
					/>
					<select
						value={assignCustomer.employeeId}
						onChange={(e) =>
							setAssignCustomer({
								...assignCustomer,
								employeeId: e.target.value,
							})
						}>
						<option value=''>Select Employee</option>
						{users
							.filter((user) => user.role === "employee")
							.map((employee) => (
								<option key={employee._id} value={employee._id}>
									{employee.name}
								</option>
							))}
					</select>
					<div id='modal-div'>
						<button onClick={handleAssignCustomer}>Assign Customer</button>
						<button onClick={() => setShowAssignCustomerForm(false)}>
							Cancel
						</button>
					</div>
				</div>
			)}
			<div id='employee-btn-cont'>
				<button
					style={{ marginTop: "20px" }}
					className='tax-service-btn'
					onClick={() => setShowEmployeeForm(true)}>
					Add Employee
				</button>
				<button
					style={{ marginTop: "20px" }}
					className='tax-service-btn'
					onClick={() => setShowAssignCustomerForm(true)}>
					Assign Customer to Employee
				</button>
			</div>
		</div>
	);
};

export default EmployeesSection;
