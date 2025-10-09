import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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
      setMessageType("error");
    }
  };

  const toggleMode = () => {
    setIsSignUp((prev) => !prev);
    setFormData({ name: "", email: "", password: "", role: "admin" });
    setMessage("");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-600 to-indigo-700 px-4 relative overflow-hidden">
      {/* Animated Background Circles */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500/30 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-indigo-500/30 rounded-full blur-3xl animate-pulse"></div>

      <div className="relative bg-white rounded-2xl shadow-2xl flex w-full max-w-5xl min-h-[550px] overflow-hidden transition-all duration-700">
        {/* ---------- Form Section ---------- */}
        <div
          className={`flex-1 flex flex-col justify-center px-10 py-8 transition-all duration-700 ${
            isSignUp ? "translate-x-full opacity-0" : "translate-x-0 opacity-100"
          } absolute w-1/2`}
        >
          <h2 className="text-3xl font-bold text-blue-700 mb-6 text-center">
            Sign In
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />

            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition"
            >
              Sign In
            </button>
          </form>
        </div>

        {/* ---------- Sign Up Section ---------- */}
        <div
          className={`flex-1 flex flex-col justify-center px-10 py-8 transition-all duration-700 ${
            isSignUp ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"
          } absolute right-0 w-1/2`}
        >
          <h2 className="text-3xl font-bold text-blue-700 mb-6 text-center">
            Create Account
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="admin">Admin</option>
              <option value="employee">Employee</option>
            </select>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition"
            >
              Sign Up
            </button>
          </form>
        </div>

        {/* ---------- Side Panels ---------- */}
        <div
          className={`absolute top-0 bottom-0 flex items-center justify-center w-1/2 text-white bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-700 ${
            isSignUp ? "translate-x-0 left-0" : "translate-x-full right-0"
          }`}
        >
          <div className="text-center space-y-4 px-6">
            <img
              src="czar_logo.svg"
              alt="Logo"
              className="h-32 w-32 mx-auto drop-shadow-lg"
            />
            <h3 className="text-2xl font-semibold">
              {isSignUp ? "One of us?" : "New here?"}
            </h3>
            <p className="text-blue-100">
              {isSignUp
                ? "Login to manage your account and reports."
                : "Join us today and access your dashboard instantly."}
            </p>
            <button
              onClick={toggleMode}
              className="mt-4 px-8 py-2 border-2 border-white rounded-full hover:bg-white hover:text-blue-700 transition-all font-medium"
            >
              {isSignUp ? "SIGN IN" : "SIGN UP"}
            </button>
          </div>
        </div>

        {/* ---------- Message Section ---------- */}
        {message && (
          <div
            className={`absolute bottom-6 left-1/2 -translate-x-1/2 px-6 py-3 rounded-lg shadow-md text-white font-medium ${
              messageType === "success" ? "bg-green-600" : "bg-red-600"
            }`}
          >
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
