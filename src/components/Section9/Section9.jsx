import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import TestCard from "./TestCard";
import "./section9.css";
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";

const Section9 = () => {
	useEffect(() => {
		window.scrollTo({ top: 0, behavior: "smooth" });
		AOS.init();
	}, []);
	const CustomPrevArrow = (props) => {
		const { onClick } = props;
		return (
			<div className='customprevarrow' onClick={onClick}>
				<i class='fa-solid fa-circle-arrow-left fa-2xl'></i>
			</div>
		);
	};

	const CustomNextArrow = (props) => {
		const { onClick } = props;
		return (
			<div className='customnextarrow' onClick={onClick}>
				<i class='fa-solid fa-circle-arrow-right fa-2xl'></i>
			</div>
		);
	};
	const settings = {
		dots: false,
		infinite: true,
		autoplay: true,
		// fade: true,
		speed: 700,
		slidesToShow: 1,
		slidesToScroll: 1,

		prevArrow: <CustomPrevArrow />,
		nextArrow: <CustomNextArrow />,
	};
	const testimonials = [
		{
			id: 1,
			img: "./images/t1.png",
			heading: "Data collection and analysis",
			desc: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Culpa, quis cupiditate veniam quibusdam doloremque eius aperiam ducimus adipisci magni facilis veritatis molestias, totam architecto repellat accusamus nam soluta. Ipsa, necessitatibus. ",
		},
		{
			id: 2,
			img: "./images/t2.png",
			heading: "Proactive strategy for financial growth",
			desc: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Culpa, quis cupiditate veniam quibusdam doloremque eius aperiam ducimus adipisci magni facilis veritatis molestias, totam architecto repellat accusamus nam soluta. Ipsa, necessitatibus. ",
		},
		{
			id: 3,
			img: "./images/t3.png",
			heading: "Proactive strategy for financial growth",
			desc: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Culpa, quis cupiditate veniam quibusdam doloremque eius aperiam ducimus adipisci magni facilis veritatis molestias, totam architecto repellat accusamus nam soluta. Ipsa, necessitatibus. ",
		},
		{
			id: 4,
			img: "./images/t4.png",
			heading: "Cash flow planning and tax planning",
			desc: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Culpa, quis cupiditate veniam quibusdam doloremque eius aperiam ducimus adipisci magni facilis veritatis molestias, totam architecto repellat accusamus nam soluta. Ipsa, necessitatibus. ",
		},
	];
	const planets = [
		{ name: "Planet 1", color: "red" },
		{ name: "Planet 2", color: "blue" },
		{ name: "Planet 3", color: "green" },
		{ name: "Planet 4", color: "yellow" },
	];

	return (
		<div className='tax-section9-wrap'>
			<div data-aos='fade-down' data-aos-duration='800'>
				<p className='p-tag2'>TESTIMONIALS</p>
				<h1>
					Our client’s reviews inspired us the most to <br />
					improve our services
				</h1>
			</div>
			<div className='tax9sliderwrap'>
				<div className='slidercont'>
					<center>
						<Slider {...settings}>
							{testimonials.map((testimonial) => (
								<TestCard
									img={testimonial.img}
									heading={testimonial.heading}
									desc={testimonial.desc}
								/>
							))}
						</Slider>
					</center>
				</div>
				<div className='tax9-animate'>
					<div className='solar-system'>
						<div className='central-image'>
							<img
								src='./images/t1.png'
								className='central-img'
							/>
						</div>
						<div className='orbit orbit-1'>
							<div className='planet'>
								<img
									src='./images/t1.png'
									alt='Planet 1'
								/>
							</div>
						</div>
						<div className='orbit orbit-2'>
							<div className='planet'>
								<img
									src='./images/t2.png'
									alt='Planet 2'
								/>
							</div>
						</div>
						<div className='orbit orbit-3'>
							<div className='planet'>
								<img
									src='./images/t3.png'
									alt='Planet 3'
								/>
							</div>
						</div>
						<div className='orbit orbit-4'>
							<div className='planet'>
								<img
									src='./images/t4.png'
									alt='Planet 4'
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Section9;
