import React, { useState } from "react";
import "./section9.css";

const Section9 = () => {
	const faqData = [
		{
			question: "Lorem ipsum dolor, sit amet consectetur adipisicing elit ",
			answer:
				"Lorem ipsum dolor, sit amet consectetur adipisicing elit. Vitae quae ea placeat necessitatibus tempore animi est, magni id cumque dicta fugiat similique sunt aut distinctio, a perspiciatis quod quaerat! placeat necessitatibus tempore animi est, magni id eos, cumque dicta fugiat similique sunt aut distinctio, a perspiciatis quod quaerat ",
		},
		{
			question: "Lorem ipsum dolor, sit amet consectetur adipisicing elit ",
			answer:
				"Lorem ipsum dolor, sit amet consectetur adipisicing elit. Vitae quae ea placeat necessitatibus tempore animi est, magni id cumque dicta fugiat similique sunt aut distinctio, a perspiciatis quod quaerat! placeat necessitatibus tempore animi est, magni id eos, cumque dicta fugiat similique sunt aut distinctio, a perspiciatis quod quaerat ",
		},
		{
			question: "Lorem ipsum dolor, sit amet consectetur adipisicing elit ",
			answer:
				"Lorem ipsum dolor, sit amet consectetur adipisicing elit. Vitae quae ea placeat necessitatibus tempore animi est, magni id cumque dicta fugiat similique sunt aut distinctio, a perspiciatis quod quaerat! placeat necessitatibus tempore animi est, magni id eos, cumque dicta fugiat similique sunt aut distinctio, a perspiciatis quod quaerat ",
		},
		{
			question: "Lorem ipsum dolor, sit amet consectetur adipisicing elit ",
			answer:
				"Lorem ipsum dolor, sit amet consectetur adipisicing elit. Vitae quae ea placeat necessitatibus tempore animi est, magni id cumque dicta fugiat similique sunt aut distinctio, a perspiciatis quod quaerat! placeat necessitatibus tempore animi est, magni id eos, cumque dicta fugiat similique sunt aut distinctio, a perspiciatis quod quaerat ",
		},
	];
	const [activeIndex, setActiveIndex] = useState(null);

	const toggleFAQ = (index) => {
		setActiveIndex(index === activeIndex ? null : index);
	};

	return (
		<div className='tax-section9'>
			<div className='faq-section-left'>
				<h1>Frequently Asked Questions</h1>
				<div className='faq-list'>
					{faqData.map((item, index) => (
						<div key={index} className='faq-item'>
							<div className='faq-question' onClick={() => toggleFAQ(index)}>
								<span>{item.question}</span>
								<i
									className={`fas ${
										activeIndex === index ? "fa-chevron-up" : "fa-chevron-down"
									}`}></i>
							</div>
							<div
								className={`faq-answer ${activeIndex === index ? "open" : ""}`}>
								<p>{item.answer}</p>
							</div>
						</div>
					))}
				</div>
			</div>
			<div className='tax-section9-right'>
				<img src='./images/s16.png' alt='' />
			</div>
		</div>
	);
};

export default Section9;
