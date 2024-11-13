import React from "react";
import "./section6.css";

const Section6 = () => {
	return (
		<div className='tax-section6'>
			<div className='tax-section6-wrap'>
				<div className='tax-section6-left'>
					<img src='./images/s6.png' alt='' />
				</div>
                <div className='tax-section6-right'>
                    <h1>
                        About Us
                    </h1>
                    <p>
                        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Illo itaque quam ab eum laudantium ut quidem esse, ducimus culpa nesciunt nulla? Illum quasi culpa veniam quibusdam alias obcaecati voluptatem. Enim.
                    </p>
                    <p>
                        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Illo itaque quam ab eum laudantium ut quidem esse, ducimus culpa nesciunt nulla? Illum quasi culpa veniam quibusdam alias obcaecati voluptatem. Enim.
                    </p>
                    <div className='tax-section4-input'>
						<input type='text' placeholder='Enter your Mobile Number' />
						<button>Start Filing</button>
					</div>
                </div>
			</div>
		</div>
	);
};

export default Section6;
