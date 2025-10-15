import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

const BASE_URL = "http://localhost:5000";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [userType, setUserType] = useState("employee"); // admin | employee
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint =
        userType === "admin"
          ? `${BASE_URL}/api/auth/admin-login`
          : `${BASE_URL}/api/auth/login`;

      const response = await axios.post(endpoint, formData);
      login(response.data.user, response.data.token);

      setMessage(`${userType} login successful! Redirecting...`);
      setMessageType("success");

      setTimeout(() => {
        if (userType === "admin") navigate("/admin");
        else navigate("/");
      }, 800);
    } catch (error) {
      console.log(error);
      
      setMessage(error.response?.data?.message || "Login failed");
      setMessageType("error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8 border border-gray-100">
        {/* Header */}
        <div className="text-center mb-6">
          <img src="/czar_logo.svg" alt="Logo" className="mx-auto w-20 mb-2" />
          <h1 className="text-2xl font-bold text-gray-800">
            {userType === "admin" ? "Admin Login" : "Employee Login"}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Sign in to continue to your dashboard
          </p>
        </div>

        {/* Toggle Buttons */}
        <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setUserType("employee")}
            className={`flex-1 py-2 rounded-lg text-sm font-medium ${
              userType === "employee"
                ? "bg-blue-600 text-white"
                : "text-gray-600 hover:bg-gray-200"
            }`}
          >
            Employee
          </button>
          <button
            onClick={() => setUserType("admin")}
            className={`flex-1 py-2 rounded-lg text-sm font-medium ${
              userType === "admin"
                ? "bg-blue-600 text-white"
                : "text-gray-600 hover:bg-gray-200"
            }`}
          >
            Admin
          </button>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="********"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg shadow transition-all"
          >
            Sign In
          </button>
        </form>

        {/* Message */}
        {message && (
          <div
            className={`mt-4 text-center text-sm px-3 py-2 rounded-lg ${
              messageType === "success"
                ? "bg-green-100 text-green-700 border border-green-300"
                : "bg-red-100 text-red-700 border border-red-300"
            }`}
          >
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
