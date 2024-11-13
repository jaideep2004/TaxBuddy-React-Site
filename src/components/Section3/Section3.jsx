import React from "react";
import "./section3.css";
import { useInView } from "react-intersection-observer";
import CountUp from "react-countup";

const Section3 = () => {
	const { ref, inView } = useInView({
		triggerOnce: true, // Trigger only once
		threshold: 0.1, // Trigger when 50% of the element is in the view
	});
	return (
		<div className='tax-section3'>
			<div className='tax-section3wrap'>
				<div className='tax-section3-col'>
					<p>Users</p>
					<div className='tax-user' ref={ref}>
						<i class='fa-solid fa-user-group fa-xl'></i>
						{inView && (
							<h1>
								<CountUp start={0} end={1000000} duration={2} />+
							</h1>
						)}
					</div>
					<p>Users from 2600 towns trust TaxBuddy</p>
				</div>
				<div className='tax-section3-col'>
					<p>Impact</p>
					<div className='tax-user' ref={ref}>
						<i class='fa-solid fa-lightbulb fa-xl'></i>
						{inView && (
							<h1>
								<CountUp start={0} end={1000} duration={4} />
							</h1>
						)}
					</div>
					<p>That’s how many 1st time users save tax with TaxBuddy</p>
				</div>
				<div className='tax-section3-col'>
					<p>Founded</p>
					<div className='tax-user' ref={ref}>
						<i class='fa-solid fa-bolt fa-xl'></i>
						<h1>2017</h1>
					</div>
					<p>
						Led by a team of ex-IRS joint commissioners and accomplished CAs We
						are India's highest rated and most trusted assisted tax filing
						platform.
					</p>
				</div>
			</div>
		</div>
	);
};

export default Section3;
