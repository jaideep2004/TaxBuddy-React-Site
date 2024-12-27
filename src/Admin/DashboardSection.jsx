import React, { useContext, useState } from "react";
import { AdminDashboardContext } from "./AdminDashboardContext";
import { useNavigate } from "react-router-dom";

const DashboardSection = () => {
	const navigate = useNavigate();

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
		handleCreateService,
		users,
		newUser,
		setNewUser,
		handleCreateUser,
		handleActivateUser,
		handleDeactivateUser,
		handleDeleteUser,
		showAssignCustomerForm,
		setShowAssignCustomerForm,
		newManager,
		setNewManager,
		newEmployee,
		setNewEmployee,
		handleCreateEmployee,
		handleCreateManager,
		isAuthenticated,
		error,
	} = useContext(AdminDashboardContext);

	const handleLoginAgain = () => {
		// Redirect to login page
		navigate("/admin/login");
	};

	if (error) {
		return (
			<div className='error-message'>
				<p>{error}</p>
				<button onClick={handleLoginAgain}>Login Again</button>
			</div>
		);
	}

	return (
		<div className='tax-dashboard-section'>
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
				<div className='smodal'>
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
						placeholder='Actual Service Price'
						value={newService.actualPrice}
						onChange={(e) =>
							setNewService({ ...newService, actualPrice: e.target.value })
						}
					/>
					<input
						type='number'
						placeholder='Sale Service Price'
						value={newService.salePrice}
						onChange={(e) =>
							setNewService({ ...newService, salePrice: e.target.value })
						}
					/>
					<input
						type='text'
						placeholder='HSN Code'
						value={newService.hsncode}
						onChange={(e) =>
							setNewService({ ...newService, hsncode: e.target.value })
						}
					/>
					<div id='modal-div'>
						<button onClick={handleCreateService}>Create</button>
						<button onClick={() => setShowServiceForm(false)}>Cancel</button>
					</div>
				</div>
			)}

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
				<div className='smodal'>
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
					<div>
						<h3>Add Employee</h3>
						<input
							type='text'
							placeholder='Employee Code'
							value={newEmployee.employeeCode}
							onChange={(e) =>
								setNewEmployee({ ...newEmployee, employeeCode: e.target.value })
							}
						/>
						{/* Employee Full Name */}
						<input
							type='text'
							placeholder='Employee Full Name'
							value={newEmployee.name}
							onChange={(e) =>
								setNewEmployee({ ...newEmployee, name: e.target.value })
							}
						/>
						{/* Email ID */}
						<input
							type='email'
							placeholder='Email ID'
							value={newEmployee.email}
							onChange={(e) =>
								setNewEmployee({ ...newEmployee, email: e.target.value })
							}
						/>
						{/* Phone number */}
						<input
							type='text'
							placeholder='Phone number'
							value={newEmployee.phone}
							onChange={(e) =>
								setNewEmployee({ ...newEmployee, phone: e.target.value })
							}
						/>
						{/* Date of Birth */}
						<input
							type='date'
							placeholder='Date of Birth'
							value={newEmployee.dob}
							onChange={(e) =>
								setNewEmployee({ ...newEmployee, dob: e.target.value })
							}
						/>
						{/* Gender */}
						<select
							value={newEmployee.gender}
							onChange={(e) =>
								setNewEmployee({ ...newEmployee, gender: e.target.value })
							}>
							<option value=''>Select Gender</option>
							<option value='Male'>Male</option>
							<option value='Female'>Female</option>
							<option value='Other'>Other</option>
						</select>
						{/* Date of Joining */}
						<input
							type='date'
							placeholder='Date of Joining'
							value={newEmployee.dateOfJoining}
							onChange={(e) =>
								setNewEmployee({
									...newEmployee,
									dateOfJoining: e.target.value,
								})
							}
						/>
						{/* Designation */}
						<input
							type='text'
							placeholder='Designation'
							value={newEmployee.designation}
							onChange={(e) =>
								setNewEmployee({ ...newEmployee, designation: e.target.value })
							}
						/>
						{/* Services Handled */}
						<input
							type='text'
							placeholder='Services Handled'
							value={newEmployee.servicesHandled}
							onChange={(e) =>
								setNewEmployee({
									...newEmployee,
									servicesHandled: e.target.value,
								})
							}
						/>
						{/* Manager fields */}
						<input
							type='text'
							placeholder='L+1 Empcode (Manager Code)'
							value={newEmployee.managerCode}
							onChange={(e) =>
								setNewEmployee({ ...newEmployee, managerCode: e.target.value })
							}
						/>
						<input
							type='text'
							placeholder='L+1 Name (Manager Name)'
							value={newEmployee.managerName}
							onChange={(e) =>
								setNewEmployee({ ...newEmployee, managerName: e.target.value })
							}
						/>
						<input
							type='text'
							placeholder='L+2 Empcode (Manager Manager Code)
