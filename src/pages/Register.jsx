import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user",
  });
  const [msg, setMsg] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setMsg("Passwords do not match!");
      return;
    }
    // Simulate registration (you can later connect this to backend)
    alert(`Registered as ${formData.role.toUpperCase()}`);
    setMsg("Registration successful! Redirecting to login...");
    setTimeout(() => {
      navigate("/login");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-teal-200">
      <Navbar />
      
      <div className="flex justify-center items-center min-h-[calc(100vh-80px)] p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 w-96">
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
            Register
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              className="w-full border p-2 rounded"
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="w-full border p-2 rounded"
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="w-full border p-2 rounded"
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              className="w-full border p-2 rounded"
              onChange={handleChange}
              required
            />
            <select
              name="role"
              className="w-full border p-2 rounded"
              onChange={handleChange}
              value={formData.role}
            >
              <option value="user">User</option>
              <option value="collector">Collector</option>
              <option value="admin">Admin</option>
            </select>
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg transition-all"
            >
              Register
            </button>
          </form>
          {msg && <p className="text-center text-sm mt-4 text-red-500">{msg}</p>}
          <div className="text-center mt-4 text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-indigo-600 hover:underline">
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;