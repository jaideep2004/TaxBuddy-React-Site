import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./customer.css";
import { useCustomerAuth } from "./CustomerAuthContext";

const CustomerLoginPage = () => {
	const [showPassword, setShowPassword] = useState(false);
	const { login, loading, error } = useCustomerAuth();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [localError, setLocalError] = useState("");
	const navigate = useNavigate(); // Hook for navigation

	const handleSubmit = async (e) => {
		e.preventDefault();
		const response = await login(email, password);

		if (response.success) {
			navigate(`/customers/dashboard/${email}`); // Redirect to dashboard with email
		} else {
			setLocalError(response.message || "Login failed. Please try again.");
		}
	};

	return (
		<div className='tax-customer-login'>
			<div>
				<h1>Customer Login</h1>
				<form onSubmit={handleSubmit}>
					<div>
						<label>Email:</label>
						<input
							type='email'
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
						/>
					</div>
					<div style={{ position: "relative" }}>
						<label>Password:</label>
						<input
							type={showPassword ? "text" : "password"}
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
						/>
						<i
							className={`fa ${showPassword ? "fa-eye-slash" : "fa-eye"}`}
							style={{
								position: "absolute",
								right: "-10px",
								top: "60px",
								cursor: "pointer",
							}}
							onClick={() => setShowPassword((prev) => !prev)}></i>
					</div>
					{(localError || error) && (
						<p style={{ color: "red" }}>{localError || error}</p>
					)}
					<button type='submit'>Login</button>
				</form>
			</div>
		</div>
	);
};

export default CustomerLoginPage;
