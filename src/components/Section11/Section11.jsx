import React, { useState } from "react";
import "./section11.css";
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";

const Section11 = () => {
	useEffect(() => {
		window.scrollTo({ top: 0, behavior: "smooth" });
		AOS.init();
	}, []);
	const faqData = [
		{
			question: "Lorem ipsum dolor, sit amet consectetur adipisicing elit ?",
			answer:
				"This is dummy content. Lorem ipsum dolor, sit amet consectetur adipisicing elit. Vitae quae ea placeat necessitatibus tempore animi est, magni id cumque dicta fugiat similique sunt aut distinctio, a perspiciatis quod quaerat! placeat necessitatibus tempore animi est, magni id eos, cumque dicta fugiat similique sunt aut distinctio, a perspiciatis quod quaerat ",
		},
		{
			question: "Lorem ipsum dolor, sit amet consectetur adipisicing elit ?",
			answer:
				"Lorem ipsum dolor, sit amet consectetur adipisicing elit. Vitae quae ea placeat necessitatibus tempore animi est, magni id cumque dicta fugiat similique sunt aut distinctio, a perspiciatis quod quaerat! placeat necessitatibus tempore animi est, magni id eos, cumque dicta fugiat similique sunt aut distinctio, a perspiciatis quod quaerat ",
		},
		{
			question: "Lorem ipsum dolor, sit amet consectetur adipisicing elit ?",
			answer:
				"Lorem ipsum dolor, sit amet consectetur adipisicing elit. Vitae quae ea placeat necessitatibus tempore animi est, magni id cumque dicta fugiat similique sunt aut distinctio, a perspiciatis quod quaerat! placeat necessitatibus tempore animi est, magni id eos, cumque dicta fugiat similique sunt aut distinctio, a perspiciatis quod quaerat ",
		},
		{
			question: "Lorem ipsum dolor, sit amet consectetur adipisicing elit ?",
			answer:
				"Lorem ipsum dolor, sit amet consectetur adipisicing elit. Vitae quae ea placeat necessitatibus tempore animi est, magni id cumque dicta fugiat similique sunt aut distinctio, a perspiciatis quod quaerat! placeat necessitatibus tempore animi est, magni id eos, cumque dicta fugiat similique sunt aut distinctio, a perspiciatis quod quaerat ",
		},
	];
	const [activeIndex, setActiveIndex] = useState(null);

	const toggleFAQ = (index) => {
		setActiveIndex(index === activeIndex ? null : index);
	};

	return (
		<div className='tax-section11'>
			<div className='tax-section11-wrap'>
				<div className='faq-section-left'>
					<p className='p-tag2' data-aos='fade-down'
				data-aos-duration='800'>ASK QUESTIONS</p>
					<h1 data-aos='fade-down'
				data-aos-duration='800'>Frequently Asked Questions</h1>
					<div className='faq-list'>
						{faqData.map((item, index) => (
							<div key={index} className='faq-item'>
								<div className='faq-question' onClick={() => toggleFAQ(index)}>
									<span>{item.question}</span>
									<i
										className={`fas ${
											activeIndex === index
												? "fa-chevron-up"
												: "fa-chevron-down"
										}`}></i>
								</div>
								<div
									className={`faq-answer ${
										activeIndex === index ? "open" : ""
									}`}>
									<p>{item.answer}</p>
								</div>
							</div>
						))}
					</div>
				</div>
				<div className='tax-section11-right'>
					<button className='tax5-btn'>
						Ask A Question <i class='fa-solid fa-arrow-right'></i>{" "}
					</button>
					<div className='faq-list'>
						{faqData.map((item, index) => (
							<div key={index} className='faq-item'>
								<div className='faq-question' onClick={() => toggleFAQ(index)}>
									<span>{item.question}</span>
									<i
										className={`fas ${
											activeIndex === index
												? "fa-chevron-up"
												: "fa-chevron-down"
										}`}></i>
								</div>
								<div
									className={`faq-answer ${
										activeIndex === index ? "open" : ""
									}`}>
									<p>{item.answer}</p>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};

export default Section11;
