import React, { useContext, useState } from "react";
import { AdminDashboardContext } from "./AdminDashboardContext";

const ServicesSection = () => {
	const [showServiceForm, setShowServiceForm] = useState(false);
	const {
		services,
		newService,
		setNewService,
		handleCreateService,
		handleUpdateService,
		handleDeleteService,
	} = useContext(AdminDashboardContext);
	const [editingService, setEditingService] = useState(null);

	return (
		<div className='tax-dashboard-services'>
			<h2>Services</h2>
			<table>
				<thead>
					<tr>
						<th>Service ID</th>
						<th>Name</th>
						<th>Description</th>
						<th>Price</th>
						<th>Actions</th>
					</tr>
				</thead>
				<tbody>
					{services.map((service) => (
						<tr key={service._id}>
							<td>{service._id}</td>
							<td>{service.name}</td>
							<td>{service.description || "No description"}</td>{" "}
							{/* Fallback if description is missing */}
							<td>{service.price ? `$${service.price}` : "N/A"}</td>{" "}
							{/* Fallback if price is missing */}
							<td className='tax-btn-cont'>
								{/* Update Button */}
								<button
									className='tax-service-btn'
									onClick={() => setEditingService(service)}>
									Update
								</button>

								{/* Delete Button */}
								<button
									className='serviceDelete'
									onClick={() => handleDeleteService(service._id)}>
									Delete
								</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>

			{/* Form for adding a new service */}
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
						<button onClick={handleCreateService}>Create</button>
						<button onClick={() => setShowServiceForm(false)}>Cancel</button>
					</div>
				</div>
			)}

			{/* Form for editing an existing service */}
			{editingService && (
				<div className='modal'>
					<h3>Edit Service</h3>
					<input
						type='text'
						placeholder='Service Name'
						value={editingService.name}
						onChange={(e) =>
							setEditingService({ ...editingService, name: e.target.value })
						}
					/>
					<input
						type='text'
						placeholder='Service Description'
						value={editingService.description}
						onChange={(e) =>
							setEditingService({
								...editingService,
								description: e.target.value,
							})
						}
					/>
					<input
						type='number'
						placeholder='Service Price'
						value={editingService.price}
						onChange={(e) =>
							setEditingService({
								...editingService,
								price: parseFloat(e.target.value) || 0,
							})
						}
					/>
					<div id='modal-div'>
						<button
							onClick={() => {
								handleUpdateService(editingService);
								setEditingService(null); // Close modal after update
							}}>
							Update
						</button>
						<button onClick={() => setEditingService(null)}>Cancel</button>
					</div>
				</div>
			)}

			<button
				style={{ marginTop: "20px" }}
				className='tax-service-btn'
				onClick={() => setShowServiceForm(true)}>
				Add Service
			</button>
		</div>
	);
};

export default ServicesSection;
