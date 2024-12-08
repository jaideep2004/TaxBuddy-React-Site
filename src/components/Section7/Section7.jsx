import React from "react";
import "./section7.css";
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";
const Section7 = () => {
	useEffect(() => {
		window.scrollTo({ top: 0, behavior: "smooth" });
		AOS.init();
	}, []);
	return (
		<div className='tax-section7'>
			<div className='tax-section7-wrap'>
				<div className='tax-section7-left'>
					<img src='./images/sec7img.png' alt='' data-aos='fade-right'
				data-aos-duration='800' />
					<div className="tax7-center">
						<p className="p-tag2">WORKING AREAS</p>
						<h1>Industries that we served nationwide</h1>
						<div className='tax7-list'>
							<p>
								Taxation is the cornerstone of a functioning society, enabling
								governments to fund essential services such as healthcare,
								education, infrastructure, and public safety. Through various
								forms of taxes—such as income tax, corporate tax, and sales tax.
							</p>
							<div className='tax-7list-con'>
								<ul>
									<li>
										<i class='fa-regular fa-circle-check fa-lg'></i>On-demand
										tax support
									</li>
									<li>
										<i class='fa-regular fa-circle-check fa-lg'></i>Your
										personal tax expert
									</li>
									<li>
										<i class='fa-regular fa-circle-check fa-lg'></i>Guaranteed
										accuracy
									</li>
									<li>
										<i class='fa-regular fa-circle-check fa-lg'></i>Guaranteed
										accuracy
									</li>
								</ul>
								<ul>
									<li>
										<i class='fa-regular fa-circle-check fa-lg'></i>On-demand
										tax support
									</li>
									<li>
										<i class='fa-regular fa-circle-check fa-lg'></i>Your
										personal tax expert
									</li>
									<li>
										<i class='fa-regular fa-circle-check fa-lg'></i>Guaranteed
										accuracy
									</li>
									<li>
										<i class='fa-regular fa-circle-check fa-lg'></i>Guaranteed
										accuracy
									</li>
								</ul>
							</div>
							<button className='tax5-btn' data-aos='fade-up'
				data-aos-duration='800'>
								View All Industries <i class='fa-solid fa-arrow-right'></i>{" "}
							</button>
						</div>
					</div>
				</div>
				<div className='tax-section7-right'>
					<img src='./images/sec7img2.png' alt=''data-aos='fade-left'
				data-aos-duration='800' />
				</div>
			</div>
		</div>
	);
};

export default Section7;
