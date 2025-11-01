import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API_CONFIG from "../config/api";

export default function CarbonCredits() {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedReward, setSelectedReward] = useState(null);
  const [rewards, setRewards] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [carbonCredits, setCarbonCredits] = useState(0);

  // Fetch real data from backend
  useEffect(() => {
    const fetchCarbonData = async () => {
      try {
        const baseUrl = process.env.REACT_APP_API_BASE_URL || process.env.REACT_APP_API_URL || API_CONFIG.SPRING_BOOT_URL;
        const userData = JSON.parse(localStorage.getItem('user') || '{}');
        if (userData.email) {
          // Fetch carbon credits and transactions from Spring Boot backend
          const response = await fetch(`${baseUrl}/api/carbon-wallet/${userData.email}`);
          
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          
          const data = await response.json();
          
          if (data.success) {
            setCarbonCredits(data.balance || 0);
            setTransactions(data.transactions || []);
          }
        }
        
        // Fetch available rewards from backend
        const rewardsResponse = await fetch(`${baseUrl}/api/rewards`);
        
        if (!rewardsResponse.ok) {
          throw new Error(`HTTP error! status: ${rewardsResponse.status}`);
        }
        
        const rewardsData = await rewardsResponse.json();
        
        if (rewardsData.success) {
          setRewards(rewardsData.rewards || []);
        } else {
          // Fallback rewards if API fails
          setRewards([
            { id: 1, name: "Eco Water Bottle", cost: 500, emoji: "🍃", description: "Sustainable bamboo water bottle" },
            { id: 2, name: "Plant a Tree", cost: 1000, emoji: "🌱", description: "Plant a tree in your name" },
            { id: 3, name: "Solar Power Bank", cost: 1500, emoji: "☀️", description: "Portable solar charging device" },
            { id: 4, name: "Organic Tote Bag", cost: 300, emoji: "👜", description: "100% organic cotton tote bag" },
            { id: 5, name: "LED Bulb Set", cost: 800, emoji: "💡", description: "Energy-efficient LED bulbs" },
            { id: 6, name: "Compost Kit", cost: 1200, emoji: "🌿", description: "Home composting starter kit" }
          ]);
        }
      } catch (error) {
        console.error('Failed to fetch carbon data:', error);
        
        // Show user-friendly error message
        if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
          console.error('❌ Cannot connect to backend server. Please ensure the backend is running on http://localhost:8080');
          alert('⚠️ Cannot connect to server. Please ensure the backend server is running on http://localhost:8080');
        }
        
        // Fallback data
        setCarbonCredits(0);
        setTransactions([]);
        setRewards([
          { id: 1, name: "Eco Water Bottle", cost: 500, emoji: "🍃", description: "Sustainable bamboo water bottle" },
          { id: 2, name: "Plant a Tree", cost: 1000, emoji: "🌱", description: "Plant a tree in your name" },
          { id: 3, name: "Solar Power Bank", cost: 1500, emoji: "☀️", description: "Portable solar charging device" },
          { id: 4, name: "Organic Tote Bag", cost: 300, emoji: "👜", description: "100% organic cotton tote bag" },
          { id: 5, name: "LED Bulb Set", cost: 800, emoji: "💡", description: "Energy-efficient LED bulbs" },
          { id: 6, name: "Compost Kit", cost: 1200, emoji: "🌿", description: "Home composting starter kit" }
        ]);
      }
    };

    fetchCarbonData();
  }, []);

  const showNotification = (message, type = 'success') => {
    const notification = document.createElement('div');
    const bgColor = type === 'error' ? 'bg-red-500' : 'bg-green-500';
    notification.className = `fixed top-4 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg z-50`;
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
  };

  const handleRedeem = (reward) => {
    if (carbonCredits >= reward.cost) {
      showNotification(`Successfully redeemed ${reward.name}! 🎉`);
      setSelectedReward(null);
    } else {
      showNotification("Insufficient carbon credits!", 'error');
    }
  };

  return (
    <>
      <style jsx>{`
        body { box-sizing: border-box; }
        .gradient-card { background: linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05)); backdrop-filter: blur(10px); }
        .reward-card:hover { transform: translateY(-5px) scale(1.02); }
        .modal-backdrop { background: rgba(0,0,0,0.5); backdrop-filter: blur(5px); }
      `}</style>

      <div className="min-h-full bg-gradient-to-br from-green-50 via-emerald-100 to-teal-200">
        {/* Header */}
        <header className="bg-white/90 backdrop-blur-sm shadow-lg border-b border-emerald-200">
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <Link to="/dashboard" className="text-green-600 hover:text-green-700">
                <span className="text-2xl">←</span>
              </Link>
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                <span className="text-xl">💰</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-800">Carbon Credits</h1>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Your Balance</p>
              <p className="text-2xl font-bold text-green-600">{carbonCredits.toLocaleString()} Credits</p>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Balance Card */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-3xl p-8 mb-8 shadow-2xl">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-bold mb-2">💰 {carbonCredits.toLocaleString()} Credits</h2>
                <p className="text-green-100 mb-4">Keep recycling to earn more!</p>
                <div className="flex space-x-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold">{Math.floor(carbonCredits * 0.28)}</p>
                    <p className="text-sm text-green-100">This Month</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">{carbonCredits}</p>
                    <p className="text-sm text-green-100">All Time</p>
                  </div>
                </div>
              </div>
              <div className="text-6xl opacity-20">🌱</div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden mb-8">
            <div className="flex border-b border-gray-200">
              {["overview", "rewards", "history"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-4 font-semibold capitalize transition-colors ${
                    activeTab === tab
                      ? "bg-green-500 text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {tab === "overview" && "📊"} {tab === "rewards" && "🎁"} {tab === "history" && "📜"} {tab}
                </button>
              ))}
            </div>

            <div className="p-6">
              {activeTab === "overview" && (
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-gray-800">How to Earn More Credits</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-6 bg-green-50 rounded-xl border border-green-200">
                      <div className="text-3xl mb-3">♻️</div>
                      <h4 className="font-semibold mb-2">Recycle Materials</h4>
                      <p className="text-sm text-gray-600">Earn 10-50 credits per kg of recycled materials</p>
                    </div>
                    <div className="p-6 bg-blue-50 rounded-xl border border-blue-200">
                      <div className="text-3xl mb-3">🚛</div>
                      <h4 className="font-semibold mb-2">Schedule Pickups</h4>
                      <p className="text-sm text-gray-600">Get bonus credits for regular pickup schedules</p>
                    </div>
                    <div className="p-6 bg-purple-50 rounded-xl border border-purple-200">
                      <div className="text-3xl mb-3">👥</div>
                      <h4 className="font-semibold mb-2">Refer Friends</h4>
                      <p className="text-sm text-gray-600">Earn 100 credits for each successful referral</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "rewards" && (
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-gray-800">Available Rewards</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {rewards.map((reward) => (
                      <div key={reward.id} className="reward-card p-6 bg-white border border-gray-200 rounded-xl shadow-lg transition-all duration-300 cursor-pointer" onClick={() => setSelectedReward(reward)}>
                        <div className="text-4xl mb-3">{reward.emoji}</div>
                        <h4 className="font-semibold mb-2">{reward.name}</h4>
                        <p className="text-sm text-gray-600 mb-4">{reward.description}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-bold text-green-600">{reward.cost} Credits</span>
                          <button className={`px-4 py-2 rounded-lg font-semibold transition ${carbonCredits >= reward.cost ? 'bg-green-500 text-white hover:bg-green-600' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}>
                            {carbonCredits >= reward.cost ? 'Redeem' : 'Need More'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "history" && (
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-gray-800">Transaction History</h3>
                  <div className="space-y-4">
                    {transactions.map((transaction, index) => (
                      <div key={index} className="flex justify-between items-center p-4 bg-white border border-gray-200 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${transaction.type === 'Earned' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                            {transaction.type === 'Earned' ? '↗️' : '↙️'}
                          </div>
                          <div>
                            <p className="font-semibold">{transaction.description}</p>
                            <p className="text-sm text-gray-600">{transaction.date}</p>
                          </div>
                        </div>
                        <div className={`text-lg font-bold ${transaction.type === 'Earned' ? 'text-green-600' : 'text-red-600'}`}>
                          {transaction.type === 'Earned' ? '+' : ''}{transaction.amount}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Reward Modal */}
        {selectedReward && (
          <div className="fixed inset-0 modal-backdrop flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl transform scale-100 transition-all">
              <div className="text-center">
                <div className="text-6xl mb-4">{selectedReward.emoji}</div>
                <h3 className="text-2xl font-bold mb-2">{selectedReward.name}</h3>
                <p className="text-gray-600 mb-6">{selectedReward.description}</p>
                <div className="text-3xl font-bold text-green-600 mb-6">{selectedReward.cost} Credits</div>
                <div className="flex space-x-4">
                  <button
                    onClick={() => setSelectedReward(null)}
                    className="flex-1 px-6 py-3 bg-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-400 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleRedeem(selectedReward)}
                    className={`flex-1 px-6 py-3 rounded-xl font-semibold transition ${carbonCredits >= selectedReward.cost ? 'bg-green-500 text-white hover:bg-green-600' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                    disabled={carbonCredits < selectedReward.cost}
                  >
                    Redeem Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
