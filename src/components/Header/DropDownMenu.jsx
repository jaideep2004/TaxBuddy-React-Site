import React from "react";
import { NavLink } from "react-router-dom";
import "./dropdown.css";

const DropDownMenu = () => {
	return (
		<div className='dropdown-menu'>
			<div className='dropdown-column'>
				<NavLink to='/service1' className='dropdown-link'>
					Service 1 <i class='fa-solid fa-angle-right'></i>
				</NavLink>
				<p>Lorem ipsum dolor sit amet </p>
				<NavLink to='/service2' className='dropdown-link'>
					Service 2 <i class="fa-solid fa-angle-right"></i>
				</NavLink>
				<p>Lorem ipsum dolor sit amet </p>
				<NavLink to='/service3' className='dropdown-link'>
					Service 3 <i class="fa-solid fa-angle-right"></i>
				</NavLink>
				<p>Lorem ipsum dolor sit amet </p>
				<NavLink to='/service4' className='dropdown-link'>
					Service 4 <i class="fa-solid fa-angle-right"></i>
				</NavLink>
				<p>Lorem ipsum dolor sit amet </p>
			</div>
			<div className='dropdown-column'>
				<NavLink to='/service5' className='dropdown-link'>
					Service 5 <i class="fa-solid fa-angle-right"></i>
				</NavLink>
				<p>Lorem ipsum dolor sit amet </p>
				<NavLink to='/service6' className='dropdown-link'>
					Service 6 <i class="fa-solid fa-angle-right"></i>
				</NavLink>
				<p>Lorem ipsum dolor sit amet </p>
				<NavLink to='/service7' className='dropdown-link'>
					Service 7 <i class="fa-solid fa-angle-right"></i>
				</NavLink>
				<p>Lorem ipsum dolor sit amet </p>
				<NavLink to='/service8' className='dropdown-link'>
					Service 8 <i class="fa-solid fa-angle-right"></i>
				</NavLink>
				<p>Lorem ipsum dolor sit amet </p>
			</div>
			<div className='dropdown-column'>
				<NavLink to='/service9' className='dropdown-link'>
					Service 9 <i class="fa-solid fa-angle-right"></i>
				</NavLink>
				<p>Lorem ipsum dolor sit amet </p>
				<NavLink to='/service10' className='dropdown-link'>
					Service 10 <i class="fa-solid fa-angle-right"></i>
				</NavLink>
				<p>Lorem ipsum dolor sit amet </p>
				<NavLink to='/service11' className='dropdown-link'>
					Service 11 <i class="fa-solid fa-angle-right"></i>
				</NavLink>
				<p>Lorem ipsum dolor sit amet </p>
				<NavLink to='/service12' className='dropdown-link'>
					Service 12 <i class="fa-solid fa-angle-right"></i>
				</NavLink>
				<p>Lorem ipsum dolor sit amet </p>
			</div>
		</div>
	);
};

export default DropDownMenu;

// import React, { useEffect, useState, useContext } from "react";
// import { NavLink } from "react-router-dom";
// import axios from "../../Admin/utils/axiosConfig";
// import { AdminDashboardContext } from "../../Admin/AdminDashboardContext";
// import "./dropdown.css";

// const DropDownMenu = () => {
// 	// const [services, setServices] = useState([]);
// 	const {
// 		services,
// 		newService,
// 		setNewService,
// 		handleCreateService,
// 		handleUpdateService,
// 		handleDeleteService,
// 	} = useContext(AdminDashboardContext);

// 	// Fetch services from backend
// 	useEffect(() => {
// 		const fetchServices = async () => {
// 			try {
// 				const response = await axios.get(
// 					"http://localhost:5000/api/admin/services"
// 				);
// 				setServices(response.data.services); // Assume backend returns { services: [...] }
// 			} catch (error) {
// 				console.error("Failed to fetch services:", error);
// 			}
// 		};
// 		fetchServices();
// 	}, []);

// 	return (
// 		<div className='dropdown-menu'>
// 			<div className='dropdown-column'>
// 				{services.map((service) => (
// 					<NavLink
// 						to={`/services/${service._id}`} // Dynamic route for each service
// 						className='dropdown-link'
// 						key={service._id}>
// 						{service.name} <i className='fa-solid fa-angle-right'></i>
// 						<p>{ser }</p>
// 					</NavLink>
// 				))}
// 			</div>
// 		</div>
// 	);
// };

// export default DropDownMenu;