'
							value={newEmployee.managerName}
							onChange={(e) =>
								setNewEmployee({ ...newEmployee, managerName: e.target.value })
							}
						/>
						<input
							type='text'
							placeholder='L+2 Name (Managers Manager)'
							value={newEmployee.managerName}
							onChange={(e) =>
								setNewEmployee({ ...newEmployee, managerName: e.target.value })
							}
						/>
						<input
							type='text'
							placeholder='Employee Status
'
							value={newEmployee.managerName}
							onChange={(e) =>
								setNewEmployee({ ...newEmployee, managerName: e.target.value })
							}
						/>
						<input
							type='text'
							placeholder='Reason for Leaving
'
							value={newEmployee.managerName}
							onChange={(e) =>
								setNewEmployee({ ...newEmployee, managerName: e.target.value })
							}
						/>
						<input
							type='text'
							placeholder='Current Organization Relieving Date
'
							value={newEmployee.managerName}
							onChange={(e) =>
								setNewEmployee({ ...newEmployee, managerName: e.target.value })
							}
						/>
						<input
							type='text'
							placeholder='PAN
'
							value={newEmployee.managerName}
							onChange={(e) =>
								setNewEmployee({ ...newEmployee, managerName: e.target.value })
							}
						/>
						<input
							type='text'
							placeholder='L+1 Name (Manager Name)'
							value={newEmployee.managerName}
							onChange={(e) =>
								setNewEmployee({ ...newEmployee, managerName: e.target.value })
							}
						/>
						<input
							type='text'
							placeholder='GSTIN
'
							value={newEmployee.managerName}
							onChange={(e) =>
								setNewEmployee({ ...newEmployee, managerName: e.target.value })
							}
						/>
						<input
							type='text'
							placeholder='TAN
'
							value={newEmployee.managerName}
							onChange={(e) =>
								setNewEmployee({ ...newEmployee, managerName: e.target.value })
							}
						/>
						<input
							type='text'
							placeholder='Full Address
'
							value={newEmployee.managerName}
							onChange={(e) =>
								setNewEmployee({ ...newEmployee, managerName: e.target.value })
							}
						/>
						<input
							type='text'
							placeholder='City
'
							value={newEmployee.managerName}
							onChange={(e) =>
								setNewEmployee({ ...newEmployee, managerName: e.target.value })
							}
						/>
						<input
							type='text'
							placeholder='State
'
							value={newEmployee.managerName}
							onChange={(e) =>
								setNewEmployee({ ...newEmployee, managerName: e.target.value })
							}
						/>
						<input
							type='text'
							placeholder='L+1 Name (Manager Name)'
							value={newEmployee.managerName}
							onChange={(e) =>
								setNewEmployee({ ...newEmployee, managerName: e.target.value })
							}
						/>
						<input
							type='text'
							placeholder='Country
'
							value={newEmployee.managerName}
							onChange={(e) =>
								setNewEmployee({ ...newEmployee, managerName: e.target.value })
							}
						/>
						<input
							type='text'
							placeholder='Postal Code
