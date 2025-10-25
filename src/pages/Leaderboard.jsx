import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";

const Leaderboard = () => {
  // Get user role from localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userRole = user.role || 'user';
  const leaderboardData = [
    { rank: 1, name: "Likesh", points: 320, medal: "🥇" },
    { rank: 2, name: "Vishal", points: 280, medal: "🥈" },
    { rank: 3, name: "Kavin", points: 260, medal: "🥉" },
    { rank: 4, name: "Priya", points: 210, medal: "4" },
    { rank: 5, name: "Sanjay", points: 180, medal: "5" }
  ];

  const getRowBackground = (index) => {
    return index % 2 === 0 ? "bg-yellow-50" : "bg-gray-50";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-teal-200">
      <Navbar />
      
      <div className="flex justify-center items-center p-4 pt-8">
        <motion.div
          className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-4xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <span className="text-4xl mr-3">🏆</span>
              <h1 className="text-4xl font-bold text-green-600">Carbon Credit Leaderboard</h1>
            </div>
            <p className="text-gray-500 text-lg">
              Celebrating eco-warriors making a difference 🌍
            </p>
          </div>

          {/* Leaderboard Table */}
          <div className="mb-8">
            <div className="overflow-hidden rounded-xl border border-gray-200">
              {/* Table Header */}
              <div className="bg-green-600 text-white">
                <div className="grid grid-cols-3 gap-4 p-4 font-bold">
                  <div>Rank</div>
                  <div>Name</div>
                  <div>Points</div>
                </div>
              </div>

              {/* Table Body */}
              <div className="divide-y divide-gray-200">
                {leaderboardData.map((person, index) => (
                  <motion.div
                    key={person.rank}
                    className={`grid grid-cols-3 gap-4 p-4 ${getRowBackground(index)}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex items-center">
                      <span className="text-2xl mr-2">{person.medal}</span>
                    </div>
                    <div className="flex items-center">
                      <span className={`font-semibold ${index === 0 ? 'font-bold text-black' : 'text-gray-800'}`}>
                        {person.name}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-green-600 font-semibold">{person.points}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center space-x-6 mb-8">
            {userRole === 'admin' ? (
              <Link
                to="/admin"
                className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center"
              >
                <span className="mr-2">🔐</span>
                Back to Admin Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/wallet"
                  className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center"
                >
                  <span className="mr-2">🌱</span>
                  View My Carbon Wallet
                </Link>
                
                <Link
                  to="/dashboard"
                  className="bg-gradient-to-r from-yellow-400 to-pink-500 hover:from-yellow-500 hover:to-pink-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center"
                >
                  <span className="mr-2">📊</span>
                  Go to Dashboard
                </Link>
              </>
            )}
          </div>

          {/* Footer Message */}
          <div className="text-center">
            <p className="text-gray-500 text-sm">
              🌱 Keep recycling — every action counts toward a greener tomorrow.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Leaderboard;