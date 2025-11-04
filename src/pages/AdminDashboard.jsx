import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { API_CONFIG } from "../config/api";

export default function AdminDashboard() {
  const [pendingPickups, setPendingPickups] = useState([]);
  const [allOrders, setAllOrders] = useState([]);
  const [assigning, setAssigning] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Scroll to top button handler
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch ALL orders (including assigned, approved, completed)
  useEffect(() => {
    const fetchAllOrders = async () => {
      console.log('🔄 Fetching all orders from admin dashboard...');
      setLoading(true);
      try {
        // Fetch ALL orders from Spring Boot backend (not just pending)
        const url = `${API_CONFIG.SPRING_BOOT_URL}/api/admin/all-orders`;
        console.log('📡 Calling:', url);
        
        const response = await fetch(url);
        const data = await response.json();
        
        console.log('📥 Response:', data);
        console.log('📊 Total orders count:', data.count);
        
        if (data.success) {
          // Transform the data to match the expected format
          const formattedOrders = data.orders.map(order => ({
            id: order.id,
            userId: order.user?.id || 'Unknown',
            userName: order.user?.name || order.userEmail?.split('@')[0] || 'Unknown',
            userEmail: order.userEmail || order.user?.email || 'Not provided',
            userPhone: order.user?.phone || order.userPhone || "Not provided",
            wasteCategory: order.itemType,
            weight: order.weight,
            pickupAddress: order.address,
            scheduledDate: order.scheduledDate,
            status: order.status,
            carbonCreditsEarned: Math.floor(order.weight * 1), // 1kg = 1 credit
            createdAt: order.createdAt,
            collectorAssigned: order.collectorEmail || order.collectorAssigned,
            adminNotes: order.adminNotes,
            approvedAt: order.approvedAt,
            assignedAt: order.assignedAt
          }));
          
          // Separate pending from all other orders
          const pending = formattedOrders.filter(o => o.status === 'PENDING_APPROVAL');
          const otherOrders = formattedOrders.filter(o => o.status !== 'PENDING_APPROVAL');
          
          console.log('✅ Pending orders:', pending.length);
          console.log('✅ Other orders (assigned/approved/completed):', otherOrders.length);
          
          setPendingPickups(pending);
          setAllOrders(otherOrders); // Store all non-pending orders for history section
          setMessage(`✅ Loaded ${pending.length} pending orders and ${otherOrders.length} previous orders`);
        } else {
          console.error('❌ Failed to fetch orders:', data.message);
          setMessage("❌ Failed to load orders");
        }
      } catch (error) {
        console.error('❌ Error fetching orders:', error);
        setMessage(`❌ Failed to load orders: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchAllOrders();
  }, []);

  const handleAcceptOrder = async (pickupId) => {
    try {
      setMessage("🔄 Approving order...");
      
      // Call Spring Boot backend API to approve the order
      const response = await fetch(`${API_CONFIG.SPRING_BOOT_URL}/api/admin/approve-order/${pickupId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          collectorEmail: 'collector@scrapsail.com',
          adminNotes: 'Approved by admin'
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Refresh all orders after approval
        window.location.reload(); // Simple refresh to get updated orders
        setMessage("✅ Order approved successfully! Points allocated to user.");
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage(`❌ Failed to approve order: ${data.message}`);
        setTimeout(() => setMessage(""), 3000);
      }
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
      
      // Call Spring Boot backend API to reject the order
      const response = await fetch(`${API_CONFIG.SPRING_BOOT_URL}/api/admin/reject-order/${pickupId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          adminNotes: reason
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Refresh all orders after rejection
        window.location.reload(); // Simple refresh to get updated orders
        setMessage("❌ Order rejected");
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage(`❌ Failed to reject order: ${data.message}`);
        setTimeout(() => setMessage(""), 3000);
      }
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
      
      // Auto-assign to collector@scrapsail.com
      const collectorName = 'Scrapsail Collector';
      
      // Update pickup with collector assignment
      setPendingPickups(prev => 
        prev.map(pickup => 
          pickup.id === pickupId 
            ? { 
                ...pickup, 
                status: "assigned",
                assignedCollectorId: 9, // Collector ID from database
                assignedCollectorName: collectorName,
                assignedAt: new Date().toISOString()
              }
            : pickup
        )
      );
      
      setMessage(`✅ Assigned to ${collectorName}`);
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
      case 'pending':
      case 'PENDING_APPROVAL': return 'bg-yellow-500';
      case 'approved':
      case 'APPROVED': return 'bg-green-500';
      case 'rejected':
      case 'REJECTED': return 'bg-red-500';
      case 'assigned':
      case 'ASSIGNED': return 'bg-blue-500';
      case 'completed':
      case 'COMPLETED': return 'bg-purple-500';
      case 'ACCEPTED': return 'bg-indigo-500';
      case 'PICKED_UP': return 'bg-purple-400';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
      case 'PENDING_APPROVAL': return 'Pending Approval';
      case 'approved':
      case 'APPROVED': return 'Approved';
      case 'rejected':
      case 'REJECTED': return 'Rejected';
      case 'assigned':
      case 'ASSIGNED': return 'Assigned to Collector';
      case 'ACCEPTED': return 'Accepted by Collector';
      case 'PICKED_UP': return 'Picked Up';
      case 'completed':
      case 'COMPLETED': return 'Completed';
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
              <div className="text-2xl font-bold text-white">{pendingPickups.length + allOrders.length}</div>
              <div className="text-white/80">Total Orders</div>
              <div className="text-sm text-white/60 mt-1">
                ({pendingPickups.length} pending, {allOrders.length} completed/assigned)
              </div>
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
            <div className="overflow-x-auto max-h-[500px] overflow-y-auto custom-scrollbar">
              <table className="min-w-full">
                <thead className="bg-white/20 sticky top-0 z-10">
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
                            {pickup.scheduledDate ? new Date(pickup.scheduledDate).toLocaleDateString() : 'Invalid Date'}
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
                            {(pickup.status === 'pending' || pickup.status === 'PENDING_APPROVAL') && (
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
                                  <option value="">Auto-assign to Collector</option>
                                  <option value="auto" className="text-gray-800">Assign to collector@scrapsail.com</option>
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

        {/* Previous Orders / Order History Section */}
        {allOrders.length > 0 && (
          <div className="glass rounded-2xl shadow-2xl overflow-hidden mt-8">
            <div className="bg-white/20 p-6">
              <h3 className="text-xl font-bold text-white mb-4">📜 Previous Orders History</h3>
              <p className="text-white/80">View all previously assigned, approved, and completed orders</p>
            </div>

            <div className="overflow-x-auto max-h-[500px] overflow-y-auto custom-scrollbar">
              <table className="min-w-full">
                <thead className="bg-white/20 sticky top-0 z-10">
                  <tr>
                    <th className="py-3 px-4 text-left text-white font-semibold">Order ID</th>
                    <th className="py-3 px-4 text-left text-white font-semibold">Customer</th>
                    <th className="py-3 px-4 text-left text-white font-semibold">Waste Type</th>
                    <th className="py-3 px-4 text-left text-white font-semibold">Weight</th>
                    <th className="py-3 px-4 text-left text-white font-semibold">Location</th>
                    <th className="py-3 px-4 text-left text-white font-semibold">Status</th>
                    <th className="py-3 px-4 text-left text-white font-semibold">Collector</th>
                    <th className="py-3 px-4 text-left text-white font-semibold">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {allOrders.map((order) => (
                    <tr key={order.id} className="border-b border-white/20 hover:bg-white/10 transition-colors">
                      <td className="py-4 px-4">
                        <div className="text-white font-mono text-sm font-bold">#{order.userOrderNumber || order.id}</div>
                        <div className="text-white/60 text-xs">
                          {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div>
                          <p className="text-white font-semibold">{order.userName || 'Unknown User'}</p>
                          <p className="text-white/70 text-sm">{order.userEmail || 'No email'}</p>
                          <p className="text-white/60 text-xs">{order.userPhone || 'No phone'}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="px-3 py-1 bg-blue-500 text-white rounded-full text-sm font-semibold">
                          {order.wasteCategory || 'N/A'}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-white font-semibold">{order.weight || 0} kg</div>
                        <div className="text-white/60 text-xs">{order.carbonCreditsEarned || 0} credits</div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-white text-sm max-w-xs truncate">
                          {order.pickupAddress || 'N/A'}
                        </div>
                        {order.scheduledDate && (
                          <div className="text-white/60 text-xs">
                            Scheduled: {new Date(order.scheduledDate).toLocaleDateString()}
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 ${getStatusColor(order.status)} text-white rounded-full text-sm font-semibold`}>
                          {getStatusText(order.status)}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        {order.collectorAssigned ? (
                          <div>
                            <p className="text-white text-sm">{order.collectorAssigned}</p>
                            {order.assignedAt && (
                              <p className="text-white/60 text-xs">
                                Assigned: {new Date(order.assignedAt).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        ) : (
                          <span className="text-white/60 text-sm">Not assigned</span>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-white text-sm">
                          {order.approvedAt ? (
                            <>
                              <div>Approved:</div>
                              <div className="text-white/60 text-xs">
                                {new Date(order.approvedAt).toLocaleDateString()}
                              </div>
                            </>
                          ) : (
                            <span className="text-white/60 text-xs">N/A</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Scroll to Top Button */}
        {showScrollTop && (
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-8 right-8 bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-lg z-50 transition-all duration-300 hover:scale-110"
            title="Scroll to top"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </button>
        )}

      </div>
    </div>
  );
}