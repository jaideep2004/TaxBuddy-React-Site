import React from "react";
import "./section5.css";
const HexagonItem = ({ icon, title, color, className }) => {
	return (
		<div className={`hexagon-wrapper ${className}`}>
			<div className='hexagon-container'>
				<div className='hexagon'>
					<div className='hexagon-content'>
						{/* Render the icon based on the 'icon' prop */}
						{/* <i className={`fas fa-${icon} w-12 h-12 mb-3 ${color}`} /> */}
						<i className={`fa-solid fa-${icon} fa-2xl ${color}`} />
					</div>
				</div>
				<h3>{title}</h3>
			</div>
		</div>
	);
};

export default HexagonItem;
