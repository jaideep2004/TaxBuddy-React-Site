// import React from "react";
// import "./section3.css";
// import TaxFlipbox from "../FlipboxSection/TaxFlipbox";
// import AOS from "aos";
// import "aos/dist/aos.css";
// import { useEffect } from "react";

// const Section3 = () => {
// 	useEffect(() => {
// 		window.scrollTo({ top: 0, behavior: "smooth" });
// 		AOS.init();
// 	}, []);
// 	return (
// 		<div className='tax-section3'>
// 			<div className='tax-section3-wrap'>
// 				<div className='tax-section3-left' data-aos='fade-right'
// 				data-aos-duration='800'>
// 					<div className='tax3left-flipwrap'>
// 						<TaxFlipbox
// 							title='Corporate & Tax Accounting'
// 							content='Our team of tax professionals is always ready to help you with any
// 							queries or concerns you may have.'
// 							icon='fa-solid fa-users fa-2xl'
// 						/>
// 						<TaxFlipbox
// 							title='Accounting System Setup'
// 							content='Your data security is our top priority. Rest assured, your
// 							information is encrypted and protected.'
// 							icon='fa-solid fa-rocket fa-2xl'
// 						/>
// 					</div>

// 					<div className='tax3-left-btn'>View All Services</div>
// 				</div>
// 				<div className='tax-section3-right'data-aos='fade-left'
// 				data-aos-duration='800'>
// 					<p>SERVICES</p>
// 					<h1>
// 						Our accounting services <br /> breakdown
// 					</h1>
// 					<div className='tax3right-flipwrap'>
// 						<TaxFlipbox
// 							title='Timely Filing'
// 							content='Our team of tax professionals is always ready to help you with any
// 							queries or concerns you may have.'
// 							icon='fa-solid fa-shapes fa-2xl'
// 						/>
// 						<TaxFlipbox
// 							title='Expert Assistance'
// 							content='Our team of tax professionals is always ready to help you with any
// 							queries or concerns you may have.'
// 							icon='fa-solid fa-vector-square fa-2xl'
// 						/>
// 					</div>
// 				</div>
// 			</div>
// 		</div>
// 	);
// };

// export default Section3;

import React from "react";
import "./section3.css";
import TaxFlipbox from "../FlipboxSection/TaxFlipbox";
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";
const Section3 = () => {
	useEffect(() => {
		window.scrollTo({ top: 0, behavior: "smooth" });
		AOS.init();
	}, []);
	return (
		<div id='tax-section3'>
			{/* <p className='p-tag2' data-aos='fade-down' data-aos-duration='800'>
				SERVICES
			</p> */}
			<h1 data-aos='fade-down' data-aos-duration='800'>
				Our Services
			</h1>
			<div className='tax-section3-wrap'>
				<div
					className='tax-section3-card rotate-up'
					data-aos='fade-up'
					data-aos-duration='850'>
					<img src='./images/Individualtax.jpeg' alt='' />
					<div className='tax3-card-desc'>
						<h2>Individual Tax</h2>
						<p>
							Lorem ipsum dolor sit amet, consectetur adipisicing elit. Lorem
							ipsum dolor sit amet, consectetur adipisicing elit.{" "}
						</p>
						<a href=''>
							View Detail <i class='fa-solid fa-circle-arrow-right fa-xl'></i>{" "}
						</a>
					</div>
				</div>
				<div
					className='tax-section3-card rotate-up2'
					data-aos='fade-up'
					data-aos-duration='850'>
					<img src='./images/business2.jpeg' alt='' />
					<div className='tax3-card-desc'>
						<h2>Business Tax</h2>
						<p>
							Lorem ipsum dolor sit amet, consectetur adipisicing elit. Lorem
							ipsum dolor sit amet, consectetur adipisicing elit.{" "}
						</p>
						<a href=''>
							View Detail <i class='fa-solid fa-circle-arrow-right fa-xl'></i>{" "}
						</a>
					</div>
					
				</div>
				<div
					className='tax-section3-card rotate-up'
					data-aos='fade-up'
					data-aos-duration='900'>
					<img src='./images/accounting.jpeg' alt='' />
					<div className='tax3-card-desc'>
						<h2>Accounting</h2>
						<p>
							Lorem ipsum dolor sit amet, consectetur adipisicing elit. Lorem
							ipsum dolor sit amet, consectetur adipisicing elit.{" "}
						</p>
						<a href=''>
							View Detail <i class='fa-solid fa-circle-arrow-right fa-xl'></i>{" "}
						</a>
					</div>
				</div>
				<div
					className='tax-section3-card rotate-up2'
					data-aos='fade-up'
					data-aos-duration='900'>
					<img src='./images/taxincorporation.jpeg' alt='' />
					<div className='tax3-card-desc'>
						<h2>Incorporation</h2>
						<p>
							Lorem ipsum dolor sit amet, consectetur adipisicing elit. Lorem
							ipsum dolor sit amet, consectetur adipisicing elit.{" "}
						</p>
						<a href=''>
							View Detail <i class='fa-solid fa-circle-arrow-right fa-xl'></i>{" "}
						</a>
					</div>
					
				</div>
			</div>
		</div>
	);
};

export default Section3;
