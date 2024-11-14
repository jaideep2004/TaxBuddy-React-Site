import React from "react";
import "./section7.css";
const Section7 = () => {
	const boxStyle = {
		backgroundImage: `url(${'./images/s13.png'})`,
	}
	return (
		<div className='tax-section7'>
			<div className='tax-section7-wrap'>
				<div className='tax-section7-left'>
					<div className='tax-section7-head'>
						<h1>Register Today !</h1>
						<p>
							97.4% of our users do not receive a tax notice. But if you do, we
							will take care of it without any additional cost.{" "}
						</p>
					</div>

					<form action='' className='tax-section7-form'>
						<label htmlFor='name'>Name</label>
						<input type='text' id='name' name='name' />
						<div className='mob-form-cont'>
							<div>
								<label htmlFor='mobile'>Mobile No</label>
								<input type='text' id='mobile' name='mobile' />
							</div>
							<div>
								<label htmlFor='emailid'>Email</label>
								<input type='text' id='emailid' name='emailid' />
							</div>
						</div>

						<label htmlFor='message'>Message</label>
						<input type='text' id='message' name='message' />

						<button className='tax-form-btn'>Register</button>
					</form>
				</div>
				<div className='tax-section7-right' style={boxStyle}>
					<img src='./images/s8.png' alt='' />
				</div>
			</div>
		</div>
	);
};

export default Section7;
