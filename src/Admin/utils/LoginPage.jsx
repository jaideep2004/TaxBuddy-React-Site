import React, { useState } from "react";
import axios from "./axiosConfig";
import { useNavigate } from "react-router-dom"; // Use useNavigate instead of useHistory

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); // Use useNavigate for navigation

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("/login", { email, password });

      // Save token to localStorage or state
      localStorage.setItem("adminToken", response.data.token);

      // Redirect to dashboard
      navigate("/admin/dashboard"); // Use navigate() to redirect
    } catch (err) {
      setError("Invalid credentials or error logging in");
      console.error("Login Error:", err);
    }
  };

  return (
    <div>
      <h2>Admin Login</h2>
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
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginPage;
