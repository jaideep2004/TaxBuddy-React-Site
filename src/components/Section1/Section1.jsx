import React from "react";
import "./section1.css";
import { TypeAnimation } from "react-type-animation";
import Section2 from "../Section2/Section2";

const Section1 = () => {
	function ColoredText({ color, children }) {
		return <span style={{ color }}>{children}</span>;
	}

	return (
		<>
			<div className='tax-section1'>
				<div className='tax-section1-wrap'>
					<div className='tax-section1-left'>
						<h1>Assisted Tax filing platform for</h1>
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
						<p>4.9 ★ Google rating from 16,000+ reviews</p>
						<div className='tax-section1-input'>
							<input type='text' placeholder='Enter your Mobile Number' />
							<button>Start Filing</button>
						</div>
					</div>

					<div className='tax-section1-right'>
						<img src='./images/heroimg.png' alt='' />
					</div>
				</div>
            </div>
            
		</>
	);
};

export default Section1;
