import React, { useState, useEffect } from "react";
import "./header.css";
import { NavLink, matchRoutes } from "react-router-dom";
import DropDownMenu from "./DropDownMenu";
import HomeDropdown from "./HomeDropdown";

const routes = [{ path: "/" }, { path: "/services/:serviceId" }];
const Header = ({ changeTheme }) => {
	const isWhiteLinks = matchRoutes(routes, window.location.pathname) !== null;
	const [isDropdownVisible, setIsDropdownVisible] = useState(false);
	let dropdownTimeout;
	const [isScrolled, setIsScrolled] = useState(false);

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

	useEffect(() => {
		const handleScroll = () => {
			if (window.scrollY > 50) {
				setIsScrolled(true);
			} else {
				setIsScrolled(false);
			}
		};
		window.addEventListener("scroll", handleScroll);
		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, []);
	return (
		<header className={`tax-header ${isScrolled ? "scrolled" : ""}`}>
			<div className='tax-header-wrap'>
				<NavLink to='/'>
					<div
						className={`tax-logo ${
							isWhiteLinks ? "white-logo" : "primary-logo"
						}`}>
						<div>
							<i class='fa-solid fa-money-bills'></i>
							TAX<span>HARBOR</span>
						</div>
					</div>
				</NavLink>
				<div className='tax-nav-wrap'>
					<nav className='tax-top-nav'>
						<NavLink
							to='/'
							end
							className={({ isActive }) =>
								`nav-link ${isWhiteLinks ? "white-link" : "primary-link"} ${
									isActive ? "active" : ""
								}`
							}>
							Home
						</NavLink>

						<NavLink
							to='/services'
							className={({ isActive }) =>
								`nav-link ${isWhiteLinks ? "white-link" : "primary-link"} ${
									isActive ? "active" : ""
								}`
							}
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
						{/* <NavLink
							to='/services'
							className={({ isActive }) => (isActive ? "active" : "")}>
							Services
							<i class='fa-solid fa-caret-down'></i>
						</NavLink> */}
						<NavLink
							to='/services2'
							className={({ isActive }) =>
								`nav-link ${isWhiteLinks ? "white-link" : "primary-link"} ${
									isActive ? "active" : ""
								}`
							}>
							Resources
							<i class='fa-solid fa-caret-down'></i>
						</NavLink>

						<NavLink
							to='/contact'
							className={({ isActive }) =>
								`nav-link ${isWhiteLinks ? "white-link" : "primary-link"} ${
									isActive ? "active" : ""
								}`
							}>
							Our Story
						</NavLink>
					</nav>
				</div>
				<NavLink to='/customers/login'>
					<div className='tax-header-btn'>
						<button className='tax5-btn'>
							Register Today <i class='fa-solid fa-arrow-right'></i>{" "}
						</button>
					</div>
				</NavLink>
			</div>
		</header>
	);
};

export default Header;
