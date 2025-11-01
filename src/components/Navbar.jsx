import React from "react";
import { Link, useNavigate } from "react-router-dom";
import ScrapSailLogo from "./ScrapSailLogo";

const Navbar = () => {
  const navigate = useNavigate();
  
  // Get user role from localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userRole = user.role || 'user';

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/'); // Navigate to login page (root path)
  };

  // Navigation items based on user role
  const getNavigationItems = () => {
    switch (userRole) {
      case 'admin':
        return [
          { to: "/admin", label: "Admin Dashboard", icon: "🔐" },
          { to: "/leaderboard", label: "Leaderboard", icon: "🏆" }
        ];
      case 'collector':
        return [
          { to: "/collector", label: "Collector Dashboard", icon: "🚛" }
        ];
      default: // user - show old navbar
        return [
          { to: "/home", label: "Home", icon: "🏠" },
          { to: "/dashboard", label: "Dashboard", icon: "📊" },
          { to: "/leaderboard", label: "Leaderboard", icon: "🏆" },
          { to: "/pickup", label: "Pickup", icon: "♻️" },
          { to: "/wallet", label: "Wallet", icon: "💰" }
        ];
    }
  };

  return (
    <nav className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-4 rounded-b-2xl shadow-lg border border-yellow-300">
      <div className="flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center">
          <ScrapSailLogo size="medium" showText={true} />
        </div>
        
        {/* Navigation Links */}
        <div className="flex items-center space-x-6">
          {getNavigationItems().map((item) => (
            <Link 
              key={item.to}
              to={item.to} 
              className="text-white hover:text-green-300 transition-colors font-medium flex items-center space-x-1"
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
          
          {/* User Role Indicator */}
          <div className="px-3 py-1 bg-white/20 rounded-full text-white text-sm font-semibold">
            {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
          </div>
          
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
