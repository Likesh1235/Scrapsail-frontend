import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "user"
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { email, password, role } = formData;
    
    // Fixed credentials for admin and collector
    const fixedCredentials = {
      admin: { email: "admin@scrapsail.com", password: "admin123", name: "Admin User" },
      collector: { email: "collector@scrapsail.com", password: "collector123", name: "Collector User" }
    };
    
    let isValid = false;
    let userData = {};
    
    if (role === 'admin') {
      // Only allow admin@scrapsail.com for admin role
      const credentials = fixedCredentials.admin;
      if (email === credentials.email && password === credentials.password) {
        isValid = true;
        userData = {
          email: credentials.email,
          role: 'admin',
          name: credentials.name,
          id: 1
        };
      }
    } else if (role === 'collector') {
      // Only allow collector@scrapsail.com for collector role
      const credentials = fixedCredentials.collector;
      if (email === credentials.email && password === credentials.password) {
        isValid = true;
        userData = {
          email: credentials.email,
          role: 'collector',
          name: credentials.name,
          id: 2
        };
      }
    } else if (role === 'user') {
      // Allow any email EXCEPT admin@scrapsail.com and collector@scrapsail.com
      const restrictedEmails = ['admin@scrapsail.com', 'collector@scrapsail.com'];
      
      if (email && password && !restrictedEmails.includes(email.toLowerCase())) {
        isValid = true;
        userData = {
          email: email,
          role: 'user',
          name: email.split('@')[0], // Extract name from email
          id: Date.now() // Generate unique ID
        };
      } else if (restrictedEmails.includes(email.toLowerCase())) {
        alert(`❌ This email is reserved for ${email === 'admin@scrapsail.com' ? 'Admin' : 'Collector'} role. Please use a different email for user registration.`);
        return;
      }
    }
    
    if (isValid) {
      localStorage.setItem('user', JSON.stringify(userData));
      
      if (role === 'user') {
        alert(`✅ Logged in as ${userData.name} (USER)`);
      } else {
        alert(`✅ Logged in as ${userData.name} (${role.toUpperCase()})`);
      }
      
      // Navigate based on role
      if (role === "admin") {
        navigate("/admin");
      } else if (role === "collector") {
        navigate("/collector");
      } else {
        navigate("/"); // user goes to home page
      }
    } else {
      if (role === 'admin') {
        alert(`❌ Invalid admin credentials. Use:\nEmail: admin@scrapsail.com\nPassword: admin123`);
      } else if (role === 'collector') {
        alert(`❌ Invalid collector credentials. Use:\nEmail: collector@scrapsail.com\nPassword: collector123`);
      } else {
        alert("❌ Please enter a valid email and password for user login!\nNote: admin@scrapsail.com and collector@scrapsail.com are reserved.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-green-100">
      <Navbar />
      
      <div className="flex justify-center items-center min-h-[calc(100vh-80px)] p-4">
        <div className="bg-white rounded-3xl shadow-lg p-8 w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <span className="text-3xl mr-3">♻️</span>
              <h1 className="text-3xl font-bold text-green-600">ScrapSail Login</h1>
            </div>
          </div>
          
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input
                type="email"
                name="email"
                placeholder="Enter Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border border-gray-300 p-4 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none text-gray-700"
              />
            </div>
            
            <div>
              <input
                type="password"
                name="password"
                placeholder="Enter Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full border border-gray-300 p-4 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none text-gray-700"
              />
            </div>
            
            <div>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full border border-gray-300 p-4 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none text-gray-700"
              >
                <option value="user">User</option>
                <option value="collector">Collector</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            
            <button
              type="submit"
              className="w-full bg-green-600 text-white font-semibold py-4 rounded-lg hover:bg-green-700 transition-colors duration-200"
            >
              Login
            </button>
          </form>
          
          {/* Registration Link */}
          <div className="text-center mt-6">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <a href="/register" className="text-green-600 font-semibold hover:underline">
                Register here
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;