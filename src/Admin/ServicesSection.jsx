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
	const [dateFilter, setDateFilter] = useState({ fromDate: "", toDate: "" });
	const [filterCriteria, setFilterCriteria] = useState("name"); // Filter criteria (name, id)

	// Helper function to normalize time to midnight for accurate date comparisons
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

	// Filtered Services based on column filters and search term
	const filteredServices = [...services]
		.filter((service) => {
			const lowerSearchTerm = searchTerm.toLowerCase();
			return (
				service.name.toLowerCase().includes(lowerSearchTerm) ||
				service._id.toLowerCase().includes(lowerSearchTerm)
			);
		})
		.filter((service) => {
			// Filtering by date range if set
			const serviceDate = new Date(service.createdAt);
			const fromDate = dateFilter.fromDate
				? normalizeDate(dateFilter.fromDate)
				: null;
			const toDate = dateFilter.toDate
				? normalizeDate(dateFilter.toDate)
				: null;

			return (
				(fromDate === null || serviceDate >= fromDate) &&
				(toDate === null || serviceDate <= toDate)
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
				<select
					value={filterCriteria}
					onChange={(e) => setFilterCriteria(e.target.value)}>
					<option value='name'>Filter by Name</option>
					<option value='id'>Filter by ID</option>
				</select>
				<input
					type='text'
					placeholder={`Search by ${
						filterCriteria.charAt(0).toUpperCase() + filterCriteria.slice(1)
					}`}
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
				/>
				{/* Dropdown to Select Filter Criteria */}

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
						<th>Service ID</th>
						<th>Date</th>
						<th>Name</th>
						<th>Price</th>
						<th>HSN Code</th> {/* New column for HSN Code */}
						<th>Actions</th>
					</tr>
				</thead>
				<tbody>
					{filteredServices.map((service) => (
						<tr key={service._id}>
							<td>{service._id}</td>
							<td>
								{service.createdAt
									? formatDate(service.createdAt) // Using formatDate function here
									: "Not available"}
							</td>
							<td>{service.name}</td>
							<td>
								₹{service.salePrice} <br />
								<span style={{ textDecoration: "line-through" }}>
									₹{service.actualPrice}
								</span>
							</td>
							<td>{service.hsncode || "No HSN Code"}</td>{" "}
							{/* Display HSN Code */}
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

			{/* Form for editing an existing service */}
			{editingService && (
				<div className='smodal'>
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
						placeholder='Actual Service Price'
						value={editingService.actualPrice}
						onChange={(e) =>
							setEditingService({
								...editingService,
								actualPrice: parseFloat(e.target.value) || 0,
							})
						}
					/>
					<input
						type='number'
						placeholder='Sale Service Price'
						value={editingService.salePrice}
						onChange={(e) =>
							setEditingService({
								...editingService,
								salePrice: parseFloat(e.target.value) || 0,
							})
						}
					/>
					<input
						type='text'
						placeholder='HSN Code'
						value={editingService.hsncode}
						onChange={(e) =>
							setEditingService({
								...editingService,
								hsncode: e.target.value,
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
