import React, { useContext, useState } from "react";
import axios from "./utils/axiosConfig";
import { AdminDashboardContext } from "./AdminDashboardContext";

const ManagersSection = () => {
	const [showManagerForm, setShowManagerForm] = useState(false);
	const [showAssignEmployeeForm, setShowAssignEmployeeForm] = useState(false);
	const {
		managers,
		users,
		services,
		newManager,
		setNewManager,
		handleCreateManager,
		handleActivateUser,
		handleDeactivateUser,
		handleDeleteUser,
	} = useContext(AdminDashboardContext);
	const [dateFilter, setDateFilter] = useState({ fromDate: "", toDate: "" });
	const [error, setError] = useState("");
	const [filterOption, setFilterOption] = useState("newest");
	const [searchTerm, setSearchTerm] = useState("");
	const [columnFilter, setColumnFilter] = useState({
		name: "",
		email: "",
		role: "",
	});
	const [filterCriteria, setFilterCriteria] = useState("name");

	const normalizeDate = (dateStr) => {
		const date = new Date(dateStr);
		date.setHours(0, 0, 0, 0); // Set time to midnight
		return date;
	};

	// Helper function to format the date as "12, Dec 2024"
	const formatDate = (dateStr) => {
		const date = new Date(dateStr);
		const options = { day: "2-digit", month: "short", year: "numeric" };
		return date.toLocaleDateString("en-GB", options).replace(/ /g, " ");
	};
	const filteredManagers = [...managers]
		.filter((manager) => {
			const lowerSearchTerm = searchTerm.toLowerCase();
			return (
				manager.name.toLowerCase().includes(lowerSearchTerm) ||
				manager.email.toLowerCase().includes(lowerSearchTerm)
			);
		})
		.filter((manager) => {
			return (
				(columnFilter.name === "" ||
					manager.name
						.toLowerCase()
						.includes(columnFilter.name.toLowerCase())) &&
				(columnFilter.email === "" ||
					manager.email
						.toLowerCase()
						.includes(columnFilter.email.toLowerCase()))
			);
		})
		.filter((manager) => {
			// Filtering by date range if set
			const managerDate = new Date(manager.createdAt);
			const fromDate = dateFilter.fromDate
				? normalizeDate(dateFilter.fromDate)
				: null;
			const toDate = dateFilter.toDate
				? normalizeDate(dateFilter.toDate)
				: null;

			return (
				(fromDate === null || managerDate >= fromDate) &&
				(toDate === null || managerDate <= toDate)
			);
		})
		.sort((a, b) => {
			if (filterOption === "newest") {
				return new Date(b.createdAt) - new Date(a.createdAt); // Sort by newest
			} else if (filterOption === "alphabetical") {
				return a.name.localeCompare(b.name); // Sort by name alphabetically
			} else {
				return 0; // Default, no sorting
			}
		});

	//assign employee
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
			setShowAssignEmployeeForm(false);
			setAssignEmployee({ employeeId: "", managerId: "" });
		} catch (err) {
			console.error("Error assigning employee:", err);
			setError("Error assigning employee.");
		}
	};

	return (
		<div className='tax-dashboard-employee'>
			<div className='filter-div'>
				<input
					type='text'
					placeholder={`Search by ${
						filterCriteria.charAt(0).toUpperCase() + filterCriteria.slice(1)
					}`}
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
				/>
				{/* Dropdown to Select Filter Criteria */}
				<select
					value={filterCriteria}
					onChange={(e) => setFilterCriteria(e.target.value)}>
					<option value='name'>Filter by Name</option>
					<option value='id'>Filter by ID</option>
				</select>
				<div>
					<input
						type='date'
						placeholder='From Date'
						value={dateFilter.fromDate}
						onChange={(e) =>
							setDateFilter({ ...dateFilter, fromDate: e.target.value })
						}
					/>
					<input
						type='date'
						placeholder='To Date'
						value={dateFilter.toDate}
						onChange={(e) =>
							setDateFilter({ ...dateFilter, toDate: e.target.value })
						}
					/>
				</div>
			</div>
			<table>
				<thead>
					<tr>
						<th>ID</th>
						<th>Date</th>
						<th>Name</th>
						<th>Email</th>
						<th>Assigned Service</th>
						<th>Assigned Employees</th>
						<th>Action</th>
					</tr>
				</thead>
				<tbody>
					{filteredManagers.map((manager) => (
						<tr key={manager._id}>
							<td>{manager._id}</td>
							<td>
								{manager.createdAt
									? formatDate(manager.createdAt) // Using formatDate function here
									: "Not available"}
							</td>

							<td>{manager.name}</td>
							<td>{manager.email}</td>
							<td>
								{manager.serviceId && services && services.length > 0
									? services.find(
											(service) => service._id === manager.serviceId
									  )?.name || "No service assigned"
									: "No service assigned"}
							</td>
							<td>
								{/* Check if assignedEmployees exists and has data */}
								{manager.assignedEmployees &&
								manager.assignedEmployees.length > 0 ? (
									<ul>
										{manager.assignedEmployees.map((employeeId) => {
											const employee = users.find(
												(user) => user._id === employeeId
											);
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
									disabled={manager.isActive}>
									Delete
								</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>
			{showManagerForm && (
				<div className='smodal'>
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
				<div className='smodal'>
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
			{/* Add Manager and Assign Employee buttons */}
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
