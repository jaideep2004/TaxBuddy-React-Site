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
		backgroundImage: `url(${"./images/hero4.png"})`,
	};

	return (
		<>
			<section id='test-section1'>
				<div className='container1'>
					<div className='parent-div1'>
						<div className='child-div'>
							<p>1</p>
						</div>
						<div className='child-div'>
							<p>2</p>
						</div>
						<div className='child-div'>
							<p>3</p>
						</div>
					</div>
				</div>
			</section>
		</>
	);
};

export default Section1;
