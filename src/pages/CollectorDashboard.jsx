import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { API_CONFIG } from "../config/api";

export default function CollectorDashboard() {
  const [assignedPickups, setAssignedPickups] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Load assigned pickups for the collector
  useEffect(() => {
    const fetchAssignedPickups = async () => {
      console.log('🔄 Fetching assigned pickups for collector...');
      setLoading(true);
      try {
        // Get collector email from localStorage
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const collectorEmail = user.email || 'collector@scrapsail.com';
        
        // Fetch APPROVED orders assigned to this collector
        const url = `${API_CONFIG.SPRING_BOOT_URL}/api/collector/orders?collectorEmail=${collectorEmail}`;
        console.log('📡 Calling:', url);
        
        const response = await fetch(url);
        const data = await response.json();
        
        console.log('📥 Response:', data);
        
        if (data.success) {
          const myOrders = data.orders;
          
          console.log('📦 Total assigned orders:', myOrders.length);
          
          const formattedPickups = myOrders.map(order => ({
            id: order.id,
            userId: order.user?.id || 'Unknown',
            userName: order.user?.name || order.userEmail?.split('@')[0] || 'Unknown',
            userEmail: order.userEmail || order.user?.email || 'Not provided',
            userPhone: order.userPhone || order.user?.phone || "Not provided",
            wasteCategory: order.itemType,
            weight: order.weight,
            pickupAddress: order.address,
            scheduledDate: order.scheduledDate,
            status: order.status,
            carbonCreditsEarned: Math.floor(order.weight * 1), // 1kg = 1 credit
            createdAt: order.createdAt,
            adminNotes: order.adminNotes,
            collectorAssigned: order.collectorEmail,
            latitude: order.latitude,
            longitude: order.longitude,
            // GPS link from database - prioritize this
            gpsLink: order.gpsLink || order.navigationLink || order.mapLink || order.locationLink || order.location?.navigationUrl
          }));
          
          setAssignedPickups(formattedPickups);
          setMessage(`✅ Loaded ${formattedPickups.length} assigned pickups`);
        } else {
          console.error('❌ Failed to fetch assigned pickups:', data.message);
          setMessage("❌ Failed to load assigned pickups");
        }
      } catch (error) {
        console.error('❌ Error fetching assigned pickups:', error);
        setMessage(`❌ Failed to load assigned pickups: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignedPickups();
  }, []);

  // eslint-disable-next-line no-unused-vars
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
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 animate-spin">
                <span className="text-2xl">⏳</span>
              </div>
              <p className="text-white">Loading pickups...</p>
            </div>
          ) : (
            <div className="overflow-x-auto max-h-[500px] overflow-y-auto custom-scrollbar">
              <table className="min-w-full">
                <thead className="bg-white/20 sticky top-0 z-10">
                  <tr>
                    <th className="py-3 px-4 text-left text-white font-semibold">Pickup ID</th>
                    <th className="py-3 px-4 text-left text-white font-semibold">Customer</th>
                    <th className="py-3 px-4 text-left text-white font-semibold">Waste Type</th>
                    <th className="py-3 px-4 text-left text-white font-semibold">Weight</th>
                    <th className="py-3 px-4 text-left text-white font-semibold">Location & Navigation</th>
                    <th className="py-3 px-4 text-left text-white font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {assignedPickups.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center py-12">
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
                            {pickup.createdAt ? new Date(pickup.createdAt).toLocaleDateString() : 'N/A'}
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
                          {/* Address */}
                          <div className="text-white text-sm max-w-xs mb-2">
                            📍 {pickup.pickupAddress}
                          </div>
                          
                          {/* Scheduled Date - Only show if exists */}
                          {pickup.scheduledDate && (
                            <div className="text-white/60 text-xs mb-2">
                              📅 {new Date(pickup.scheduledDate).toLocaleDateString()}
                            </div>
                          )}
                          
                          {/* GPS Coordinates & Navigation */}
                          <div className="space-y-2">
                            {/* Address Display */}
                            {pickup.pickupAddress && (
                              <div className="text-white/80 text-xs mb-2">
                                📍 {pickup.pickupAddress}
                              </div>
                            )}
                            
                            {/* Coordinates Display (if available) */}
                            {pickup.latitude && pickup.longitude && (
                              <div className="text-blue-300 text-xs font-mono mb-2">
                                🗺️ {pickup.latitude.toFixed(6)}, {pickup.longitude.toFixed(6)}
                              </div>
                            )}
                            
                            {/* Navigate Button - Use GPS link from database (generated from captured latitude/longitude) */}
                            <div>
                              {pickup.latitude && pickup.longitude ? (
                                // Use GPS link from database (generated from lat/lng) or generate directly from lat/lng
                                <a 
                                  href={pickup.gpsLink || `https://www.google.com/maps?q=${pickup.latitude},${pickup.longitude}`}
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="inline-block px-4 py-2 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 transition font-semibold shadow-lg cursor-pointer"
                                >
                                  🧭 Navigate
                                </a>
                              ) : pickup.gpsLink ? (
                                // Fallback: Use GPS link from database if no coordinates available
                                <a 
                                  href={pickup.gpsLink}
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="inline-block px-4 py-2 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 transition font-semibold shadow-lg cursor-pointer"
                                >
                                  🧭 Navigate
                                </a>
                              ) : pickup.pickupAddress ? (
                                // Last resort: Use address-based search
                                <a 
                                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(pickup.pickupAddress)}`}
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="inline-block px-4 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition font-semibold shadow-lg cursor-pointer"
                                >
                                  🗺️ Navigate (Address)
                                </a>
                              ) : (
                                <div className="text-red-300 text-xs">
                                  ⚠️ No location information available
                                </div>
                              )}
                            </div>
                            
                            {/* Show status info */}
                            {pickup.latitude && pickup.longitude ? (
                              <div className="text-green-300 text-xs">
                                ✅ GPS coordinates: {pickup.latitude.toFixed(6)}, {pickup.longitude.toFixed(6)}
                              </div>
                            ) : pickup.gpsLink ? (
                              <div className="text-yellow-300 text-xs">
                                ⚠️ Using GPS link from database
                              </div>
                            ) : pickup.pickupAddress ? (
                              <div className="text-yellow-300 text-xs">
                                ⚠️ Using address-based navigation
                              </div>
                            ) : null}
                          </div>
                          
                          {/* Admin Notes */}
                          {pickup.adminNotes && (
                            <div className="text-yellow-300 text-xs mt-2 p-2 bg-yellow-500/20 rounded">
                              📝 {pickup.adminNotes}
                            </div>
                          )}
                        </td>
                        <td className="py-4 px-4">
                          <span className={`px-3 py-1 ${getStatusColor(pickup.status)} text-white rounded-full text-sm font-semibold`}>
                            {getStatusText(pickup.status)}
                          </span>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white/10 rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-white">{assignedPickups.length}</div>
                <div className="text-white/80">Total Assigned</div>
              </div>
              <div className="bg-white/10 rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-white">
                  {assignedPickups.reduce((sum, p) => sum + p.weight, 0).toFixed(2)} kg
                </div>
                <div className="text-white/80">Total Weight</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}