import React from "react";
// import { useCustomerAuth } from "../CustomerAuthContext";
import { useCustomerAuth } from "./CustomerAuthContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const CustomerLoginPage = () => {
	const { login } = useCustomerAuth();
	const navigate = useNavigate();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");

	const handleSubmit = async (e) => {
		e.preventDefault();
		const response = await login(email, password);
		if (response.success) {
			navigate("/customers/dashboard");
		} else {
			setError(response.message);
		}
	};

	return (
		<div>
			<h2>Customer Login</h2>
			{error && <p style={{ color: "red" }}>{error}</p>}
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
				<div>
					<label>Password:</label>
					<input
						type='password'
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
					/>
				</div>
				<button type='submit'>Login</button>
			</form>
		</div>
	);
};

export default CustomerLoginPage;
