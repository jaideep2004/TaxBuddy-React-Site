import React from "react";
import "./section12.css";
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";
const Section12 = () => {
	useEffect(() => {
		window.scrollTo({ top: 0, behavior: "smooth" });
		AOS.init();
	}, []);
	return (
		<div className='tax-section12'>
			<div className='tax-section12-wrap'>
				<div className='tax-12overlay'></div>
				<h1 data-aos='fade-down'
				data-aos-duration='800'>Need any assistance? Contact us</h1>
				<p>
					The first step to hassle-free accounting, tax returns, and tax
					planning starts by reaching out to one of our representatives.
				</p>
				<button className='tax5-btn'>
					Ask A Question <i class='fa-solid fa-arrow-right'></i>{" "}
				</button>
			</div>
		</div>
	);
};

export default Section12;
