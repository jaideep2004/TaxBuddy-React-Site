// import React, { useState } from "react";
// import axios from "./axiosConfig";
// import { useNavigate } from "react-router-dom"; // Use useNavigate instead of useHistory

// const LoginPage = () => {
// 	const [email, setEmail] = useState("");
// 	const [password, setPassword] = useState("");
// 	const [showPassword, setShowPassword] = useState(false); // State for password visibility
// 	const [error, setError] = useState("");
// 	const navigate = useNavigate(); // Use useNavigate for navigation

// 	const handleSubmit = async (e) => {
// 		e.preventDefault();

// 		try {
// 			const response = await axios.post(
// 				"http://localhost:5000/api/admin/login",
// 				{ email, password }
// 			);

// 			// Save token to localStorage
// 			localStorage.setItem("adminToken", response.data.token);

// 			// Redirect to dashboard
// 			navigate("/admin/dashboard"); // Use navigate() to redirect
// 		} catch (err) {
// 			setError("Invalid credentials or error logging in");
// 			console.error("Login Error:", err);
// 		}
// 	};

// 	return (
// 		<div className='tax-admin-login'>
// 			<div>
// 				<h1>Login</h1>
// 				<form onSubmit={handleSubmit}>
// 					<div>
// 						<label>Email:</label>
// 						<input
// 							type='email'
// 							value={email}
// 							onChange={(e) => setEmail(e.target.value)}
// 							required
// 						/>
// 					</div>
// 					<div style={{ position: "relative" }}>
// 						<label>Password:</label>
// 						<input
// 							type={showPassword ? "text" : "password"} // Toggle input type
// 							value={password}
// 							onChange={(e) => setPassword(e.target.value)}
// 							required
// 						/>
// 						{/* FontAwesome Eye Icon */}
// 						<i
// 							className={`fa ${showPassword ? "fa-eye-slash" : "fa-eye"}`}
// 							style={{
// 								position: "absolute",
// 								right: "-10px",
// 								top: "60px",
// 								cursor: "pointer",
// 							}}
// 							onClick={() => setShowPassword((prev) => !prev)} // Toggle state
// 						></i>
// 					</div>
// 					{error && <p style={{ color: "red" }}>{error}</p>}
// 					<button type='submit'>Login</button>
// 				</form>
// 			</div>
// 		</div>
// 	);
// };

// export default LoginPage;

import React, { useState } from "react";
import axios from "./axiosConfig";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post("http://localhost:5000/api/admin/login", { email, password });

      // Save token to localStorage
      const token = response.data.token;
      if (token) {
        localStorage.setItem("adminToken", token);

        // Redirect immediately to dashboard
        navigate("/admin/dashboard", { replace: true });
      } else {
        throw new Error("Token not received");
      }
    } catch (err) {
      setError("Invalid credentials. Please try again.");
      console.error("Login Error:", err);
    }
  };

  return (
    <div className="tax-admin-login">
      <div>
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Email:</label>
            <input
              type="email"
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
              onClick={() => setShowPassword((prev) => !prev)}
            ></i>
          </div>
          {error && <p style={{ color: "red" }}>{error}</p>}
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
