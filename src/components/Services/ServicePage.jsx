// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "../../Admin/utils/axiosConfig";

// const ServicePage = () => {
//     const { serviceId } = useParams();
//     const navigate = useNavigate();
//     const [service, setService] = useState(null);
//     const [customerDetails, setCustomerDetails] = useState({ name: "", email: "", username: "", password: "" });

//     useEffect(() => {
//         const fetchService = async () => {
//             try {
//                 const response = await axios.get(`http://localhost:5000/api/customers/user-services/${serviceId}`);
//                 console.log(response);  // Log response to see if data is coming in
//                 setService(response.data.service);
//             } catch (error) {
//                 console.error("Error fetching service:", error);
//             }
//         };
//         fetchService();
//     }, [serviceId]);

//     const handleChange = (e) => {
//         setCustomerDetails({ ...customerDetails, [e.target.name]: e.target.value });
//     };

//     const handleRegisterAndPay = async () => {
//         try {
//             await axios.post("http://localhost:5000/api/customers/user-register", customerDetails);
//             const paymentResponse = await axios.post("http://localhost:5000/api/customers/user-payment", { amount: service.price });
//             const { order } = paymentResponse.data;

//             // Redirect to Razorpay payment
//             const options = {
//                 key: "rzp_test_brvO8EMMhXPsDD",
//                 amount: order.amount,
//                 currency: order.currency,
//                 name: "Tax Filing Service",
//                 description: service.name,
//                 order_id: order.id,
//                 handler: async function (response) {
//                     alert("Payment successful!");
//                     navigate("http://localhost:5000/customer/dashboard");
//                 },
//                 prefill: {
//                     name: customerDetails.name,
//                     email: customerDetails.email,
//                 },
//             };
//             const razorpay = new window.Razorpay(options);
//             razorpay.open();
//         } catch (error) {
//             console.error("Error registering or initiating payment:", error);
//         }
//     };

//     return (
//         <div>
//             {service && (
//                 <>
//                     <h1>{service.name}</h1>
//                     <p>{service.description}</p>
//                     <p>Price: ₹{service.price}</p>
//                     <input type="text" name="name" placeholder="Name" onChange={handleChange} />
//                     <input type="email" name="email" placeholder="Email" onChange={handleChange} />
//                     <input type="text" name="username" placeholder="Username" onChange={handleChange} />
//                     <input type="password" name="password" placeholder="Password" onChange={handleChange} />
//                     <button onClick={handleRegisterAndPay}>Register & Pay</button>
//                 </>
//             )}
//         </div>
//     );
// };

// export default ServicePage;

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../Admin/utils/axiosConfig";

const ServicePage = () => {
	const { serviceId } = useParams();
	const navigate = useNavigate();
	const [service, setService] = useState(null);
	const [customerDetails, setCustomerDetails] = useState({
		name: "",
		email: "",
		username: "",
		password: "",
	});

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

	const handleChange = (e) => {
        setCustomerDetails({ ...customerDetails, [e.target.name]: e.target.value });
    };
    
    const handleRegisterAndPay = async () => {
        try {
            console.log("Customer Details:", customerDetails); // Log the details to check
    
            const response = await axios.post("http://localhost:5000/api/customers/user-register", customerDetails);
            console.log("Registration Response:", response.data);
    
            const paymentResponse = await axios.post("http://localhost:5000/api/customers/user-payment", { amount: service.price });
            const { order } = paymentResponse.data;
    
            if (typeof window.Razorpay === "undefined") {
                throw new Error("Razorpay script not loaded correctly");
            }
    
            const options = {
                key: "rzp_test_brvO8EMMhXPsDD",
                amount: order.amount,
                currency: order.currency,
                name: "Tax Filing Service",
                description: service.name,
                order_id: order.id,
                handler: async function (response) {
                    alert("Payment successful!");
                    navigate("http://localhost:5000/customer/dashboard");
                },
                prefill: {
                    name: customerDetails.name,
                    email: customerDetails.email,
                },
            };
    
            const razorpay = new window.Razorpay(options);
            razorpay.open();
        } catch (error) {
            console.error("Error registering or initiating payment:", error);
        }
    };
    

	return (
		<div>
			{service ? (
				<>
					<h1>{service.name}</h1>
					<p>{service.description}</p>
					<p>Price: ₹{service.price}</p>
					<input
						type='text'
						name='name'
						placeholder='Name'
						onChange={handleChange}
					/>
					<input
						type='email'
						name='email'
						placeholder='Email'
						onChange={handleChange}
					/>
					<input
						type='text'
						name='username'
						placeholder='Username'
						onChange={handleChange}
					/>
					<input
						type='password'
						name='password'
						placeholder='Password'
						onChange={handleChange}
					/>
					<button onClick={handleRegisterAndPay}>Register & Pay</button>
				</>
			) : (
				<p>Loading service details...</p>
			)}
		</div>
	);
};

export default ServicePage;
