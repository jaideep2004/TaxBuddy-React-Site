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

	// Filter and sorting state
	const [searchTerm, setSearchTerm] = useState("");
	const [filterOption, setFilterOption] = useState("newest");
	const [columnFilter, setColumnFilter] = useState({
		name: "",
		description: "",
		price: "",
	});
	const [filterCriteria, setFilterCriteria] = useState("name"); // Filter criteria (name, description, price)

	// Filtered Services based on column filters and search term
	const filteredServices = [...services]
		.filter((service) => {
			const lowerSearchTerm = searchTerm.toLowerCase();
			return (
				service.name.toLowerCase().includes(lowerSearchTerm) ||
				service.description.toLowerCase().includes(lowerSearchTerm)
			);
		})
		.filter((service) => {
			return (
				(columnFilter.name === "" ||
					service.name
						.toLowerCase()
						.includes(columnFilter.name.toLowerCase())) &&
				(columnFilter.description === "" ||
					service.description
						.toLowerCase()
						.includes(columnFilter.description.toLowerCase())) &&
				(columnFilter.price === "" ||
					service.price.toString().includes(columnFilter.price))
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

	return (
		<div className='tax-dashboard-services'>
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
					<option value='description'>Filter by Description</option>
					<option value='price'>Filter by Price</option>
				</select>

				{/* Search Input for the Filter Criteria */}

				{/* Sorting Dropdown */}
				{/* <select
          value={filterOption}
          onChange={(e) => setFilterOption(e.target.value)}
        >
          <option value="newest">Newest</option>
          <option value="alphabetical">Alphabetically</option>
        </select> */}
			</div>

			<table>
				<thead>
					<tr>
						<th>Service ID</th>
						<th>Date</th>
						<th>Name</th>
						<th>Description</th>
						<th>Price</th>
						<th>Actions</th>
					</tr>
				</thead>
				<tbody>
					{filteredServices.map((service) => (
						<tr key={service._id}>
							<td>{service._id}</td>
							<td>
								{service.createdAt
									? new Date(service.createdAt).toLocaleDateString("en-GB")
									: "Not available"}
							</td>
							<td>{service.name}</td>
							<td>{service.description || "No description"}</td>
							<td>{service.price ? `$${service.price}` : "N/A"}</td>
							<td className='tax-btn-cont'>
								<button
									className='tax-service-btn'
									onClick={() => setEditingService(service)}>
									Update
								</button>

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
