import React, { useState,useEffect } from "react";
import "./header.css";
import { NavLink } from "react-router-dom";
import DropDownMenu from "./DropDownMenu";
import HomeDropdown from "./HomeDropdown";

const Header = ({ changeTheme }) => {
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
	const [theme, setTheme] = useState("theme1");

	const handleChangeTheme = (themeName) => {
		setTheme(themeName);
		applyTheme(colorThemes[themeName]);
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
					<div className='tax-logo'>
						<div>
							<i class='fa-solid fa-money-bills'></i>
							Tax<span>Harbor</span>
						</div>
					</div>
				</NavLink>
				<div className='tax-nav-wrap'>
					<nav className='tax-top-nav'>
						<NavLink
							to='/'
							end
							className={({ isActive }) => (isActive ? "active" : "")}
							onMouseEnter={handleMouseEnter}
							onMouseLeave={handleMouseLeave}>
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
						{/* <NavLink
							to='/services'
							className={({ isActive }) => (isActive ? "active" : "")}>
							Services
							<i class='fa-solid fa-caret-down'></i>
						</NavLink> */}
						<NavLink
							to='/services'
							className={({ isActive }) => (isActive ? "active" : "")}>
							Industries
							<i class='fa-solid fa-caret-down'></i>
						</NavLink>
						<NavLink
							to='/services'
							className={({ isActive }) => (isActive ? "active" : "")}>
							Case Studies
							<i class='fa-solid fa-caret-down'></i>
						</NavLink>
						<NavLink
							to='/contact'
							className={({ isActive }) => (isActive ? "active" : "")}>
							Contact Us
						</NavLink>
					</nav>
				</div>
				<div className='tax-header-btn'>
					<button className='tax5-btn'>
						Start Filing <i class='fa-solid fa-arrow-right'></i>{" "}
					</button>
				</div>
			</div>
		</header>
	);
};

export default Header;
