import React from "react";

const TestCard = (props) => {
	const { heading, img, desc } = props;
	return (
		<div className='tax-section9test-wrap'>
			<div className='tax-section9-right'>
				

				{/* <h4>{heading}</h4> */}
				<img src={img} alt='' />
				<p>
					Person1 <br />
					<span>Description</span>
				</p>
				<p>{desc}</p>
			</div>
		</div>
	);
};

export default TestCard;
