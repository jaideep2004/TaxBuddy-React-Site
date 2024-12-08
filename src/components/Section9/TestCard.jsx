import React from "react";

const TestCard = (props) => {
	const { heading, img, desc } = props;
	return (
		<div className='tax-section9test-wrap'>
			<div className='tax-section9-left'></div>
			<div className='tax-section9-right'>
				<div>
					<div>
						<i class='fa-solid fa-quote-right fa-2xl'></i>
					</div>

					<div>
						<i class='fa-solid fa-star'></i>
						<i class='fa-solid fa-star'></i>
						<i class='fa-solid fa-star'></i>
						<i class='fa-solid fa-star'></i>
					</div>
				</div>

				{/* <h4>{heading}</h4> */}
				<p>{desc}</p>
				<div className='test9img'>
					<img src={img} alt='' />
					<p>
						Person1 <br />
						<span>Description</span>
					</p>
				</div>
			</div>
		</div>
	);
};

export default TestCard;
