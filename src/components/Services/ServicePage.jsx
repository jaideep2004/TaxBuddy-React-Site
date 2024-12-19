import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../Admin/utils/axiosConfig";
import "./services.css";
import { useCustomerAuth } from "../../Customer/CustomerAuthContext";

const ServicePage = () => {
	const { login } = useCustomerAuth();

	const { serviceId } = useParams();
	const navigate = useNavigate();
	const [service, setService] = useState(null);
	const [customerDetails, setCustomerDetails] = useState({
		name: "",
		email: "",
		mobile: "",
		dob: "",
		gender: "",
		pan: "",
		gst: "",
		address: "",
		city: "",
		state: "",
		country: "",
		postalcode: "",
		natureEmployement: "",
		annualIncome: "",
		education: "",
		certifications: "",
		institute: "",
		completiondate: "",
		username: "",
		password: "",
	});

	// Fetch the service details from the server
	useEffect(() => {
		const fetchService = async () => {
			try {
				const response = await axios.get(
					`http://localhost:5000/api/customers/user-services/${serviceId}`
				);
				console.log("Service details fetched successfully:", response.data);
				setService(response.data.service);
			} catch (error) {
				if (error.response && error.response.status === 404) {
					navigate("/not-found");
				} else {
					console.error("Error fetching service:", error);
				}
			}
		};
		fetchService();
	}, [serviceId, navigate]);

	// Handle changes to form fields
	const handleChange = (e) => {
		setCustomerDetails({ ...customerDetails, [e.target.name]: e.target.value });
	};

	

	const handleRegisterAndPay = async () => {
		try {
			console.log("Customer details before registration:", customerDetails);

			// Ensure basic required fields are filled
			if (
				!customerDetails.name ||
				!customerDetails.email 
			) {
				alert("Please fill in all required fields.");
				return;
			}

			// Register the user
			const registrationResponse = await axios.post(
				"http://localhost:5000/api/customers/user-register",
				customerDetails
			);

			console.log("Registration response:", registrationResponse);

			const registeredUserId = registrationResponse?.data?.userId; // Get the user ID

			if (!registeredUserId) {
				alert("User registration failed. Please try again.");
				return;
			}

			// Automatically log in the user
			const loginResponse = await login(
				customerDetails.email,
				customerDetails.password
			);

			if (!loginResponse.success) {
				alert(`Login failed: ${loginResponse.message}`);
				return;
			}

			if (!service || !service.price) {
				alert("Service details are missing.");
				return;
			}

			// Initiate payment with the correct amount
			const paymentResponse = await axios.post(
				"http://localhost:5000/api/customers/user-payment",
				{ amount: service.price }
			);

			const { order } = paymentResponse?.data;

			if (typeof window.Razorpay === "undefined") {
				throw new Error("Razorpay script not loaded correctly");
			}

			const options = {
				key: "rzp_test_brvO8EMMhXPsDD",
				amount: order.amount,
				currency: order.currency,
				name: "Tax Filing Service",
				description: service?.name,
				order_id: order?.id,
				handler: async function (response) {
					try {
						console.log("Razorpay payment response:", response);

						// Pass userId (user._id) during payment success
						await axios.post(
							"http://localhost:5000/api/customers/payment-success",
							{
								razorpay_payment_id: response.razorpay_payment_id,
								amount: order?.amount,
								userId: registeredUserId, 
								serviceId: serviceId,
							}
						);

						alert("Payment successful!");
						navigate(`/customers/dashboard/${customerDetails.email}`);
					} catch (error) {
						console.error("Error while saving payment details:", error);
						alert(
							"Payment successful, but could not save service details. Please contact support."
						);
					}
				},
				prefill: {
					name: customerDetails.name,
					email: customerDetails.email,
				},
			};

			const razorpay = new window.Razorpay(options);
			razorpay.open();
		} catch (error) {
			console.error("Payment process error:", error);
			alert("Payment process failed. Please try again.");
		}
	};


	const boxStyle4 = {
		backgroundImage: `url(${"../images/hero8.jpeg"})`,
		backgroundPosition: "center center",
		backgroundRepeat: "no-repeat",
		backgroundSize: "cover",
	};

	return (
		<div id='tax-service-page'>
			{service ? (
				<div className='service-page-wrap'>
					<div className='service-banner' style={boxStyle4}>
						<h1>{service.name}</h1>
					</div>
					<div className='service-content'>
						<div className='service-form'>
							<h1>Register </h1>
							<div className='sform-div'>
								<div>
									<label htmlFor=''>Name</label>
									<input
										type='text'
										name='name'
										placeholder='Name'
										onChange={handleChange}
									/>
								</div>
								<div>
									<label htmlFor=''>Email</label>
									<input
										type='email'
										name='email'
										placeholder='Email'
										onChange={handleChange}
									/>
								</div>
								<div>
									<label htmlFor=''>Mobile</label>
									<input
										type='mobile'
										name='mobile'
										placeholder='Mobile'
										onChange={handleChange}
									/>
								</div>
							</div>
							<div className='sform-div2'>
								<div>
									<label htmlFor=''>DOB</label>
									<input
										type='date'
										name='dob'
										placeholder='DOB'
										onChange={handleChange}
									/>
								</div>
								<div>
									<label htmlFor=''>Gender</label>
									<select name='gender' id='' onChange={handleChange}>
										<option value=''>Select A Gender</option>
										<option value='man'>Man</option>
										<option value='woman'>Woman</option>
										<option value='others'>Others</option>
										<i class='fas fa-caret-down'></i>
									</select>
								</div>
							</div>
							<div className='sform-div'>
								<div>
									<label htmlFor=''>Pan Card</label>
									<input
										type='text'
										name='pan'
										placeholder='PAN'
										onChange={handleChange}
									/>
								</div>
								<div>
									<label htmlFor=''>GST</label>
									<input
										type='text'
										name='gst'
										placeholder='GST'
										onChange={handleChange}
									/>
								</div>
								<div>
									<label htmlFor=''>Annual Income</label>
									<input
										type='text'
										name='annualIncome'
										placeholder='GST'
										onChange={handleChange}
									/>
								</div>
							</div>
							<div className='sform-div'>
								<div>
									<label htmlFor=''>Address</label>
									<input
										type='text'
										name='address'
										placeholder='PAN'
										onChange={handleChange}
									/>
								</div>
								<div>
									<label htmlFor=''>City</label>
									<input
										type='text'
										name='city'
										placeholder='GST'
										onChange={handleChange}
									/>
								</div>
								<div>
									<label htmlFor=''>State</label>
									<input
										type='text'
										name='state'
										placeholder='GST'
										onChange={handleChange}
									/>
								</div>
							</div>
							<div className='sform-div'>
								<div>
									<label htmlFor=''>Country</label>
									<input
										type='text'
										name='country'
										placeholder='PAN'
										onChange={handleChange}
									/>
								</div>
								<div>
									<label htmlFor=''>Postal Code</label>
									<input
										type='text'
										name='postalcode'
										placeholder='GST'
										onChange={handleChange}
									/>
								</div>
								<div>
									<label htmlFor=''>Nature of Employment</label>
									<input
										type='text'
										name='natureEmployement'
										placeholder='GST'
										onChange={handleChange}
									/>
								</div>
							</div>
							<div className='sform-div'>
								<div>
									<label htmlFor=''>Education</label>
									<input
										type='text'
										name='education'
										placeholder='PAN'
										onChange={handleChange}
									/>
								</div>
								<div>
									<label htmlFor=''>Certifications</label>
									<select name='certifications' onChange={handleChange}>
										<option value=''>Select a Certification</option>
										<option value='cert1'>Certification 1</option>
										<option value='cert2'>Certification 2</option>
										<option value='cert3'>Certification 3</option>
									</select>
								</div>
								<div>
									<label htmlFor=''>Institute</label>
									<input
										type='text'
										name='institute'
										placeholder='GST'
										onChange={handleChange}
									/>
								</div>
							</div>
							<div className='sform-div'>
								<div>
									<label htmlFor=''>Completion Date</label>
									<input
										type='date'
										name='completiondate'
										placeholder='PAN'
										onChange={handleChange}
									/>
								</div>
								<div>
									<label htmlFor=''>Set Username</label>
									<input
										type='text'
										name='username'
										placeholder='Username'
										onChange={handleChange}
									/>
								</div>
								<div>
									<label htmlFor=''>Set Password</label>
									<input
										type='password'
										name='password'
										placeholder='Password'
										onChange={handleChange}
									/>
								</div>
							</div>
							<div id='serv-desc'>
								<p>{service.description}</p>
								<h4>₹{service.price}</h4>
							</div>
							<button onClick={handleRegisterAndPay}>Register & Pay</button>
						</div>
					</div>
				</div>
			) : (
				<p>Loading service details...</p>
			)}
		</div>
	);
};

export default ServicePage;
