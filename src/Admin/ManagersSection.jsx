import React, { useContext } from "react";
import { useState } from "react";
import axios from "./utils/axiosConfig";
import { AdminDashboardContext } from "./AdminDashboardContext";

const ManagersSection = () => {
	const [showManagerForm, setShowManagerForm] = useState(false);
	const [showAssignEmployeeForm, setShowAssignEmployeeForm] = useState(false);
	const {
		users,
		services,

		newManager,
		setNewManager,
		handleCreateManager,
		handleActivateUser,
		handleDeactivateUser,
		handleDeleteUser,
		newUser,
		setNewUser,
	} = useContext(AdminDashboardContext);

	const [error, setError] = useState("");

	const managers = users.filter((user) => user.role === "manager");
	const [assignEmployee, setAssignEmployee] = useState({
		employeeId: "",
		managerId: "",
	});
	const handleAssignEmployee = async () => {
		const { employeeId, managerId } = assignEmployee;

		if (!employeeId || !managerId) {
			setError("Please provide all fields.");
			return;
		}

		try {
			const token = localStorage.getItem("adminToken");
			await axios.post(
				"http://localhost:5000/api/admin/assign-employee",
				{ employeeId, managerId },
				{ headers: { Authorization: `Bearer ${token}` } }
			);

			alert("Employee assigned to Manager successfully.");
			setShowAssignManagerForm(false);
			setAssignManager({ employeeId: "", managerId: "" });
		} catch (err) {
			console.error("Error assigning employee:", err);
			setError("Error assigning employee.");
		}
	};
	return (
		<div className='tax-dashboard-employee'>
			<h3>Managers</h3>
			<table>
				<thead>
					<tr>
						<th>ID</th>
						<th>Name</th>
						<th>Email</th>
						<th>Role</th>
						<th>Assigned Service</th>
						<th>Assigned Employees</th>
						<th>Action</th>
					</tr>
				</thead>
				<tbody>
					{managers.map((manager) => (
						<tr key={manager._id}>
							<td>{manager._id}</td>
							<td>{manager.name}</td>
							<td>{manager.email}</td>
							<td>{manager.role}</td>
							<td>
								{/* Find the assigned service name */}
								{manager.serviceId
									? services.find(
											(service) => service._id === manager.serviceId
									  )?.name
									: "No service assigned"}
							</td>
							<td>
								{/* Check if assignedEmployees exists and has data */}
								{manager.assignedEmployees &&
								manager.assignedEmployees.length > 0 ? (
									<ul>
										{manager.assignedEmployees &&
										manager.assignedEmployees.length > 0 ? (
											<ul>
												{manager.assignedEmployees.map((employeeId) => {
													console.log("Employee ID:", employeeId); // Log the employee ID
													const employee = users.find(
														(user) => user._id === employeeId
													);
													console.log("Employee:", employee); // Log the employee found
													return (
														<li key={employeeId}>
															{employee ? employee.name : "Unknown Employee"}
														</li>
													);
												})}
											</ul>
										) : (
											"No employees assigned"
										)}
									</ul>
								) : (
									"No employees assigned"
								)}
							</td>

							<td className='tax-btn-cont'>
								{/* Single Toggle Button */}
								<button
									onClick={() =>
										manager.isActive
											? handleDeactivateUser(manager._id)
											: handleActivateUser(manager._id)
									}
									className={
										manager.isActive ? "userDeactivate" : "userActivate"
									}
									disabled={manager.isActive && false} // Optionally disable if needed
								>
									{manager.isActive ? "Deactivate" : "Activate"}
								</button>
								<button
									className='userDelete'
									onClick={() => handleDeleteUser(manager._id)}
									disabled={manager.isActive} // Optional: Disable delete if active
								>
									Delete
								</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>

			{showManagerForm && (
				<div className='modal'>
					<h3>Add Manager</h3>
					<input
						type='text'
						placeholder='Manager Name'
						value={newManager.name}
						onChange={(e) =>
							setNewManager({ ...newManager, name: e.target.value })
						}
					/>
					<input
						type='email'
						placeholder='Manager Email'
						value={newManager.email}
						onChange={(e) =>
							setNewManager({ ...newManager, email: e.target.value })
						}
					/>
					<select
						value={newManager.role}
						onChange={(e) =>
							setNewManager({ ...newManager, role: e.target.value })
						}>
						<option value=''>Select Role</option>
						<option value='manager'>Manager</option>
						<option value='admin'>Admin</option>
						<option value='employee'>Employee</option>
						<option value='customer'>Customer</option>
					</select>

					<select
						value={newManager.serviceId}
						onChange={(e) =>
							setNewManager({ ...newManager, serviceId: e.target.value })
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
						value={newManager.username}
						onChange={(e) =>
							setNewManager({ ...newManager, username: e.target.value })
						}
					/>
					<input
						type='password'
						placeholder='Password'
						value={newManager.password}
						onChange={(e) =>
							setNewManager({ ...newManager, password: e.target.value })
						}
					/>
					<div id='modal-div'>
						<button onClick={handleCreateManager}>Create</button>
						<button onClick={() => setShowManagerForm(false)}>Cancel</button>
					</div>
				</div>
			)}

			{showAssignEmployeeForm && (
				<div className='modal'>
					<input
						type='text'
						placeholder='Employee ID'
						value={assignEmployee.employeeId}
						onChange={(e) =>
							setAssignEmployee({
								...assignEmployee,
								employeeId: e.target.value,
							})
						}
					/>
					<select
						value={assignEmployee.managerId}
						onChange={(e) =>
							setAssignEmployee({
								...assignEmployee,
								managerId: e.target.value,
							})
						}>
						<option value=''>Select Manager</option>
						{users
							.filter((user) => user.role === "manager")
							.map((manager) => (
								<option key={manager._id} value={manager._id}>
									{manager.name}
								</option>
							))}
					</select>
					<div id='modal-div'>
						<button onClick={handleAssignEmployee}>Assign Employee</button>
						<button onClick={() => setShowAssignEmployeeForm(false)}>
							Cancel
						</button>
					</div>
				</div>
			)}
			<div id='employee-btn-cont'>
				<button
					style={{ marginTop: "20px" }}
					className='tax-service-btn'
					onClick={() => setShowManagerForm(true)}>
					Add Manager
				</button>
				<button
					style={{ marginTop: "20px" }}
					className='tax-service-btn'
					onClick={() => setShowAssignEmployeeForm(true)}>
					Assign Employee to Manager
				</button>
			</div>
		</div>
	);
};

export default ManagersSection;
