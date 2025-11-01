import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import ScrapSailLogo from "../components/ScrapSailLogo";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-teal-200">
      <Navbar />
      
      <div className="flex flex-col items-center justify-center p-4 pt-8">
        {/* Main Content Card */}
        <motion.div
          className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-4xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header Section */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <ScrapSailLogo size="large" showText={true} />
            </div>
            <p className="text-gray-600 text-lg">
              Turn your waste into wealth — recycle, earn carbon credits, and help build a cleaner planet.
            </p>
          </div>

          {/* Action Buttons Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Link 
              to="/pickup" 
              className="bg-green-500 hover:bg-green-600 text-white rounded-2xl p-6 text-center transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <div className="text-2xl font-bold mb-2">Request Pickup</div>
              <div className="text-sm opacity-90">Schedule collection</div>
            </Link>

            <Link 
              to="/leaderboard" 
              className="bg-orange-500 hover:bg-orange-600 text-white rounded-2xl p-6 text-center transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <div className="text-2xl font-bold mb-2">Leaderboard</div>
              <div className="text-sm opacity-90">Top eco-warriors</div>
            </Link>

            <Link 
              to="/wallet" 
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-2xl p-6 text-center transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <div className="text-2xl font-bold mb-2">Carbon Wallet</div>
              <div className="text-sm opacity-90">Track rewards</div>
            </Link>

            <Link 
              to="/dashboard" 
              className="bg-pink-500 hover:bg-pink-600 text-white rounded-2xl p-6 text-center transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <div className="text-2xl font-bold mb-2">Dashboard</div>
              <div className="text-sm opacity-90">View analytics</div>
            </Link>
          </div>

          {/* Statistics Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">10K+</div>
              <div className="text-gray-600 font-medium">Tons Recycled</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">5K+</div>
              <div className="text-gray-600 font-medium">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">50K+</div>
              <div className="text-gray-600 font-medium">Carbon Credits</div>
            </div>
          </div>
        </motion.div>

        {/* Footer Message */}
        <motion.div
          className="mt-8 bg-white rounded-2xl shadow-lg p-6 max-w-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <p className="text-gray-600 text-center text-lg">
            Every small action counts — together, we build a sustainable future
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Home;