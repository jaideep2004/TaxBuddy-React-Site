import React from "react";
import "./section10.css";
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";

const Section10 = () => {
	useEffect(() => {
		window.scrollTo({ top: 0, behavior: "smooth" });
		AOS.init();
	}, []);
	return (
		<div className='tax-section10'>
			<div className='tax-section10-wrap'>
				<div className='tax-section10-left'>
					<p className='p-tag2' data-aos='fade-down'
				data-aos-duration='800'>OUR TEAM</p>
					<h1 data-aos='fade-down'
				data-aos-duration='800'>
						Experienced team of <br /> accountants
					</h1>
					<div className='tax10-img-left'>
						<figure>
							<img src='./images/te1.jpg' alt='' />
							<figcaption>Person 1</figcaption>
							<p>Lorem ipsum dolor sit amet</p>
						</figure>

						<figure>
							<img src='./images/te2.jpg' alt='' />
							<figcaption>Person 2</figcaption>
							<p>Lorem ipsum dolor sit amet</p>
						</figure>
					</div>
				</div>
				<div className='tax-section10-right'>
					<div className='tax10-img-right'>
						<figure>
							<img src='./images/te3.jpg' alt='' />
							<figcaption>Person 2</figcaption>
							<p>Lorem ipsum dolor sit amet</p>
						</figure>
						<figure>
							<img src='./images/te4.jpg' alt='' />
							<figcaption>Person 2</figcaption>
							<p>Lorem ipsum dolor sit amet</p>
						</figure>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Section10;
