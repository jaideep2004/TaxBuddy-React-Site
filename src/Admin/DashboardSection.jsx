import React, { useContext, useState } from "react";
import { AdminDashboardContext } from "./AdminDashboardContext";

const DashboardSection = () => {
	const [showServiceForm, setShowServiceForm] = useState(false);
	const [showEmployeeForm, setShowEmployeeForm] = useState(false);
	const [showManagerForm, setShowManagerForm] = useState(false);
	const [showUserForm, setShowUserForm] = useState(false);
	const {
		servicesCount,
		usersCount,
		employeesCount,
		customersCount,
		managersCount,
		services,
		newService,
		setNewService,
		// showServiceForm,
		// setShowServiceForm,
		handleCreateService,
		users,

		// showUserForm,
		// setShowUserForm,
		newUser,
		setNewUser,
		handleCreateUser,
		handleActivateUser,
		handleDeactivateUser,
		handleDeleteUser,

		// showEmployeeForm,
		// setShowEmployeeForm,
		showAssignCustomerForm,
		setShowAssignCustomerForm,
		newManager,
		setNewManager,
		newEmployee,
		setNewEmployee,
		handleCreateEmployee,
		handleCreateManager,
	} = useContext(AdminDashboardContext);
	return (
		<div className='tax-dashboard-section'>
			<h1>Welcome to the Admin Dashboard</h1>
			<div className='dashboard-summary'>
				<div className='dashboard-card'>
					<h3>Number of Services</h3>
					<p>{servicesCount}</p>
					<button
						className='tax-service-btn'
						onClick={() => setShowServiceForm(true)}>
						Add Service
					</button>
				</div>

				<div className='dashboard-card'>
					<h3>Number of Managers</h3>
					<p>{managersCount}</p>
					<button
						className='tax-service-btn'
						onClick={() => setShowManagerForm(true)}>
						Add Manager
					</button>
				</div>
				<div className='dashboard-card'>
					<h3>Number of Employees</h3>
					<p>{employeesCount}</p>
					<button
						className='tax-service-btn'
						onClick={() => setShowEmployeeForm(true)}>
						Add Employee
					</button>
				</div>
				<div className='dashboard-card'>
					<h3>Number of Customers</h3>
					<p>{customersCount}</p>
					<button
						className='tax-service-btn'
						onClick={() => setShowUserForm(true)}>
						Add Customer
					</button>
				</div>
				<div className='dashboard-card'>
					<h3>Number of Total Users</h3>
					<p>{usersCount}</p>
					<button
						className='tax-service-btn'
						onClick={() => setShowUserForm(true)}>
						Add User
					</button>
				</div>
			</div>
			{showServiceForm && (
				<div className='modal'>
					<h3>Add Service</h3>
					<input
						type='text'
						placeholder='Service Name'
						value={newService.name}
						onChange={(e) =>
							setNewService({ ...newService, name: e.target.value })
						}
					/>
					<input
						type='text'
						placeholder='Service Description'
						value={newService.description}
						onChange={(e) =>
							setNewService({ ...newService, description: e.target.value })
						}
					/>
					<input
						type='number'
						placeholder='Service Price'
						value={newService.price}
						onChange={(e) =>
							setNewService({ ...newService, price: e.target.value })
						}
					/>
					<div id='modal-div'>
						<button className='tax-service-btn' onClick={handleCreateService}>
							Create
						</button>
						<button onClick={() => setShowServiceForm(false)}>Cancel</button>
					</div>
				</div>
			)}

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
		</div>
	);
};

export default DashboardSection;
