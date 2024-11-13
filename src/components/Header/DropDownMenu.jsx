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
