import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import { API_CONFIG } from "../config/api";

const CarbonWallet = () => {
  const [totalPoints, setTotalPoints] = useState(0);
  const [walletBalance, setWalletBalance] = useState(0.00);
  const [lastRedeem, setLastRedeem] = useState(0.00);
  const [remainingPoints, setRemainingPoints] = useState(0);
  const [redeemedAmount, setRedeemedAmount] = useState(0); // Store the actual redeemed amount
  const [rate] = useState("₹1/point");
  const [message, setMessage] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWalletData();
  }, []);

  const fetchWalletData = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      if (userData.id) {
        // Fetch wallet from Spring Boot backend
        const response = await fetch(`${API_CONFIG.SPRING_BOOT_URL}/api/wallet/${userData.id}`);
        const data = await response.json();
        
        if (data.success && data.data) {
          setTotalPoints(data.data.points || 0);
          setWalletBalance(data.data.balance || 0);
          setLastRedeem(data.data.totalRedeemed || 0);
          setRemainingPoints(data.data.points || 0);
        } else {
          // Initialize wallet for new user
          setTotalPoints(0);
          setWalletBalance(0);
          setLastRedeem(0);
          setRemainingPoints(0);
        }
      }
    } catch (error) {
      console.error('Failed to fetch wallet data:', error);
      setMessage('⚠️ Failed to load wallet data. Please refresh.');
    } finally {
      setLoading(false);
    }
  };

  const handleRedeem = async () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (!user.id) {
      setMessage('❌ Please login first to redeem points!');
      return;
    }

    if (walletBalance < 100) {
      setMessage('❌ Minimum ₹100 balance required for redemption!');
      return;
    }

    const amountToRedeem = prompt('Enter amount to redeem (minimum ₹100):');
    if (!amountToRedeem || amountToRedeem < 100) {
      setMessage('❌ Invalid amount! Minimum ₹100 required.');
      return;
    }

    if (amountToRedeem > walletBalance) {
      setMessage('❌ Insufficient balance!');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_CONFIG.SPRING_BOOT_URL}/api/wallet/redeem?userId=${user.id}&amount=${amountToRedeem}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const data = await response.json();
      
      if (data.success && data.data) {
        // Store the actual redeemed amount from API response
        const actualRedeemedAmount = data.data.redeemedAmount || amountToRedeem;
        setRedeemedAmount(actualRedeemedAmount);
        
        // Update local wallet state
        setWalletBalance(data.data.balance || 0);
        setTotalPoints(data.data.points || 0);
        setLastRedeem(data.data.totalRedeemed || 0);
        setRemainingPoints(data.data.points || 0);
        setMessage(`✅ Successfully redeemed ₹${actualRedeemedAmount}!`);
        setShowSuccessModal(true);
        
        // Refresh wallet data
        setTimeout(() => fetchWalletData(), 2000);
      } else {
        setMessage(data.message || '❌ Redemption failed!');
      }
    } catch (error) {
      console.error('Redemption error:', error);
      setMessage('❌ Redemption failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-green-100">
      <Navbar />
      
      {/* Main Content */}
      <div className="flex justify-center items-center min-h-[calc(100vh-80px)] p-4">
        <motion.div
          className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-green-600">Carbon Credit Wallet</h1>
            <p className="text-gray-600 mt-2">Redeem your points and withdraw to your bank account</p>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="mb-6 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-green-500 border-t-transparent"></div>
              <p className="text-gray-600 mt-2">Loading wallet data...</p>
            </div>
          )}

          {/* Message Display */}
          {message && (
            <div className={`mb-6 p-4 rounded-lg text-center font-semibold ${
              message.includes('✅') ? 'bg-green-100 text-green-800' :
              message.includes('❌') ? 'bg-red-100 text-red-800' :
              message.includes('ℹ️') ? 'bg-blue-100 text-blue-800' :
              'bg-yellow-100 text-yellow-800'
            }`}>
              {message}
            </div>
          )}

          {/* Wallet Overview */}
          <div className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Total Points */}
              <div className="bg-gray-50 rounded-xl p-6 text-center">
                <h3 className="text-gray-600 text-sm font-semibold mb-2">Total Points</h3>
                <p className="text-4xl font-bold text-green-600">{totalPoints}</p>
              </div>
              
              {/* Wallet Balance */}
              <div className="bg-gray-50 rounded-xl p-6 text-center">
                <h3 className="text-gray-600 text-sm font-semibold mb-2">Wallet Balance</h3>
                <p className="text-4xl font-bold text-green-600">₹{walletBalance.toFixed(2)}</p>
              </div>
            </div>

            {/* Redeem Button */}
            <div className="text-center mb-4">
              <button
                onClick={handleRedeem}
                className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200"
              >
                Redeem Points
              </button>
            </div>

            {/* Conversion Rate */}
            <div className="text-center">
              <p className="text-gray-600 text-sm">Conversion Rate: 1 point = ₹1</p>
              <p className="text-gray-500 text-xs mt-1">Minimum withdrawal: ₹100</p>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200 mb-8"></div>

          {/* Transaction Summary */}
          <div>
            <h2 className="text-xl font-bold text-green-600 mb-6">Transaction Summary</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-gray-700">Last Redeem</span>
                <span className="font-semibold text-green-600">₹{lastRedeem.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-gray-700">Remaining Points</span>
                <span className="font-semibold text-green-600">{remainingPoints}</span>
              </div>
              
              <div className="flex justify-between items-center py-3">
                <span className="text-gray-700">Rate</span>
                <span className="font-semibold text-green-600">{rate}</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 max-w-md mx-4 text-center shadow-2xl">
            <div className="text-6xl mb-4">💰</div>
            <h2 className="text-2xl font-bold text-green-600 mb-2">Redemption Successful!</h2>
            <p className="text-gray-600 mb-4">
              You have successfully redeemed <span className="font-bold text-green-600">{redeemedAmount}</span> points
            </p>
            <div className="bg-green-50 rounded-xl p-4 mb-6">
              <div className="text-lg font-semibold text-green-700">₹{redeemedAmount}</div>
              <div className="text-sm text-green-600">Amount credited to your account</div>
            </div>
            <div className="bg-blue-50 rounded-xl p-4 mb-6">
              <div className="text-sm text-blue-600">New Balance: <span className="font-bold">₹{walletBalance.toFixed(2)}</span></div>
              <div className="text-sm text-blue-600">Total Redeemed: <span className="font-bold">₹{lastRedeem.toFixed(2)}</span></div>
            </div>
            <button
              onClick={() => setShowSuccessModal(false)}
              className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-semibold transition-colors duration-200"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CarbonWallet;
