import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";

export default function AdminDashboard() {
  const [pendingPickups, setPendingPickups] = useState([]);
  const [collectors, setCollectors] = useState([]);
  const [assigning, setAssigning] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Load collectors (simplified - only 1 collector)
  const loadCollectors = () => {
    try {
      const mockCollectors = [
        { id: 2, name: "Collector User", email: "collector@scrapsail.com", phone: "+91 98765 43210", status: "available" }
      ];
      setCollectors(mockCollectors);
    } catch (error) {
      console.error('Error loading collectors:', error);
      setCollectors([]);
    }
  };

  // Fetch pending pickups
  useEffect(() => {
    const fetchPendingPickups = async () => {
      setLoading(true);
      try {
        // Mock data for demonstration (simplified)
        const mockPickups = [
          {
            id: "PU001",
            userId: "U003",
            userName: "Regular User",
            userEmail: "user@scrapsail.com",
            userPhone: "+91 98765 43210",
            wasteCategory: "Plastic",
            weight: 15.5,
            pickupAddress: "123 Green Street, Mumbai",
            scheduledDate: "2024-01-15T10:00:00Z",
            status: "pending",
            carbonCreditsEarned: 15,
            createdAt: "2024-01-14T15:30:00Z"
          },
          {
            id: "PU002", 
            userId: "U003",
            userName: "Regular User",
            userEmail: "user@scrapsail.com",
            userPhone: "+91 98765 43210",
            wasteCategory: "Metal",
            weight: 8.2,
            pickupAddress: "456 Eco Lane, Delhi",
            scheduledDate: "2024-01-15T14:00:00Z",
            status: "pending",
            carbonCreditsEarned: 8,
            createdAt: "2024-01-14T16:45:00Z"
          },
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
            assignedCollectorId: 2,
            assignedCollectorName: "Collector User",
            carbonCreditsEarned: 12,
            createdAt: "2024-01-14T18:20:00Z"
          }
        ];
        
        setPendingPickups(mockPickups);
      } catch (error) {
        console.error('Failed to fetch pending pickups:', error);
        setMessage("❌ Failed to load pickup requests");
      } finally {
        setLoading(false);
      }
    };

    fetchPendingPickups();
    loadCollectors();
  }, []);

  const handleAcceptOrder = async (pickupId) => {
    try {
      setMessage("🔄 Approving order...");
      
      // Update pickup status to approved (collector will be auto-assigned)
      setPendingPickups(prev => 
        prev.map(pickup => 
          pickup.id === pickupId 
            ? { ...pickup, status: "approved" }
            : pickup
        )
      );
      
      setMessage("✅ Order approved and collector assigned automatically!");
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error('Accept order error:', error);
      setMessage("❌ Failed to approve order");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const handleRejectOrder = async (pickupId) => {
    try {
      const reason = prompt('Please provide reason for rejection:');
      if (!reason) return;
      
      setMessage("🔄 Rejecting order...");
      
      // Update pickup status to rejected
      setPendingPickups(prev => 
        prev.map(pickup => 
          pickup.id === pickupId 
            ? { ...pickup, status: "rejected", rejectionReason: reason }
            : pickup
        )
      );
      
      setMessage("❌ Order rejected");
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error('Reject order error:', error);
      setMessage("❌ Failed to reject order");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const handleAssignToCollector = async (pickupId, collectorId) => {
    if (!collectorId) return;
    
    try {
      setAssigning(pickupId);
      setMessage("🔄 Assigning to collector...");
      
      const collector = collectors.find(c => c.id === collectorId);
      
      if (!collector) {
        setMessage("❌ Collector not found");
        return;
      }
      
      // Update pickup with collector assignment
      setPendingPickups(prev => 
        prev.map(pickup => 
          pickup.id === pickupId 
            ? { 
                ...pickup, 
                status: "assigned",
                assignedCollectorId: collectorId,
                assignedCollectorName: collector.name || 'Unknown Collector',
                assignedAt: new Date().toISOString()
              }
            : pickup
        )
      );
      
      setMessage(`✅ Assigned to ${collector.name || 'Unknown Collector'}`);
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error('Assign collector error:', error);
      setMessage("❌ Failed to assign collector");
      setTimeout(() => setMessage(""), 3000);
    } finally {
      setAssigning(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'approved': return 'bg-green-500';
      case 'rejected': return 'bg-red-500';
      case 'assigned': return 'bg-blue-500';
      case 'completed': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'Pending Review';
      case 'approved': return 'Approved & Assigned';
      case 'rejected': return 'Rejected';
      case 'assigned': return 'Assigned to Collector';
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
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center pulse-animation">
                <span className="text-2xl">🔐</span>
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">Admin Dashboard 🌱</h2>
                <p className="text-white/80">Manage user orders and collector assignments</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-white">{pendingPickups.length}</div>
              <div className="text-white/80">Total Orders</div>
            </div>
          </div>
        </div>

        {/* Message Display */}
        {message && (
          <div className="glass rounded-xl p-4 mb-6 shadow-xl">
            <p className="text-center text-white font-semibold">{message}</p>
          </div>
        )}

        {/* Orders Table */}
        <div className="glass rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-white/20 p-6">
            <h3 className="text-xl font-bold text-white mb-4">📋 User Orders Management</h3>
            <p className="text-white/80">Review, accept/reject orders and assign to collectors</p>
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 animate-spin">
                <span className="text-2xl">⏳</span>
              </div>
              <p className="text-white">Loading orders...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-white/20">
                  <tr>
                    <th className="py-3 px-4 text-left text-white font-semibold">Order ID</th>
                    <th className="py-3 px-4 text-left text-white font-semibold">Customer</th>
                    <th className="py-3 px-4 text-left text-white font-semibold">Waste Type</th>
                    <th className="py-3 px-4 text-left text-white font-semibold">Weight</th>
                    <th className="py-3 px-4 text-left text-white font-semibold">Location</th>
                    <th className="py-3 px-4 text-left text-white font-semibold">Status</th>
                    <th className="py-3 px-4 text-left text-white font-semibold">Collector</th>
                    <th className="py-3 px-4 text-left text-white font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingPickups.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="text-center py-12">
                        <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                          <span className="text-2xl">✅</span>
                        </div>
                        <h4 className="text-lg font-semibold text-white mb-2">No Orders Found</h4>
                        <p className="text-white/70">All orders have been processed!</p>
                      </td>
                    </tr>
                  ) : (
                    pendingPickups.map((pickup) => (
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
                        </td>
                        <td className="py-4 px-4">
                          <span className={`px-3 py-1 ${getStatusColor(pickup.status)} text-white rounded-full text-sm font-semibold`}>
                            {getStatusText(pickup.status)}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          {pickup.assignedCollectorName ? (
                            <div>
                              <p className="text-white font-semibold text-sm">{pickup.assignedCollectorName}</p>
                              <p className="text-white/60 text-xs">ID: {pickup.assignedCollectorId || 'N/A'}</p>
                            </div>
                          ) : (
                            <span className="text-white/60 text-sm">Not assigned</span>
                          )}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex flex-col gap-2">
                            {pickup.status === 'pending' && (
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleAcceptOrder(pickup.id)}
                                  className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600 transition font-semibold"
                                >
                                  ✅ Accept
                                </button>
                                <button
                                  onClick={() => handleRejectOrder(pickup.id)}
                                  className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition font-semibold"
                                >
                                  ❌ Reject
                                </button>
                              </div>
                            )}
                            
                            {pickup.status === 'accepted' && (
                              <div className="flex gap-2">
                                <select
                                  className="border border-white/30 rounded p-1 bg-white/10 text-white text-sm"
                                  onChange={(e) => handleAssignToCollector(pickup.id, e.target.value)}
                                  disabled={assigning === pickup.id}
                                  defaultValue=""
                                >
                                  <option value="">Select Collector</option>
                                  {collectors && collectors.length > 0 ? collectors.filter(c => c && c.status === 'available').map((collector) => (
                                    <option key={collector.id} value={collector.id} className="text-gray-800">
                                      {collector.name || 'Unknown Collector'}
                                    </option>
                                  )) : (
                                    <option value="" disabled className="text-gray-800">No collectors available</option>
                                  )}
                                </select>
                                {assigning === pickup.id && (
                                  <span className="text-sm text-white/70">Assigning...</span>
                                )}
                              </div>
                            )}

                            {pickup.status === 'assigned' && (
                              <div className="text-center">
                                <span className="text-white/60 text-xs">Waiting for collector response</span>
                              </div>
                            )}

                            {pickup.status === 'collector-accepted' && (
                              <div className="text-center">
                                <span className="text-green-400 text-sm font-semibold">✅ Collector Accepted</span>
                              </div>
                            )}

                            {pickup.status === 'collector-rejected' && (
                              <div className="text-center">
                                <span className="text-orange-400 text-sm font-semibold">⚠️ Collector Rejected</span>
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

        {/* Available Collectors */}
        <div className="glass rounded-2xl shadow-2xl mt-8 overflow-hidden">
          <div className="bg-white/20 p-6">
            <h3 className="text-xl font-bold text-white mb-4">🚛 Available Collectors</h3>
            <p className="text-white/80">Collectors ready to accept pickup assignments</p>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {collectors && collectors.length > 0 ? collectors.map((collector) => (
                <div key={collector.id} className="bg-white/10 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                        <span className="text-lg">🚛</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">{collector.name || 'Unknown Collector'}</h4>
                        <p className="text-white/70 text-sm">ID: {collector.id || 'N/A'}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      collector.status === 'available' 
                        ? 'bg-green-500 text-white' 
                        : 'bg-red-500 text-white'
                    }`}>
                      {collector.status === 'available' ? 'Available' : 'Busy'}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-white/80 text-sm">{collector.email || 'No email'}</p>
                    <p className="text-white/80 text-sm">{collector.phone || 'No phone'}</p>
                  </div>
                </div>
              )) : (
                <div className="col-span-full text-center py-8">
                  <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🚛</span>
                  </div>
                  <h4 className="text-lg font-semibold text-white mb-2">No Collectors Available</h4>
                  <p className="text-white/70">Collectors will appear here when they register</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}