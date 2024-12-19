import React from "react";

const TestCard = (props) => {
    const { name,img ,desc} = props;
	return (
		<div className='tax-section8-wrap'>
			<div className='tax-section8-left'>
				<img src={img} alt='' />
			</div>
			<div className='tax-section8-right'>
				<p>
                    {desc}
                </p>
                <h4>{name}</h4>
			</div>
		</div>
	);
};

export default TestCard;
