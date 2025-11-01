import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API_CONFIG from "../config/api";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  });
  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState(""); // 'success' or 'error'

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setMsg("Passwords do not match!");
      setMsgType("error");
      return;
    }
    
    try {
      const baseUrl = process.env.REACT_APP_API_BASE_URL || process.env.REACT_APP_API_URL || API_CONFIG.SPRING_BOOT_URL;
      const response = await fetch(`${baseUrl}${API_CONFIG.ENDPOINTS.AUTH.REGISTER}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone
        })
      });

      const data = await response.json();

      if (data.success) {
        setMsg("✅ Registration successful! Redirecting to login...");
        setMsgType("success");
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      } else {
        setMsg(data.message || 'Registration failed. Please try again.');
        setMsgType("error");
      }
    } catch (error) {
      console.error('Registration error:', error);
      setMsg('Registration failed. Could not connect to server.');
      setMsgType("error");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-teal-200">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-xl shadow-2xl p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-green-600 mb-2">Join ScrapSail! 🌱</h2>
              <p className="text-gray-600">Create your account and start recycling</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter your phone number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Create a password"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Confirm your password"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-green-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-600 transition duration-200"
              >
                Create Account
              </button>
            </form>

            {msg && (
              <div className={`mt-4 text-center text-sm p-3 rounded-lg ${
                msgType === 'success' 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-red-100 text-red-700'
              }`}>
                {msg}
              </div>
            )}

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Already have an account?{" "}
                <Link to="/login" className="text-green-600 hover:text-green-700 font-semibold">
                  Sign in here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;