import React from "react";
import "./section8.css";
import { useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";

const Section8 = () => {
	useEffect(() => {
		window.scrollTo({ top: 0, behavior: "smooth" });
		AOS.init();
	}, []);
	const [value, setValue] = useState(1000); // Default value for the range slider

	const handleChange = (event) => {
		setValue(event.target.value); // Update the state when slider changes
	};
	return (
		<div className='tax-section8'>
			<div className='tax8-video'>
				<video
					src='https://themes.envytheme.com/fint/wp-content/uploads/2024/01/lookbook.m4v'
					autoPlay
					muted
					loop></video>
			</div>
			<div className='tax-section8-wrap'>
				<div className='tax-section8-left' data-aos='fade-right'
				data-aos-duration='800'>
					<p className='p-tag2'>SCHEDULE AN INTRO CALL</p>
					<h1>Your integrated finance team is just a call away</h1>
					<p>
						Taxation is the cornerstone of a functioning society, enabling
						governments to fund essential services such as healthcare,
						education, infrastructure, and public safety.
					</p>
					<h2>
						During your 30-minute call, our financial expert will determine
						whether we’re a great mutual fit by learning:
					</h2>
					<div className='tax-8list-con'>
						<ul>
							<li>
								<i class='fa-regular fa-circle-check fa-lg'></i>On-demand tax
								support
							</li>
							<li>
								<i class='fa-regular fa-circle-check fa-lg'></i>Your personal
								tax expert
							</li>
							<li>
								<i class='fa-regular fa-circle-check fa-lg'></i>Guaranteed
								accuracy
							</li>
							<li>
								<i class='fa-regular fa-circle-check fa-lg'></i>Guaranteed
								accuracy
							</li>
						</ul>
					</div>
				</div>
				<div className='tax-section8-right2'>
					<h2>Let’s get started!</h2>
					<p>
						Please reach out using the form below and we'll get back to you
						right away!
					</p>
					<form action=''>
						<div className='fdiv'>
							<input type='text' placeholder='Enter Your Name' />
							<input type='email' placeholder='Enter Your Email' />
						</div>

						<label htmlFor=''>How Can We Help You?</label>
						<select name='tax-8select' id=''>
							<option value=''>Submit Tax File</option>
							<option value=''>Submit Tax File</option>
							<option value=''>Submit Tax File</option>
						</select>
						<label htmlFor=''>Is your business incorporated?</label>
						<select name='tax-8select' id=''>
							<option value=''>Yes</option>
							<option value=''>No</option>
						</select>
						<label htmlFor=''>What's Your Annual Revenue?</label>
						<input
							id='rangeInput'
							type='range'
							min='1000'
							max='100000'
							step='1'
							value={value}
							onChange={handleChange}
						/>
						<p>${value}</p>
						<button className='tax5-btn'>
							Submit Now <i class='fa-solid fa-arrow-right'></i>{" "}
						</button>
					</form>
				</div>
			</div>
		</div>
	);
};

export default Section8;
