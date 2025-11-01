import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { API_CONFIG } from "../config/api";

export default function UserDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [userOrders, setUserOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserOrders = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (!user.email) return;

        const response = await fetch(`${API_CONFIG.SPRING_BOOT_URL}/api/orders`);
        const data = await response.json();
        
        if (data.success) {
          // Filter orders for current user
          const myOrders = data.orders.filter(order => 
            order.userEmail === user.email || order.user?.email === user.email
          );
          setUserOrders(myOrders);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserOrders();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/'; // Navigate to login page (root path)
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'PENDING_APPROVAL': { bg: 'bg-yellow-100', text: 'text-yellow-800', label: '⏳ Pending Approval', icon: '⏳' },
      'ASSIGNED': { bg: 'bg-blue-100', text: 'text-blue-800', label: '👷 Assigned to Collector', icon: '👷' },
      'ACCEPTED': { bg: 'bg-indigo-100', text: 'text-indigo-800', label: '✅ Accepted by Collector', icon: '✅' },
      'APPROVED': { bg: 'bg-green-100', text: 'text-green-800', label: '✅ Approved', icon: '✅' },
      'PICKED_UP': { bg: 'bg-purple-100', text: 'text-purple-800', label: '📦 Picked Up', icon: '📦' },
      'COMPLETED': { bg: 'bg-blue-100', text: 'text-blue-800', label: '🎉 Completed', icon: '🎉' },
      'REJECTED': { bg: 'bg-red-100', text: 'text-red-800', label: '❌ Rejected', icon: '❌' }
    };
    const config = statusConfig[status] || { bg: 'bg-gray-100', text: 'text-gray-800', label: status, icon: '📋' };
    return { className: `px-3 py-1 ${config.bg} ${config.text} rounded-full text-sm font-medium`, label: config.label, icon: config.icon };
  };

  return (
    <>
      <style jsx>{`
        body { box-sizing: border-box; }
        .glass { background: rgba(255,255,255,0.1); backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.2); }
        .stat-card:hover { transform: translateY(-5px); }
        .pulse-animation { animation: pulse 2s infinite; }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
      `}</style>

      <div className="min-h-full bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600">
      {/* Header */}
        <header className="glass shadow-lg border-b border-white/20">
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                <span className="text-xl">♻️</span>
              </div>
              <h1 className="text-2xl font-bold text-white">User Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/wallet" className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition">
                💰 Wallet
              </Link>
            <button
              onClick={handleLogout}
                className="px-4 py-2 bg-red-500/80 text-white rounded-lg hover:bg-red-500 transition"
            >
                🚪 Logout
            </button>
          </div>
        </div>
      </header>

        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Welcome Section */}
          <div className="glass rounded-2xl p-6 mb-8 shadow-2xl">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center pulse-animation">
                <span className="text-2xl">👤</span>
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">Welcome back, Eco Warrior! 🌱</h2>
                <p className="text-white/80">Track your environmental impact and earn rewards for sustainable actions.</p>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="stat-card glass rounded-2xl p-6 shadow-2xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80">Total Recycled</p>
                  <p className="text-3xl font-bold text-white">245 kg</p>
                </div>
                <div className="text-4xl">🗂️</div>
              </div>
            </div>

            <div className="stat-card glass rounded-2xl p-6 shadow-2xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80">Carbon Credits</p>
                  <p className="text-3xl font-bold text-white">1,250</p>
                </div>
                <div className="text-4xl">💰</div>
              </div>
            </div>

            <div className="stat-card glass rounded-2xl p-6 shadow-2xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80">Pickups</p>
                  <p className="text-3xl font-bold text-white">18</p>
                </div>
                <div className="text-4xl">🚛</div>
              </div>
            </div>

            <div className="stat-card glass rounded-2xl p-6 shadow-2xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80">Rank</p>
                  <p className="text-3xl font-bold text-white">#12</p>
                </div>
                <div className="text-4xl">🏆</div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Link to="/pickup" className="glass rounded-2xl p-6 text-center shadow-2xl hover:scale-105 transition-all duration-300">
              <div className="text-4xl mb-3">🚛</div>
              <div className="text-white font-semibold text-lg">Request Pickup</div>
              <div className="text-white/70 text-sm">Schedule collection</div>
            </Link>

            <Link to="/wallet" className="glass rounded-2xl p-6 text-center shadow-2xl hover:scale-105 transition-all duration-300">
              <div className="text-4xl mb-3">💰</div>
              <div className="text-white font-semibold text-lg">Carbon Wallet</div>
              <div className="text-white/70 text-sm">Track rewards</div>
            </Link>

            <Link to="/leaderboard" className="glass rounded-2xl p-6 text-center shadow-2xl hover:scale-105 transition-all duration-300">
              <div className="text-4xl mb-3">🏆</div>
              <div className="text-white font-semibold text-lg">Leaderboard</div>
              <div className="text-white/70 text-sm">View rankings</div>
            </Link>

            <Link to="/carbon-credits" className="glass rounded-2xl p-6 text-center shadow-2xl hover:scale-105 transition-all duration-300">
              <div className="text-4xl mb-3">🎁</div>
              <div className="text-white font-semibold text-lg">Redeem Rewards</div>
              <div className="text-white/70 text-sm">Browse rewards</div>
            </Link>
          </div>

          {/* Tabs */}
          <div className="glass rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex border-b border-white/20">
              {["overview", "pickups", "rewards"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-4 font-semibold capitalize transition-colors ${
                    activeTab === tab
                      ? "bg-white/30 text-white"
                      : "text-white/80 hover:bg-white/20"
                  }`}
                >
                  {tab === "overview" && "📊"} {tab === "pickups" && "🚛"} {tab === "rewards" && "🎁"} {tab}
                </button>
              ))}
            </div>

            <div className="p-6">
              {activeTab === "overview" && (
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-white">Recent Activity</h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4 p-4 bg-white/10 rounded-lg">
                      <div className="text-2xl">♻️</div>
                      <div>
                        <p className="font-semibold text-white">Plastic bottles recycled</p>
                        <p className="text-sm text-white/70">2 hours ago • +50 credits</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 p-4 bg-white/10 rounded-lg">
                      <div className="text-2xl">📦</div>
                      <div>
                        <p className="font-semibold text-white">Cardboard pickup completed</p>
                        <p className="text-sm text-white/70">1 day ago • +75 credits</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 p-4 bg-white/10 rounded-lg">
                      <div className="text-2xl">👥</div>
                      <div>
                        <p className="font-semibold text-white">Friend referral bonus</p>
                        <p className="text-sm text-white/70">3 days ago • +100 credits</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "pickups" && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold text-white">My Pickup Orders ({userOrders.length})</h3>
                    <Link to="/pickup" className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition">
                      🚛 Request New Pickup
                    </Link>
                  </div>
                  {loading ? (
                    <div className="text-center text-white py-8">Loading your orders...</div>
                  ) : userOrders.length === 0 ? (
                    <div className="text-center text-white/70 py-8">
                      <p className="text-2xl mb-2">📦</p>
                      <p>No pickup orders yet. Request your first pickup!</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {userOrders.map(order => {
                        const statusBadge = getStatusBadge(order.status);
                        return (
                          <div key={order.id} className="p-4 bg-white/10 rounded-lg hover:bg-white/20 transition">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <p className="font-semibold text-white text-lg">{order.itemType || 'Waste'}</p>
                                  <span className="text-xs bg-white/20 text-white px-2 py-1 rounded">#{order.id}</span>
                                </div>
                                <p className="text-sm text-white/70 mb-1">
                                  📅 {new Date(order.createdAt).toLocaleDateString()} • ⚖️ {order.weight}kg
                                </p>
                                <p className="text-xs text-white/60 mb-2">📍 {order.address}</p>
                                {order.collectorEmail && (
                                  <p className="text-xs text-white/80 bg-white/10 inline-block px-2 py-1 rounded">
                                    👷 Collector: {order.collectorEmail}
                                  </p>
                                )}
                              </div>
                              <div className="ml-4">
                                <span className={statusBadge.className}>
                                  {statusBadge.icon} {statusBadge.label}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {activeTab === "rewards" && (
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-white">Available Rewards</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 bg-white/10 rounded-lg hover:bg-white/20 transition">
                      <div className="text-3xl mb-3">🎁</div>
                      <h4 className="font-semibold text-white mb-2">Eco-Friendly Water Bottle</h4>
                      <p className="text-sm text-white/70 mb-4">Redeem with 500 carbon credits</p>
                      <Link to="/carbon-credits" className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition text-center block">
                        Redeem Now
                      </Link>
                    </div>
                    <div className="p-6 bg-white/10 rounded-lg hover:bg-white/20 transition">
                      <div className="text-3xl mb-3">🌱</div>
                      <h4 className="font-semibold text-white mb-2">Plant a Tree</h4>
                      <p className="text-sm text-white/70 mb-4">Redeem with 1000 carbon credits</p>
                      <Link to="/carbon-credits" className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition text-center block">
                        Redeem Now
                      </Link>
                    </div>
                  </div>
              </div>
              )}
            </div>
          </div>
        </div>
    </div>
    </>
  );
}