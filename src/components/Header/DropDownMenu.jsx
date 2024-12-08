// import React, { useEffect, useState, useContext } from "react";
// import { NavLink } from "react-router-dom";
// import axios from "../../Admin/utils/axiosConfig";
// import { AdminDashboardContext } from "../../Admin/AdminDashboardContext";
// import "./dropdown.css";

// const DropDownMenu = () => {
// 	const { services, setServices } = useContext(AdminDashboardContext);

// 	// Fetch services from backend
// 	useEffect(() => {
// 		const fetchServices = async () => {
// 			try {
// 				const response = await axios.get(
// 					"http://localhost:5000/api/customers/user-services"
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
// 					</NavLink>
// 				))}
// 			</div>
// 		</div>
// 	);
// };

// export default DropDownMenu;

import React, { useEffect, useContext } from "react";
import { NavLink } from "react-router-dom";
import axios from "../../Admin/utils/axiosConfig";
import { AdminDashboardContext } from "../../Admin/AdminDashboardContext";
import "./dropdown.css";

const DropDownMenu = () => {
    const { services, setServices } = useContext(AdminDashboardContext);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/customers/user-services");
                setServices(response.data.services); // Assuming backend returns { services: [...] }
            } catch (error) {
                console.error("Failed to fetch services:", error);
            }
        };
        fetchServices();
    }, [setServices]);

    return (
        <div className="dropdown-menu">
            <div className="dropdown-column">
                {services.map((service) => (
                    <NavLink
                        to={`/services/${service._id}`}
                        className="dropdown-link"
                        key={service._id}>
                        {service.name} <i className="fa-solid fa-angle-right"></i>
                    </NavLink>
                ))}
            </div>
        </div>
    );
};

export default DropDownMenu;
