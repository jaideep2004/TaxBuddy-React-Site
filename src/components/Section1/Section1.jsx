import React from "react";
import "./section1.css";
import { TypeAnimation } from "react-type-animation";
import Section2 from "../Section2/Section2";
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";

const Section1 = () => {
	useEffect(() => {
		window.scrollTo({ top: 0, behavior: "smooth" });
		AOS.init();
	}, []);

	const boxStyle1 = {
		backgroundImage: `url(${"./images/hero6.jpg"})`,
		backgroundPosition:` 94% 70%`,
	};

	return (
		<div id='tax-section1'>
			<div className='tax-section1-wrap' style={boxStyle1}>
				<div className='tax-section1-right'>
					<p className='p-tag2'>WE'RE TAX CONSULTANT</p>
					<div
						className='head-wrap1'
						data-aos='fade-down'
						data-aos-duration='1000'>
						
						<h1>
							Assisted Tax Filing Platform <br /> For
						</h1>
					</div>
					<TypeAnimation
						sequence={[
							"Salaried taxpayers",
							1000,
							"Capital Gains taxation",
							1000,
							"Share Traders",
							1000,
							"Futures & options traders",
							1000,
							"Businessmen",
							1000,
						]}
						className='tax-type-animate'
						wrapper='span'
						speed={50}
						style={{ fontSize: "2em", display: "inline-block" }}
						repeat={Infinity}
						cursor={false}
					/>
					<p>
						Taxation is the cornerstone of a functioning society, enabling
						governments to fund essential services such as healthcare,
						education, infrastructure, and public safety.
					</p>
					<div className='tax-section1-input'>
						<button className='tax5-btn'>
							Schedule Free Call <i class='fa-solid fa-arrow-right'></i>{" "}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Section1;
