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
		<div className='tax-section3'>
			<div className='tax-section3-wrap'>
				<div className='tax-section3-left' data-aos='fade-right'
				data-aos-duration='800'>
					<div className='tax3left-flipwrap'>
						<TaxFlipbox
							title='Corporate & Tax Accounting'
							content='Our team of tax professionals is always ready to help you with any
							queries or concerns you may have.'
							icon='fa-solid fa-users fa-2xl'
						/>
						<TaxFlipbox
							title='Accounting System Setup'
							content='Your data security is our top priority. Rest assured, your
							information is encrypted and protected.'
							icon='fa-solid fa-rocket fa-2xl'
						/>
					</div>

					<div className='tax3-left-btn'>View All Services</div>
				</div>
				<div className='tax-section3-right'data-aos='fade-left'
				data-aos-duration='800'>
					<p>SERVICES</p>
					<h1>
						Our accounting services <br /> breakdown
					</h1>
					<div className='tax3right-flipwrap'>
						<TaxFlipbox
							title='Timely Filing'
							content='Our team of tax professionals is always ready to help you with any
							queries or concerns you may have.'
							icon='fa-solid fa-shapes fa-2xl'
						/>
						<TaxFlipbox
							title='Expert Assistance'
							content='Our team of tax professionals is always ready to help you with any
							queries or concerns you may have.'
							icon='fa-solid fa-vector-square fa-2xl'
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Section3;
