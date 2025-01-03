// EmLoginPage.jsx
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { EmployeeContext } from "./EmployeeContext";
import './employee.css'

const EmLoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { login, loading, error } = useContext(EmployeeContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // Hook for navigation

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(email, password);

    if (success) {
      navigate(`/employees/dashboard/${email}`); // Redirect to employee dashboard with email
    } else {
      console.log("Login failed. Check error message displayed.");
    }
  };

  return (
    <div className="tax-employee-login">
      <div>
        <h1>Employee Login</h1>
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
          <button type="submit" disabled={loading}>
            {loading ? "Logging In..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EmLoginPage;
