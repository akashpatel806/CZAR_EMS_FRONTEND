import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./AuthPage.css";

const BASE_URL = "http://localhost:5000";

const Login = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "admin",
  });
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle submit (Sign In or Sign Up)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = isSignUp
        ? `${BASE_URL}/api/auth/register`
        : `${BASE_URL}/api/auth/login`;
      const payload = isSignUp
        ? formData
        : { email: formData.email, password: formData.password };

      const response = await axios.post(endpoint, payload);

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      setMessage(
        `${isSignUp ? "Registration" : "Login"} successful! Redirecting...`
      );
      setMessageType("success");

      setTimeout(() => {
        if (response.data.user.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/employee");
        }
      }, 1200);
    } catch (error) {
      setMessage(error.response?.data?.message || "Operation failed");
      setMessageType("danger");
    }
  };

  // Toggle Sign In / Sign Up mode
  const toggleMode = () => {
    setIsSignUp((prev) => !prev);
    setFormData({
      name: "",
      email: "",
      password: "",
      role: "admin",
    });
    setMessage("");
  };

  return (
    <div className="auth-wrapper">
      <div className={`auth-container ${isSignUp ? "sign-up-mode" : ""}`}>
        {/* ---------- Forms Section ---------- */}
        <div className="forms-container">
          <div className="signin-signup">
            {/* ---------- Sign In Form ---------- */}
            <form
              className={`sign-in-form ${!isSignUp ? "active" : ""}`}
              onSubmit={handleSubmit}
            >
              <h2 className="title">Sign In</h2>

              <div className="input-field">
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="input-field">
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <button type="submit" className="btn solid">
                Sign In
              </button>
            </form>

            {/* ---------- Sign Up Form ---------- */}
            <form
              className={`sign-up-form ${isSignUp ? "active" : ""}`}
              onSubmit={handleSubmit}
            >
              <h2 className="title">Create Account</h2>

              <div className="input-field">
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="input-field">
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="input-field">
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="input-field">
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
                  style={{
                    padding: "0.75rem",
                    border: "1px solid #ddd",
                    borderRadius: "25px",
                    width: "100%",
                    fontSize: "1rem",
                  }}
                >
                  <option value="admin">Admin</option>
                  <option value="employee">Employee</option>
                </select>
              </div>

              <button type="submit" className="btn solid">
                Sign Up
              </button>
            </form>
          </div>
        </div>

        {/* ---------- Sliding Panels ---------- */}
        <div className="panels-container">
          {/* Left Panel */}
          <div className="panel left-panel">
            <div className="content flex flex-col items-center gap-1">
              <img src="czar_logo.svg" alt="Logo" className="h-48 w-48" />
              <h3>New here?</h3>
              <p>Join us today and access your dashboard instantly.</p>
              <button className="btn transparent" onClick={toggleMode}>
                SIGN UP
              </button>
            </div>
          </div>

          {/* Right Panel */}
          <div className="panel right-panel">
            <div className="content flex flex-col items-center gap-1">
              <img src="czar_logo.svg" alt="Logo" className="h-48 w-48" />
              <h3>One of us?</h3>
              <p>Login to manage your account and view reports.</p>
              <button className="btn transparent" onClick={toggleMode}>
                SIGN IN
              </button>
            </div>
          </div>
        </div>

        {/* ---------- Messages ---------- */}
        {message && (
          <div
            className={`alert alert-${messageType} mt-3 text-center message`}
          >
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
