import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";

export default function CollectorDashboard() {
  const [assignedPickups, setAssignedPickups] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Load assigned pickups for the collector
  useEffect(() => {
    const fetchAssignedPickups = async () => {
      setLoading(true);
      try {
        // Mock data for demonstration (simplified)
        const mockPickups = [
          {
            id: "PU003",
            userId: "U003", 
            userName: "Regular User",
            userEmail: "user@scrapsail.com",
            userPhone: "+91 98765 43210",
            wasteCategory: "Paper",
            weight: 12.0,
            pickupAddress: "789 Recycle Road, Bangalore",
            scheduledDate: "2024-01-16T09:00:00Z",
            status: "assigned",
            carbonCreditsEarned: 12,
            createdAt: "2024-01-14T18:20:00Z",
            adminNotes: "Please collect during morning hours"
          }
        ];
        
        setAssignedPickups(mockPickups);
      } catch (error) {
        console.error('Failed to fetch assigned pickups:', error);
        setMessage("❌ Failed to load assigned pickups");
      } finally {
        setLoading(false);
      }
    };

    fetchAssignedPickups();
  }, []);

  const handleAcceptPickup = async (pickupId) => {
    try {
      setMessage("🔄 Starting pickup...");
      
      // Update pickup status to in-progress (collector starts the pickup)
      setAssignedPickups(prev => 
        prev.map(pickup => 
          pickup.id === pickupId 
            ? { ...pickup, status: "in-progress", startedAt: new Date().toISOString() }
            : pickup
        )
      );
      
      setMessage("✅ Pickup started successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error('Start pickup error:', error);
      setMessage("❌ Failed to start pickup");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'assigned': return 'bg-blue-500';
      case 'in-progress': return 'bg-yellow-500';
      case 'completed': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'assigned': return 'Ready to Start';
      case 'in-progress': return 'In Progress';
      case 'completed': return 'Completed';
      default: return status;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="glass rounded-2xl p-6 mb-8 shadow-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center pulse-animation">
                <span className="text-2xl">🚛</span>
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">Collector Dashboard 🚛</h2>
                <p className="text-white/80">Manage your assigned pickup requests</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-white">{assignedPickups.length}</div>
              <div className="text-white/80">Assigned Pickups</div>
            </div>
          </div>
        </div>

        {/* Message Display */}
        {message && (
          <div className="glass rounded-xl p-4 mb-6 shadow-xl">
            <p className="text-center text-white font-semibold">{message}</p>
          </div>
        )}

        {/* Assigned Pickups */}
        <div className="glass rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-white/20 p-6">
            <h3 className="text-xl font-bold text-white mb-4">📋 Your Assigned Pickups</h3>
            <p className="text-white/80">Review and accept/reject pickup assignments from admin</p>
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 animate-spin">
                <span className="text-2xl">⏳</span>
              </div>
              <p className="text-white">Loading pickups...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-white/20">
                  <tr>
                    <th className="py-3 px-4 text-left text-white font-semibold">Pickup ID</th>
                    <th className="py-3 px-4 text-left text-white font-semibold">Customer</th>
                    <th className="py-3 px-4 text-left text-white font-semibold">Waste Type</th>
                    <th className="py-3 px-4 text-left text-white font-semibold">Weight</th>
                    <th className="py-3 px-4 text-left text-white font-semibold">Location</th>
                    <th className="py-3 px-4 text-left text-white font-semibold">Status</th>
                    <th className="py-3 px-4 text-left text-white font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {assignedPickups.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center py-12">
                        <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                          <span className="text-2xl">📭</span>
                        </div>
                        <h4 className="text-lg font-semibold text-white mb-2">No Assigned Pickups</h4>
                        <p className="text-white/70">Admin will assign pickups to you here</p>
                      </td>
                    </tr>
                  ) : (
                    assignedPickups.map((pickup) => (
                      <tr key={pickup.id} className="border-b border-white/20 hover:bg-white/10 transition-colors">
                        <td className="py-4 px-4">
                          <div className="text-white font-mono text-sm font-bold">#{pickup.id}</div>
                          <div className="text-white/60 text-xs">
                            {new Date(pickup.createdAt).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div>
                            <p className="text-white font-semibold">{pickup.userName || 'Unknown User'}</p>
                            <p className="text-white/70 text-sm">{pickup.userEmail || 'No email'}</p>
                            <p className="text-white/60 text-xs">{pickup.userPhone || 'No phone'}</p>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="px-3 py-1 bg-blue-500 text-white rounded-full text-sm font-semibold">
                            {pickup.wasteCategory}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-white font-semibold">{pickup.weight} kg</div>
                          <div className="text-white/60 text-xs">{pickup.carbonCreditsEarned} credits</div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-white text-sm max-w-xs truncate">
                            {pickup.pickupAddress}
                          </div>
                          <div className="text-white/60 text-xs">
                            {new Date(pickup.scheduledDate).toLocaleDateString()}
                          </div>
                          {pickup.adminNotes && (
                            <div className="text-yellow-300 text-xs mt-1">
                              📝 {pickup.adminNotes}
                            </div>
                          )}
                        </td>
                        <td className="py-4 px-4">
                          <span className={`px-3 py-1 ${getStatusColor(pickup.status)} text-white rounded-full text-sm font-semibold`}>
                            {getStatusText(pickup.status)}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex flex-col gap-2">
                            {pickup.status === 'assigned' && (
                              <div className="text-center">
                                <button
                                  onClick={() => handleAcceptPickup(pickup.id)}
                                  className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600 transition font-semibold"
                                >
                                  ✅ Start Pickup
                                </button>
                              </div>
                            )}
                            
                            {pickup.status === 'in-progress' && (
                              <div className="text-center">
                                <span className="text-yellow-400 text-sm font-semibold">🔄 In Progress</span>
                                <div className="text-white/60 text-xs">
                                  {pickup.startedAt && new Date(pickup.startedAt).toLocaleString()}
                                </div>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="glass rounded-2xl shadow-2xl mt-8 overflow-hidden">
          <div className="bg-white/20 p-6">
            <h3 className="text-xl font-bold text-white mb-4">📊 Your Stats</h3>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/10 rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-white">{assignedPickups.length}</div>
                <div className="text-white/80">Total Assigned</div>
              </div>
              <div className="bg-white/10 rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-white">
                  {assignedPickups.filter(p => p.status === 'collector-accepted').length}
                </div>
                <div className="text-white/80">Accepted</div>
              </div>
              <div className="bg-white/10 rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-white">
                  {assignedPickups.filter(p => p.status === 'collector-rejected').length}
                </div>
                <div className="text-white/80">Rejected</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}