import React from "react";
import "./section5.css";
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";

const Section5 = () => {
	useEffect(() => {
		window.scrollTo({ top: 0, behavior: "smooth" });
		AOS.init();
	}, []);
	return (
		<div id='tax-section5'>
			<div className='tax-section5-wrap'>
				<div className='tax-section5-left' data-aos='fade-left'
				data-aos-duration='800'>
					<div className='tax-section5-head'>
						<p className='p-tag2'>AWARDS</p>
						<h1>Unlock Financial Excellence With TaxHarbor Services!</h1>
						<div>
							<button className='tax5-btn'>
								Book A Free Consultation <i class='fa-solid fa-arrow-right'></i>{" "}
							</button>
							<button className='tax5-btn2'>
								<i class='fa-solid fa-phone fa-xl'></i> Free Call now
								<span>+1234567890</span>
							</button>
						</div>
					</div>
				</div>
				<div className='tax-section5-right'>
					<img src='./images/sec5.jpg' alt='' />
					{/* <img src='./images/sec7.jpg' alt='' /> */}
				</div>
			</div>
		</div>
	);
};

export default Section5;
