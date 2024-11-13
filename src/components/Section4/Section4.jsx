import React from "react";
import "./section4.css";

const Section4 = () => {
	return (
		<div className='tax-section4'>
			<div className='tax-section4-wrap'>
				<div className='tax-section4-left'>
					<img src='./images/s5.png' alt='' />
				</div>
				<div className='tax-section4-right'>
					<h1>Reduce your tax liability up to 26%</h1>
					<div className='tax4-list'>
						<ul>
							<li>
								<i class='fa-solid fa-circle-check fa-lg'></i>On-demand tax
								support
							</li>
							<li>
								<i class='fa-solid fa-circle-check fa-lg'></i>Your personal tax
								expert
							</li>
							<li>
								<i class='fa-solid fa-circle-check fa-lg'></i>Guaranteed
								accuracy
							</li>
						</ul>
					</div>
					<div className='tax-section4-input'>
						<input type='text' placeholder='Enter your Mobile Number' />
						<button>Start Filing</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Section4;
