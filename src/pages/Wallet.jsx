import React, { useState, useEffect } from "react";
import { API_CONFIG } from "../config/api";

export default function Wallet() {
  const [balance, setBalance] = useState(0);
  const [points, setPoints] = useState(0);
  const [totalRedeemed, setTotalRedeemed] = useState(0);
  const [userId, setUserId] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [creditAmount, setCreditAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [redeemAmount, setRedeemAmount] = useState(0);

  useEffect(() => {
    // Fetch real wallet data from Spring Boot backend
    const fetchWalletData = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem('user') || '{}');
        if (userData.id) {
          setUserId(userData.id);
          // Fetch wallet from Spring Boot backend
          const response = await fetch(`${API_CONFIG.SPRING_BOOT_URL}/api/wallet/${userData.id}`);
          const data = await response.json();
          
          if (data.success && data.data) {
            setBalance(data.data.balance || 0);
            setPoints(data.data.points || 0);
            setTotalRedeemed(data.data.totalRedeemed || 0);
          } else {
            // Initialize wallet for new user
            setBalance(0);
            setPoints(0);
            setTotalRedeemed(0);
          }
        }
      } catch (error) {
        console.error('Failed to fetch wallet data:', error);
        setBalance(0);
        setPoints(0);
        setTotalRedeemed(0);
      }
    };

    fetchWalletData();
  }, []);

  const showNotification = (message, type = 'success') => {
    const notification = document.createElement('div');
    const bgColor = type === 'error' ? 'bg-red-500' : 'bg-green-500';
    notification.className = `fixed top-4 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg z-50`;
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
  };

  const handleAddCredit = async (e) => {
    e.preventDefault();
    if (!creditAmount || creditAmount <= 0) {
      showNotification("Please enter a valid amount!", 'error');
      return;
    }

    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const newTransaction = {
        id: transactions.length + 1,
        type: 'credit',
        amount: parseInt(creditAmount),
        description: 'Manual credit addition',
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString('en-US', { hour12: false }).slice(0, 5),
        status: 'completed'
      };
      
      setTransactions([newTransaction, ...transactions]);
      setBalance(prev => prev + parseInt(creditAmount));
      setCreditAmount("");
      setLoading(false);
      showNotification(`Successfully added ${creditAmount} credits! 🎉`);
    }, 1000);
  };

  const handleRedeem = async () => {
    if (balance < 50) {
      showNotification("Minimum ₹50 required for redemption!", 'error');
      return;
    }

    if (!userId) {
      showNotification("Please login first to redeem!", 'error');
      return;
    }

    const amountToRedeem = prompt('Enter amount to redeem (minimum ₹50):');
    if (!amountToRedeem || amountToRedeem < 50) {
      showNotification("Invalid amount!", 'error');
      return;
    }

    if (amountToRedeem > balance) {
      showNotification("Insufficient balance!", 'error');
      return;
    }

    try {
      setLoading(true);
      // Call Spring Boot redemption API
      const response = await fetch(`${API_CONFIG.SPRING_BOOT_URL}/api/wallet/redeem?userId=${userId}&amount=${amountToRedeem}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount: amountToRedeem })
      });

      const data = await response.json();
      
      if (data.success && data.data) {
        // Update local wallet state
        setBalance(data.data.balance || 0);
        setPoints(data.data.points || 0);
        setTotalRedeemed(data.data.totalRedeemed || 0);
        setRedeemAmount(data.data.redeemedAmount || amountToRedeem);
        setShowSuccessModal(true);
        showNotification(data.message || `Successfully redeemed \u20b9${amountToRedeem}! 💰`);
      } else {
        showNotification(data.message || "Redemption failed!", 'error');
      }
    } catch (error) {
      console.error('Redemption error:', error);
      showNotification("Redemption failed. Please try again.", 'error');
    } finally {
      setLoading(false);
    }
  };

  const getTransactionIcon = (type) => {
    if (type === 'redemption') return '💰';
    return type === 'credit' ? '↗️' : '↙️';
  };

  const getTransactionColor = (type) => {
    if (type === 'redemption') return 'text-yellow-400';
    return type === 'credit' ? 'text-green-400' : 'text-red-400';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Get last redemption amount
  const lastRedemption = transactions.find(t => t.type === 'redemption');
  const lastRedemptionAmount = lastRedemption ? Math.abs(lastRedemption.amount) : 0;

  return (
    <>
      <style jsx>{`
        body { box-sizing: border-box; }
        .glass { background: rgba(255,255,255,0.1); backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.2); }
        .transaction-card:hover { transform: translateX(5px); }
        .pulse-animation { animation: pulse 2s infinite; }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
      `}</style>

      <div className="min-h-full bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 p-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg pulse-animation">
              <span className="text-3xl">💰</span>
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">♻️ Carbon Wallet</h1>
            <p className="text-white/80 text-lg">Manage your environmental rewards and track your impact!</p>
            <div className="w-16 h-1 bg-white/50 mx-auto rounded-full mt-3"></div>
          </div>

          {/* Balance Card */}
          <div className="glass rounded-3xl p-8 mb-8 shadow-2xl">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white mb-2">💰 ₹{balance.toLocaleString()}</h2>
              <p className="text-white/80 mb-6">Your current wallet balance • {points} Carbon Points</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white/20 rounded-xl p-4">
                  <div className="text-2xl font-bold text-white">\u20b9{balance}</div>
                  <div className="text-white/80 text-sm">Current Balance</div>
                </div>
                <div className="bg-white/20 rounded-xl p-4">
                  <div className="text-2xl font-bold text-white">{points}</div>
                  <div className="text-white/80 text-sm">Carbon Points</div>
                </div>
                <div className="bg-white/20 rounded-xl p-4">
                  <div className="text-2xl font-bold text-white">\u20b9{totalRedeemed}</div>
                  <div className="text-white/80 text-sm">Total Redeemed</div>
                </div>
                <div className="bg-white/20 rounded-xl p-4">
                  <div className="text-2xl font-bold text-white">\u20b9{balance + totalRedeemed}</div>
                  <div className="text-white/80 text-sm">Lifetime Earnings</div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="glass rounded-2xl shadow-2xl overflow-hidden mb-8">
            <div className="flex border-b border-white/20">
              {["overview", "transactions", "add-credits"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-4 font-semibold capitalize transition-colors ${
                    activeTab === tab
                      ? "bg-white/30 text-white"
                      : "text-white/80 hover:bg-white/20"
                  }`}
                >
                  {tab === "overview" && "📊"} {tab === "transactions" && "📜"} {tab === "add-credits" && "➕"} {tab}
                </button>
              ))}
            </div>

            <div className="p-6">
              {activeTab === "overview" && (
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-white mb-4">Wallet Overview</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white/10 rounded-xl p-6">
                      <h4 className="text-lg font-semibold text-white mb-3">💡 How to Earn Credits</h4>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">♻️</span>
                          <div>
                            <div className="text-white font-semibold">Recycle Materials</div>
                            <div className="text-white/70 text-sm">1 credit per kg</div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">🚛</span>
                          <div>
                            <div className="text-white font-semibold">Schedule Pickups</div>
                            <div className="text-white/70 text-sm">Bonus credits for regular pickups</div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">👥</span>
                          <div>
                            <div className="text-white font-semibold">Refer Friends</div>
                            <div className="text-white/70 text-sm">100 credits per referral</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white/10 rounded-xl p-6">
                      <h4 className="text-lg font-semibold text-white mb-3">🎁 Redeem Rewards</h4>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">🍃</span>
                          <div>
                            <div className="text-white font-semibold">Eco Products</div>
                            <div className="text-white/70 text-sm">From 300 credits</div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">🌱</span>
                          <div>
                            <div className="text-white font-semibold">Plant Trees</div>
                            <div className="text-white/70 text-sm">1000 credits</div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">☀️</span>
                          <div>
                            <div className="text-white font-semibold">Solar Devices</div>
                            <div className="text-white/70 text-sm">1500+ credits</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Transaction Summary */}
                  <div className="bg-white/10 rounded-xl p-6">
                    <h4 className="text-lg font-semibold text-white mb-4">📊 Transaction Summary</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-400">{transactions.filter(t => t.type === 'credit').length}</div>
                        <div className="text-white/70 text-sm">Total Earned</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-yellow-400">{transactions.filter(t => t.type === 'redemption').length}</div>
                        <div className="text-white/70 text-sm">Total Redeemed</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-400">{lastRedemptionAmount}</div>
                        <div className="text-white/70 text-sm">Last Redeem</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "transactions" && (
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-white mb-4">Transaction History</h3>
                  <div className="space-y-4">
                    {transactions.map((transaction) => (
                      <div
                        key={transaction.id}
                        className="transaction-card flex items-center justify-between p-4 bg-white/10 rounded-xl transition-all duration-300"
                      >
                        <div className="flex items-center space-x-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            transaction.type === 'credit' ? 'bg-green-100' : 
                            transaction.type === 'redemption' ? 'bg-yellow-100' : 'bg-red-100'
                          }`}>
                            <span className="text-lg">{getTransactionIcon(transaction.type)}</span>
                          </div>
                          <div>
                            <p className="font-semibold text-white">{transaction.description}</p>
                            <p className="text-sm text-white/70">{transaction.date} at {transaction.time}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`text-lg font-bold ${getTransactionColor(transaction.type)}`}>
                            {transaction.type === 'credit' ? '+' : ''}{transaction.amount}
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(transaction.status)}`}>
                            {transaction.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "add-credits" && (
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-white mb-4">Add Credits</h3>
                  <form onSubmit={handleAddCredit} className="max-w-md mx-auto">
                    <div className="mb-4">
                      <label className="block text-white font-semibold mb-2">Amount to Add</label>
                      <input
                        type="number"
                        placeholder="Enter amount"
                        className="w-full p-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
                        value={creditAmount}
                        onChange={(e) => setCreditAmount(e.target.value)}
                        min="1"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? '⏳ Adding...' : '➕ Add Credits'}
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div 
              className="glass rounded-2xl p-6 text-center shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer"
              onClick={handleRedeem}
            >
              <div className="text-3xl mb-3">💰</div>
              <div className="text-white font-semibold">Redeem Credits</div>
              <div className="text-white/70 text-sm">Convert credits to cash</div>
            </div>
            <div className="glass rounded-2xl p-6 text-center shadow-2xl hover:scale-105 transition-all duration-300">
              <div className="text-3xl mb-3">🚛</div>
              <div className="text-white font-semibold">Request Pickup</div>
              <div className="text-white/70 text-sm">Schedule waste collection</div>
            </div>
            <div className="glass rounded-2xl p-6 text-center shadow-2xl hover:scale-105 transition-all duration-300">
              <div className="text-3xl mb-3">🏆</div>
              <div className="text-white font-semibold">View Rankings</div>
              <div className="text-white/70 text-sm">See your position</div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center">
            <p className="text-white/60 text-sm mt-2">© 2025 ScrapSail | Smart Waste Management 🌍</p>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 max-w-md mx-4 text-center shadow-2xl">
            <div className="text-6xl mb-4">💰</div>
            <h2 className="text-2xl font-bold text-green-600 mb-2">Redemption Successful!</h2>
            <p className="text-gray-600 mb-4">
              You have successfully redeemed <span className="font-bold text-green-600">₹{redeemAmount}</span>
            </p>
            <div className="bg-green-50 rounded-xl p-4 mb-6">
              <div className="text-lg font-semibold text-green-700">₹{redeemAmount}</div>
              <div className="text-sm text-green-600">Amount credited to your account</div>
            </div>
            <div className="bg-blue-50 rounded-xl p-4 mb-6">
              <div className="text-sm text-blue-600">New Balance: <span className="font-bold">₹{balance}</span></div>
              <div className="text-sm text-blue-600">Total Redeemed: <span className="font-bold">₹{totalRedeemed}</span></div>
            </div>
            <button
              onClick={() => {
                setShowSuccessModal(false);
                window.location.reload(); // Refresh to show updated data
              }}
              className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-semibold transition-colors duration-200"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}