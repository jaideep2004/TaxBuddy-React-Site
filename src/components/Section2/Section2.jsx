import React from "react";
import "./section2.css";
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";

const Section2 = () => {
	useEffect(() => {
		window.scrollTo({ top: 0, behavior: "smooth" });
		AOS.init();
	}, []);
	return (
		<div className='tax-section2'>
			<div className='tax-section2-wrap'>
                <div className='tax-section2-left' data-aos='fade-right'
				data-aos-duration='800'>
                    <p>ABOUT TAXHARBOR</p>
					<h1>
						We’re not your typical CPA firm, we’re an outsourced accounting
						service
					</h1>
					<p>
						Taxation is the cornerstone of a functioning society, enabling
						governments to fund essential services such as healthcare,
						education, infrastructure, and public safety.
					</p>
					<div className='tax2-list'>
						<ul>
							<li>
								<i class='fa-regular fa-circle-check fa-lg'></i>On-demand tax
								support
							</li>
							<li>
								<i class='fa-regular fa-circle-check fa-lg'></i>Your personal
								tax expert
							</li>
							<li>
								<i class='fa-regular fa-circle-check fa-lg'></i>Guaranteed
								accuracy
							</li>
						</ul>
					</div>
					<div className='tax-section2-input'>
					<button className='tax5-btn'>
								More About Us <i class='fa-solid fa-arrow-right'></i>{" "}
							</button>
					</div>
				</div>
				<div className='tax-section2-right'>
					<div className='section-2-rotate'>
						<h2>15+ Years</h2>
						<p>Of Proven Exprience</p>
					</div>
					<video
						src='https://themes.envytheme.com/fint/wp-content/uploads/2024/01/about-video.m4v'
						
						autoPlay
						muted
						loop
						
						></video>
				</div>
			</div>
		</div>
	);
};

export default Section2;
