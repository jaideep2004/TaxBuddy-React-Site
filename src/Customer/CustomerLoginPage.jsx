import React from "react";
// import { useCustomerAuth } from "../CustomerAuthContext";
import { useCustomerAuth } from "./CustomerAuthContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "./customer.css";

const CustomerLoginPage = () => {
	const [showPassword, setShowPassword] = useState(false);
	const { login } = useCustomerAuth();
	const navigate = useNavigate();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");

	const handleSubmit = async (e) => {
		e.preventDefault();
		const response = await login(email, password);
		if (response.success) {
			navigate("/customers/dashboard/:email");
		} else {
			setError(response.message);
		}
	};

	return (
		<div className='tax-customer-login'>
			<div>
				<h1>Customer Login</h1>
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
					<button type='submit'>Login</button>
				</form>
			</div>
		</div>
	);
};

export default CustomerLoginPage;
