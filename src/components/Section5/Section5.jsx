import React from "react";
import "./section5.css";
import TaxFlipbox from "../FlipboxSection/TaxFlipbox";

const Section5 = () => {
	return (
		<div className='tax-section5'>
			<div className='tax-section5-wrap'>
				<div className='tax5-heading'>
					<h1>Taxbuddy: Your partner for E-Tax filing</h1>
				</div>
				<div className='tax5-flipboxes-wrap'>
					
					<TaxFlipbox
						title='Expert Assistance'
						content='Our team of tax professionals is always ready to help you with any
							queries or concerns you may have.'
						icon='fa-solid fa-users fa-2xl'
					/>
					<TaxFlipbox
						title='Secure & Private'
						content='Your data security is our top priority. Rest assured, your
							information is encrypted and protected.'
						icon='fa-solid fa-user-lock fa-2xl'
					/>
					<TaxFlipbox
						title='Timely Filing'
						content='Our team of tax professionals is always ready to help you with any
							queries or concerns you may have.'
						icon='fa-solid fa-stopwatch fa-2xl'
					/>
					<TaxFlipbox
						title='Expert Assistance'
						content='Our team of tax professionals is always ready to help you with any
							queries or concerns you may have.'
						icon='fa-brands fa-hive fa-2xl'
					/>
					<TaxFlipbox
						title='Seamless Integration'
						content='Our team of tax professionals is always ready to help you with any
							queries or concerns you may have.'
						icon='fa-brands fa-hive fa-2xl'
					/>
					<TaxFlipbox
						title='Expert Assistance'
						content='Our team of tax professionals is always ready to help you with any
							queries or concerns you may have.'
						icon='fa-solid fa-users fa-2xl'
					/>
					<TaxFlipbox
						title='Expert Assistance'
						content='Our team of tax professionals is always ready to help you with any
							queries or concerns you may have.'
						icon='fa-solid fa-users fa-2xl'
					/>
					<TaxFlipbox
						title='Expert Assistance'
						content='Our team of tax professionals is always ready to help you with any
							queries or concerns you may have.'
						icon='fa-solid fa-users fa-2xl'
					/>
				</div>
			</div>
		</div>
	);
};

export default Section5;
