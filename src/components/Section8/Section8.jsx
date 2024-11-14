import React from "react";
import "./section8.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import TestCard from "./TestCard";

export const Section8 = () => {
	const CustomPrevArrow = (props) => {
		const { onClick } = props;
		return (
			<div className='customprevarrow' onClick={onClick}>
				<i class='fa-solid fa-circle-arrow-left fa-xl'></i>
			</div>
		);
	};

	const CustomNextArrow = (props) => {
		const { onClick } = props;
		return (
			<div className='customnextarrow' onClick={onClick}>
				<i class='fa-solid fa-circle-arrow-right fa-xl'></i>
			</div>
		);
	};
	const settings = {
		dots: false,
        infinite: true,
        autoplay: true,
        fade: true, 
		speed: 750,
		slidesToShow: 1,
        slidesToScroll: 1,
        centerMode: true,
		prevArrow: <CustomPrevArrow />,
		nextArrow: <CustomNextArrow />,
	};
	const testimonials = [
		{
			id: 1,
			img: "./images/s3.jpg",
			name: "Jane",
			desc: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Saepe ratione odio fuga nemo illo quasi temporibus, officia a voluptatem quia sed ab quibusdam, autem deleniti at perferendis alias harum ex  sed ab quibusdam, autem deleniti at perferendis alias harum ex",
		},
		{
			id: 2,
			img: "./images/s5.png",
			name: "Tom",
			desc: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Saepe ratione odio fuga nemo illo quasi temporibus, officia a voluptatem quia sed ab quibusdam, autem deleniti at perferendis alias harum ex  sed ab quibusdam, autem deleniti at perferendis alias harum ex  sed ab quibusdam, autem deleniti at perferendis alias harum ex",
		},
		{
			id: 3,
			img: "./images/s3.jpg",
			name: "Jack",
			desc: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Saepe ratione odio fuga nemo illo quasi temporibus, officia a voluptatem quia sed ab quibusdam, autem deleniti at perferendis alias harum ex",
		},
		{
			id: 4,
			img: "./images/s5.png",
			name: "Jack",
			desc: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Saepe ratione odio fuga nemo illo quasi temporibus, officia a voluptatem quia sed ab quibusdam, autem deleniti at perferendis alias harum ex hgjbhj",
		},
	];
	return (
		<div className='tax-section8-slider'>
			<h1>Our Testimonials</h1>
			<Slider {...settings} className='slider'>
				{testimonials.map((testimonial) => (
                    <TestCard img={testimonial.img}
                        name={testimonial.name}
                    desc={testimonial.desc}
                    />
				))}
			</Slider>
		</div>
	);
};
