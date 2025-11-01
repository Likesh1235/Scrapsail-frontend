import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API_CONFIG from "../config/api";
import API from "../api";

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password, role } = formData;
    
    console.log('🔐 Attempting login for:', email, 'as', role);
    
    try {
      // Use centralized API configuration - clean and simple
      let endpoint;
      if (role === 'admin') {
        endpoint = API_CONFIG.ENDPOINTS.AUTH.ADMIN_LOGIN;
      } else if (role === 'collector') {
        endpoint = API_CONFIG.ENDPOINTS.AUTH.COLLECTOR_LOGIN;
      } else {
        endpoint = API_CONFIG.ENDPOINTS.AUTH.LOGIN;
      }
      
      // Build full URL using centralized config
      const apiUrl = `${API}${endpoint}`;
      
      console.log('📡 Using endpoint:', endpoint);
      console.log('🌐 API URL:', apiUrl);
      console.log('🔧 API base:', API);
      console.log('🔧 Environment:', process.env.REACT_APP_API_BASE_URL);
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password
        }),
        credentials: 'include' // Include credentials for CORS
      });

      // Check if response is OK before parsing JSON
      if (!response.ok) {
        // Try to parse error message if available
        let errorMessage = `Server error: ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          // If JSON parsing fails, use status text
          errorMessage = response.statusText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('📥 Login response:', data);

      if (data.success && data.user) {
        console.log('✅ Login successful! User role:', data.user.role);
        
        // Store JWT token and user data
        const userData = {
          id: data.user.id,
          email: data.user.email,
          name: data.user.name,
          role: data.user.role.toLowerCase()
        };
        
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(userData));
        console.log('💾 Stored user data:', userData);
        
        // Navigate based on role
        const userRole = data.user.role.toLowerCase();
        console.log('🧭 Navigating based on role:', userRole);
        
        if (userRole === 'admin') {
          console.log('➡️ Redirecting to /admin-dashboard');
          navigate('/admin-dashboard');
        } else if (userRole === 'collector') {
          console.log('➡️ Redirecting to /collector-dashboard');
          navigate('/collector-dashboard');
        } else {
          console.log('➡️ Redirecting to /dashboard');
          navigate('/dashboard');
        }
      } else {
        console.error('❌ Login failed:', data.message);
        alert(data.message || 'Invalid credentials! Please check your email and password.');
      }
    } catch (error) {
      console.error('❌ Login error:', error);
      console.error('❌ Error type:', error.constructor.name);
      console.error('❌ Error message:', error.message);
      console.error('❌ Error stack:', error.stack);
      
      // Provide more specific error messages
      if (error.message && (error.message.includes('Failed to fetch') || error.message.includes('NetworkError') || error.message.includes('Network request failed'))) {
        const apiUrl = `${API}${API_CONFIG.ENDPOINTS.AUTH.LOGIN}`;
        alert(`⚠️ Cannot connect to server!\n\nTrying to connect to: ${apiUrl}\n\nPlease ensure:\n1. Backend is running: http://localhost:8080\n2. Check browser console (F12) for details\n3. Verify CORS settings\n\nTest backend: http://localhost:8080/health`);
      } else if (error.message) {
        alert(`Login failed: ${error.message}`);
      } else {
        alert('Login failed. Could not connect to server. Please ensure the backend is running on http://localhost:8080');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-teal-200">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-xl shadow-2xl p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-green-600 mb-2">Welcome Back! 🌱</h2>
              <p className="text-gray-600">Sign in to your ScrapSail account</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
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
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter your password"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                  <option value="collector">Collector</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-green-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-600 transition duration-200"
              >
                Sign In
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Don't have an account?{" "}
                <a href="/register" className="text-green-600 hover:text-green-700 font-semibold">
                  Sign up here
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;