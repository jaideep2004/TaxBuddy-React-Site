import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../Admin/utils/axiosConfig";

const Services = () => {
    const { id } = useParams(); // Get the service ID from the URL
    const navigate = useNavigate();
    const [service, setService] = useState(null);
    const [user, setUser] = useState(null); // Check if user is logged in

    useEffect(() => {
        const fetchService = async () => {
            try {
                const response = await axios.get(`http://localhost:500/services/${id}`); // Fetch service details
                setService(response.data);
            } catch (err) {
                console.error("Error fetching service:", err);
            }
        };

        const fetchUser = async () => {
            try {
                const response = await axios.get(`/api/auth/me`); // Fetch logged-in user details
                setUser(response.data);
            } catch (err) {
                console.log("User not logged in");
            }
        };

        fetchService();
        fetchUser();
    }, [id]);

    const handlePayment = async () => {
        if (!user) {
            navigate("/register"); // Redirect to register if user is not logged in
            return;
        }

        try {
            // Create payment order on backend
            const { data: order } = await axios.post(`/api/payments/create-order`, {
                serviceId: id,
            });

            const options = {
                key: "YOUR_RAZORPAY_KEY", // Replace with your Razorpay key
                amount: order.amount,
                currency: order.currency,
                name: "Tax Filing Service",
                description: `Payment for ${service.name}`,
                order_id: order.id, // Razorpay order ID from backend
                handler: async (response) => {
                    // Verify payment on backend
                    const verification = await axios.post(`/api/payments/verify`, {
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_signature: response.razorpay_signature,
                        serviceId: id,
                    });

                    if (verification.data.success) {
                        alert("Payment Successful!");
                        navigate("/customer-panel");
                    } else {
                        alert("Payment verification failed. Please try again.");
                    }
                },
                prefill: {
                    email: user.email,
                    contact: user.phone,
                },
                theme: {
                    color: "#3399cc",
                },
            };

            const razorpay = new Razorpay(options);
            razorpay.open();
        } catch (err) {
            console.error("Error initiating payment:", err);
        }
    };

    if (!service) return <div>Loading...</div>;

    return (
        <div>
            <h1>{service.name}</h1>
            <p>{service.description}</p>
            <p>Price: ₹{service.price}</p>
            <button onClick={handlePayment}>Proceed to Payment</button>
        </div>
    );
};

export default Services;
