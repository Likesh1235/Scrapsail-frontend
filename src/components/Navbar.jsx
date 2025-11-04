import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import { getTranslation } from "../translations/translations";
import ScrapSailLogo from "./ScrapSailLogo";
import LanguageSwitcher from "./LanguageSwitcher";

const Navbar = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = (key) => getTranslation(key, language);
  
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
          { to: "/admin", label: t("adminDashboard"), icon: "🔐" },
          { to: "/leaderboard", label: t("leaderboard"), icon: "🏆" }
        ];
      case 'collector':
        return [
          { to: "/collector", label: t("collectorDashboard"), icon: "🚛" }
        ];
      default: // user - show old navbar
        return [
          { to: "/home", label: t("home"), icon: "🏠" },
          { to: "/dashboard", label: t("dashboard"), icon: "📊" },
          { to: "/leaderboard", label: t("leaderboard"), icon: "🏆" },
          { to: "/pickup", label: t("pickup"), icon: "♻️" },
          { to: "/wallet", label: t("wallet"), icon: "💰" }
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
        <div className="flex items-center space-x-4">
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
          
          {/* Language Switcher */}
          <LanguageSwitcher />
          
          {/* User Role Indicator */}
          <div className="px-3 py-1 bg-white/20 rounded-full text-white text-sm font-semibold">
            {t(userRole)}
          </div>
          
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            {t("logout")}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
