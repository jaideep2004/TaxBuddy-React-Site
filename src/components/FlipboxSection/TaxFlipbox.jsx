import React, { useState } from "react";
import "./taxflipbox.css";

const TaxFlipbox = ({ title, content, icon }) => {
	const [isFlipped, setIsFlipped] = useState(false);

	const handleMouseEnter = () => {
		setIsFlipped(true);
	};

	const handleMouseLeave = () => {
		setIsFlipped(false);
	};
	return (
		<div
			className='flip-box'
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}>
			<div className={`flip-box-inner ${isFlipped ? "flipped" : ""}`}>
				<div className='flip-box-front'>
					<i class={`icon ${icon}`} aria-hidden='true'></i>
					<h2>{title}</h2>
				</div>
				<div className='flip-box-back'>
					<i class={`icon ${icon}`} aria-hidden='true'></i>
					<p>{content}</p>
				</div>
			</div>
		</div>
	);
};

export default TaxFlipbox;
