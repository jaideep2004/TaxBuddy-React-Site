import React from "react";
import HexagonItem from "./HexagonItem";
import "./section5.css";
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect, useState } from "react";

const Section5 = () => {
	useEffect(() => {
		window.scrollTo({ top: 0, behavior: "smooth" });
		AOS.init();
	}, []);
	// Sample data for the hexagonal items
	const gridItems = [
		{
			icon: "user-pen",
			title: "Signup For The Service",
			color: "text-blue-500",
		},
		{
			icon: "folder-open",
			title: "Document Upload",
			color: "text-green-500",
		},
		{
			icon: "user-group",
			title: "Assigned To An Expert",
			color: "text-purple-500",
		},
		{
			icon: "file-signature",
			title: "Service Execution",
			color: "text-red-500",
		},
		{
			icon: "clipboard-question",
			title: "Resolving Queries",
			color: "text-yellow-500",
		},
		{
			icon: "rocket",
			title: (
				<>
					Deliverables<br />Finalized
				</>
			),
			color: "text-indigo-500",
		},
	];

	return (
		<div id='tax-section5'>
			{/* <p className='p-tag2'>OUR WORKFLOW</p> */}
			<h1 data-aos='fade-down' data-aos-duration='800'>Our Workflow</h1>
			<div className='hexagonal-grid' data-aos='fade-up' data-aos-duration='800'>
				{gridItems.map((item, index) => (
					<HexagonItem
						key={index}
						icon={item.icon}
						title={item.title}
						color={item.color}
						className={index % 2 === 0 ? "translate-y-0" : "translate-y-16"}
					/>
				))}
			</div>
		</div>
	);
};

export default Section5;
