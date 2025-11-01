import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import { API_CONFIG } from "../config/api";

const Leaderboard = () => {
  // Get user role from localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userRole = user.role || 'user';
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        // Fetch real leaderboard data from backend
        const response = await fetch(`${API_CONFIG.SPRING_BOOT_URL}/api/leaderboard`);
        const data = await response.json();
        
        console.log('📊 Leaderboard response:', data);
        
        if (data.success) {
          setLeaderboardData(data.leaderboard || []);
        } else {
          // Fallback to empty array if no data
          setLeaderboardData([]);
        }
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
        // Fallback to empty array
        setLeaderboardData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboardData();
  }, []);

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
                {loading ? (
                  <div className="p-8 text-center">
                    <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading leaderboard...</p>
                  </div>
                ) : leaderboardData.length === 0 ? (
                  <div className="p-8 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">📭</span>
                    </div>
                    <h4 className="text-lg font-semibold text-gray-600 mb-2">No Data Yet</h4>
                    <p className="text-gray-500">Start recycling to appear on the leaderboard!</p>
                  </div>
                ) : (
                  leaderboardData.map((person, index) => (
                    <motion.div
                      key={person.rank}
                      className={`grid grid-cols-3 gap-4 p-4 ${getRowBackground(index)}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="flex items-center">
                        <span className="text-2xl mr-2">{person.medal || (index + 1)}</span>
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
                  ))
                )}
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