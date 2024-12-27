import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../Admin/utils/axiosConfig";
import "./services.css";
import { useCustomerAuth } from "../../Customer/CustomerAuthContext";

const ServicePage = () => {
	const { login, fetchCustomerDashboard } = useCustomerAuth();

	const { serviceId } = useParams();
	const navigate = useNavigate();
	const [service, setService] = useState(null);
	const [customerDetails, setCustomerDetails] = useState({
		name: "",
		email: "",
		mobile: "",
		username: "",
		password: "",
		dob: "", // Adding dob field
		gender: "", // Adding gender field
	});

	// Fetch the service details from the server
	useEffect(() => {
		const fetchService = async () => {
			try {
				const response = await axios.get(
					`http://localhost:5000/api/customers/user-services/${serviceId}`
				);
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

	// Register the customer and handle payment
	//working razorpayy
	const handleRegisterAndPay = async () => {
		try {
			// Field validation
			const { name, email, mobile, username, password, dob, gender } =
				customerDetails;
			if (
				!name ||
				!email ||
				!mobile ||
				!username ||
				!password ||
				!dob ||
				!gender
			) {
				alert("Please fill in all required fields.");
				return;
			}

			if (!service?.salePrice) {
				alert("Service details are missing.");
				return;
			}

			// Create order
			const paymentResponse = await axios.post(
				"http://localhost:5000/api/customers/user-payment",
				{ amount: service.salePrice }
			);

			const { order } = paymentResponse?.data;

			// Validate Razorpay script
			if (typeof window.Razorpay === "undefined") {
				throw new Error("Razorpay script not loaded correctly");
			}

			// Configure Razorpay options
			const options = {
				key: "rzp_test_brvO8EMMhXPsDD",
				amount: order.amount,
				currency: order.currency,
				name: "Tax Filing Service",
				description: service?.name,
				order_id: order?.id,
				prefill: {
					name: customerDetails.name,
					email: customerDetails.email,
					contact: customerDetails.mobile,
				},
				notes: {
					serviceId: serviceId,
				},
				theme: {
					color: "#3399cc",
				},
				modal: {
					ondismiss: function () {
						alert("Payment cancelled. You have not been registered.");
						setCustomerDetails({
							name: "",
							email: "",
							mobile: "",
							username: "",
							password: "",
							dob: "",
							gender: "",
						});
						navigate("/");
					},
				},
				handler: async function (response) {
					try {
						// First register the user
						const registrationResponse = await axios.post(
							"http://localhost:5000/api/customers/user-register",
							{
								name,
								email,
								mobile,
								username,
								password,
								dob,
								gender,
							}
						);

						const registeredUserId = registrationResponse?.data?.userId;
						if (!registeredUserId) {
							throw new Error("User registration failed");
						}

						// Log in the user
						const loginResponse = await login(email, password);
						if (!loginResponse.success) {
							throw new Error(`Login failed: ${loginResponse.message}`);
						}
						await fetchCustomerDashboard();
						// Save payment details
						await axios.post(
							"http://localhost:5000/api/customers/payment-success",
							{
								razorpay_payment_id: response.razorpay_payment_id,
								razorpay_order_id: response.razorpay_order_id,
								razorpay_signature: response.razorpay_signature,
								amount: order.amount,
								userId: registeredUserId,
								serviceId: serviceId,
							}
						);

						alert("Payment successful!");
						navigate(`/customers/dashboard/${email}`);
					} catch (error) {
						console.error("Error processing payment:", error);
						alert(
							error.message || "An error occurred during payment processing"
						);
					}
				},
			};

			// Initialize Razorpay
			const razorpay = new window.Razorpay(options);
			razorpay.open();
		} catch (error) {
			console.error("Error during registration or payment:", error);
			alert("An error occurred. Please try again.");
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
							<h1>Register Today!</h1>
							<div className='sform-div'>
								<div>
									<label htmlFor=''>Name</label>
									<input
										type='text'
										name='name'
										placeholder='Name'
										onChange={handleChange}
										id='firstINput'
									/>
								</div>
							</div>
							<div className='sform-div'>
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
										type='text'
										name='mobile'
										placeholder='Mobile'
										onChange={handleChange}
									/>
								</div>
							</div>
							<div className='sform-div'>
								<div>
									<label htmlFor=''>Username</label>
									<input
										type='text'
										name='username'
										placeholder='Username'
										onChange={handleChange}
									/>
								</div>
								<div>
									<label htmlFor=''>Password</label>
									<input
										type='password'
										name='password'
										placeholder='Password'
										onChange={handleChange}
									/>
								</div>
							</div>
							<div className='sform-div'>
								<div>
									<label htmlFor=''>Date of Birth</label>
									<input
										type='date'
										name='dob'
										value={customerDetails.dob}
										placeholder='Date of Birth'
										onChange={handleChange}
									/>
								</div>
								<div>
									<label htmlFor=''>Gender</label>
									<select
										name='gender'
										onChange={handleChange}
										defaultValue=''
										value={customerDetails.gender}>
										<option value='' disabled>
											Select Gender
										</option>
										<option value='Male'>Male</option>
										<option value='Female'>Female</option>
										<option value='Other'>Other</option>
									</select>
								</div>
							</div>
							<div id='serv-desc'>
								<p>{service.description}</p>

								<h4>
									₹{service.salePrice} <br />
									<span style={{ textDecoration: "line-through" }}>
										₹{service.actualPrice}
									</span>
								</h4>
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