'
							value={newEmployee.managerName}
							onChange={(e) =>
								setNewEmployee({ ...newEmployee, managerName: e.target.value })
							}
						/>
						<input
							type='text'
							placeholder='Position Code
'
							value={newEmployee.managerName}
							onChange={(e) =>
								setNewEmployee({ ...newEmployee, managerName: e.target.value })
							}
						/>
						<input
							type='text'
							placeholder='Position Desc
'
							value={newEmployee.managerName}
							onChange={(e) =>
								setNewEmployee({ ...newEmployee, managerName: e.target.value })
							}
						/>
						<input
							type='text'
							placeholder='Payroll service area
'
							value={newEmployee.managerName}
							onChange={(e) =>
								setNewEmployee({ ...newEmployee, managerName: e.target.value })
							}
						/>
						<input
							type='text'
							placeholder='Department Code
'
							value={newEmployee.managerName}
							onChange={(e) =>
								setNewEmployee({ ...newEmployee, managerName: e.target.value })
							}
						/>
						<input
							type='text'
							placeholder='Department Name
'
							value={newEmployee.managerName}
							onChange={(e) =>
								setNewEmployee({ ...newEmployee, managerName: e.target.value })
							}
						/>
						<input
							type='text'
							placeholder='Previous Organization
'
							value={newEmployee.managerName}
							onChange={(e) =>
								setNewEmployee({ ...newEmployee, managerName: e.target.value })
							}
						/>
						<input
							type='text'
							placeholder='From & To Date

'
							value={newEmployee.managerName}
							onChange={(e) =>
								setNewEmployee({ ...newEmployee, managerName: e.target.value })
							}
						/>
						<input
							type='text'
							placeholder='Total Experience
'
							value={newEmployee.managerName}
							onChange={(e) =>
								setNewEmployee({ ...newEmployee, managerName: e.target.value })
							}
						/>
						<input
							type='text'
							placeholder='L+1 Name (Manager Name)'
							value={newEmployee.managerName}
							onChange={(e) =>
								setNewEmployee({ ...newEmployee, managerName: e.target.value })
							}
						/>
						<input
							type='text'
							placeholder='Education qualification
'
							value={newEmployee.managerName}
							onChange={(e) =>
								setNewEmployee({ ...newEmployee, managerName: e.target.value })
							}
						/>
						<input
							type='text'
							placeholder='University
'
							value={newEmployee.managerName}
							onChange={(e) =>
								setNewEmployee({ ...newEmployee, managerName: e.target.value })
							}
						/>
						<input
							type='text'
							placeholder='Month & Year of passing
'
							value={newEmployee.managerName}
							onChange={(e) =>
								setNewEmployee({ ...newEmployee, managerName: e.target.value })
							}
						/>
						<input
							type='text'
							placeholder='Certifications
'
							value={newEmployee.managerName}
							onChange={(e) =>
								setNewEmployee({ ...newEmployee, managerName: e.target.value })
							}
						/>
						<input
							type='text'
							placeholder='Name of certification

'
							value={newEmployee.managerName}
							onChange={(e) =>
								setNewEmployee({ ...newEmployee, managerName: e.target.value })
							}
						/>
						<input
							type='text'
							placeholder='Institute


'
							value={newEmployee.managerName}
							onChange={(e) =>
								setNewEmployee({ ...newEmployee, managerName: e.target.value })
							}
						/>
						<input
							type='text'
							placeholder='Completion date



'
							value={newEmployee.managerName}
							onChange={(e) =>
								setNewEmployee({ ...newEmployee, managerName: e.target.value })
							}
						/>
						{/* More fields */}
						{/* Add fields for all remaining data like employee status, reason for leaving, PAN, etc. */}
						<div id='modal-div'>
							<button onClick={handleCreateEmployee}>Create</button>
							<button onClick={() => setShowEmployeeForm(false)}>Cancel</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default DashboardSection;
