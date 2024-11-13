import React from "react";
import "./footer.css";
import { NavLink } from "react-router-dom";

const Footer = () => {
	return (
		<footer className='footer'>
			{/* Footer Columns */}
			<div className='footer-columns'>
				<div className='footer-column'>
					<h4>TaxBuddy</h4>
					<ul>
						<li>
							<NavLink
								to='/'
								end
								className={({ isActive }) => (isActive ? "active" : "")}>
								Home
							</NavLink>
						</li>
						<li>
							<NavLink
								to='/about'
								className={({ isActive }) => (isActive ? "active" : "")}>
								About Us
							</NavLink>
						</li>
						<li>
							<NavLink
								to='/services'
								className={({ isActive }) => (isActive ? "active" : "")}>
								Services
							</NavLink>
						</li>
						<li>
							<NavLink
								to='/contact'
								className={({ isActive }) => (isActive ? "active" : "")}>
								Contact Us
							</NavLink>
						</li>
					</ul>
				</div>
				<div className='footer-column'>
					<h4>Support</h4>
					<ul>
						<li>
							<a href='#contact'>Contact Us</a>
						</li>
						<li>
							<a href='#faq'>FAQ</a>
						</li>
						<li>
							<a href='#support'>Support Center</a>
						</li>
						<li>
							<a href='#feedback'>Feedback</a>
						</li>
					</ul>
				</div>
				<div className='footer-column'>
					<h4>Services</h4>
					<ul>
						<li>
							<a href='#consulting'>Consulting</a>
						</li>
						<li>
							<a href='#development'>Development</a>
						</li>
						<li>
							<a href='#design'>Design</a>
						</li>
						<li>
							<a href='#marketing'>Marketing</a>
						</li>
					</ul>
				</div>
				<div className='footer-column'>
					<h4>Resources</h4>
					<ul>
						<li>
							<a href='#docs'>Documentation</a>
						</li>
						<li>
							<a href='#guides'>Guides</a>
						</li>
						<li>
							<a href='#partners'>Partners</a>
						</li>
						<li>
							<a href='#community'>Community</a>
						</li>
					</ul>
				</div>
			</div>

			{/* Social Icons Row */}
			<div className='footer-social-icons'>
				<img src='./images/logo.webp' alt='' />
				<a
					href='https://facebook.com'
					target='_blank'
					rel='noopener noreferrer'>
					<i className='fab fa-facebook-f'></i>
				</a>
				<a href='https://twitter.com' target='_blank' rel='noopener noreferrer'>
					<i className='fab fa-twitter'></i>
				</a>
				<a
					href='https://instagram.com'
					target='_blank'
					rel='noopener noreferrer'>
					<i className='fab fa-instagram'></i>
				</a>
				<a
					href='https://linkedin.com'
					target='_blank'
					rel='noopener noreferrer'>
					<i className='fab fa-linkedin-in'></i>
				</a>
			</div>

			{/* Copyright Row */}
			<div className='footer-copyright'>
				&copy; {new Date().getFullYear()} TaxBuddy. All rights reserved.
			</div>
		</footer>
	);
};

export default Footer;
