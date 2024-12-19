import React, { useContext, useState } from "react";
import axios from "./utils/axiosConfig";
import { AdminDashboardContext } from "./AdminDashboardContext";

const EmployeesSection = () => {
	const [showEmployeeForm, setShowEmployeeForm] = useState(false);
	const [showAssignCustomerForm, setShowAssignCustomerForm] = useState(false);
	const [filterQuery, setFilterQuery] = useState(""); // Filter query for search
	const [filterCriteria, setFilterCriteria] = useState("name"); // Filter criteria (name, email, service)

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

	const [error, setError] = useState("");
	const [assignCustomer, setAssignCustomer] = useState({
		customerId: "",
		employeeId: "",
	});

	// Filter employees based on selected criteria and search query
	const filteredEmployees = employees.filter((employee) => {
		const lowercasedQuery = filterQuery.toLowerCase();

		// Apply different filter logic based on selected filter criteria
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

		// Default to filtering by name
		return employee.name.toLowerCase().includes(lowercasedQuery);
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
			{/* Dropdown to Select Filter Criteria */}
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
								{/* Find the assigned service name */}
								{employee.serviceId
									? services.find(
											(service) => service._id === employee.serviceId
									  )?.name
									: "No service assigned"}
							</td>
							{/* <td>
								{employee.assignedCustomers &&
								employee.assignedCustomers.length > 0 ? (
									<ul>
										{employee.assignedCustomers.map((customerId) => {
											const customer = users.find(
												(user) => user._id === customerId
											);
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
							</td> */}
							<td>
								{/* Check if assignedCustomers exists and has data */}
								{employee.assignedCustomers &&
								employee.assignedCustomers.length > 0 ? (
									<select id="employee-select">
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
							<td className='tax-btn-cont'>
								<button
									onClick={() =>
										employee.isActive
											? handleDeactivateUser(employee._id)
											: handleActivateUser(employee._id)
									}
									className={
										employee.isActive ? "userDeactivate" : "userActivate"
									}
									disabled={employee.isActive && false}>
									{employee.isActive ? "Deactivate" : "Activate"}
								</button>
								<button
									className='userDelete'
									onClick={() => handleDeleteUser(employee._id)}
									disabled={employee.isActive}>
									Delete
								</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>

			{/* Add Employee Form Modal */}
			{showEmployeeForm && (
				<div className='modal'>
					<h3>Add Employee</h3>
					{/* Form inputs */}
					<input
						type='text'
						placeholder='Employee Name'
						value={newEmployee.name}
						onChange={(e) =>
							setNewEmployee({ ...newEmployee, name: e.target.value })
						}
					/>
					{/* Other form fields... */}
					<div id='modal-div'>
						<button onClick={handleCreateEmployee}>Create</button>
						<button onClick={() => setShowEmployeeForm(false)}>Cancel</button>
					</div>
				</div>
			)}

			{/* Assign Customer to Employee Form Modal */}
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
					{/* Employee selection for assignment */}
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

			{/* Employee and Customer Management Buttons */}
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
