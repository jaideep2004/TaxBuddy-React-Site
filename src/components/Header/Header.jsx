import React, { useState } from "react";
import "./header.css";
import { NavLink } from "react-router-dom";
import DropDownMenu from "./DropDownMenu";

const Header = () => {
	const [isDropdownVisible, setIsDropdownVisible] = useState(false);
	let dropdownTimeout;

	const handleMouseEnter = () => {
		clearTimeout(dropdownTimeout);
		dropdownTimeout = setTimeout(() => {
			setIsDropdownVisible(true);
		}, 200); // Delay before showing the dropdown (200ms)
	};

	const handleMouseLeave = () => {
		clearTimeout(dropdownTimeout);
		dropdownTimeout = setTimeout(() => {
			setIsDropdownVisible(false);
		}, 200); // Delay before hiding the dropdown (200ms)
	};
	return (
		<header className='tax-header'>
			<div className='tax-header-wrap'>
				<div className='tax-logo'>
					{/* <img src='./images/logo.webp' alt='' /> */}
					<div>
						Tax<span>Harbor</span>
					</div>
				</div>
				<div className='tax-nav-wrap'>
					<nav className='tax-top-nav'>
						<NavLink
							to='/'
							end
							className={({ isActive }) => (isActive ? "active" : "")}>
							Home
						</NavLink>
						<NavLink
							to='/about'
							className={({ isActive }) => (isActive ? "active" : "")}>
							About Us
						</NavLink>
						<NavLink
							to='/services'
							className={({ isActive }) => (isActive ? "active" : "")}
							onMouseEnter={handleMouseEnter}
							onMouseLeave={handleMouseLeave}>
							Services
							<i class='fa-solid fa-caret-down'></i>
							{isDropdownVisible && (
								<div
									onMouseEnter={() => clearTimeout(dropdownTimeout)}
									onMouseLeave={handleMouseLeave}>
									<DropDownMenu />
								</div>
							)}
						</NavLink>
						<NavLink
							to='/contact'
							className={({ isActive }) => (isActive ? "active" : "")}>
							Contact Us
						</NavLink>
					</nav>
				</div>
				<div className='tax-header-btn'>
					<button>
						Login <i class='fa-solid fa-angle-right'></i>
					</button>
				</div>
			</div>
		</header>
	);
};

export default Header;
