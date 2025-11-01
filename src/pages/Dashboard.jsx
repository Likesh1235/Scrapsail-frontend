import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { API_CONFIG } from "../config/api";

const Dashboard = () => {
  const [user, setUser] = useState({});
  const [recentPickups, setRecentPickups] = useState([]);

  useEffect(() => {
    // Get logged-in user info
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(userData);
    
    // Fetch real pickup data from backend
    if (userData.email) {
      fetchUserPickups(userData.email);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchUserPickups = async (userEmail) => {
    try {
      // Use Spring Boot backend
      const response = await fetch(`${API_CONFIG.SPRING_BOOT_URL}/api/user/orders/email/${userEmail}`);
      const data = await response.json();
      
      if (data.success && data.orders) {
        // Transform Spring Boot order data to match the expected format
        const formattedPickups = data.orders.map(order => ({
          id: order.id,
          type: order.itemType,
          weight: order.weight ? order.weight.toString() : '0',
          status: order.status,
          // Map Spring Boot status to adminStatus for display
          adminStatus: mapStatusToAdminStatus(order.status),
          date: order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A',
          address: order.address || '',
          collectorAssigned: order.collectorEmail || 'Not assigned yet',
          rejectionReason: order.adminNotes || ''
        }));
        
        setRecentPickups(formattedPickups);
      } else {
        console.error('Failed to fetch orders:', data.message);
        setRecentPickups([]);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      setRecentPickups([]);
    }
  };

  // Map Spring Boot status to adminStatus for display
  const mapStatusToAdminStatus = (status) => {
    switch(status) {
      case 'PENDING_APPROVAL':
        return 'pending';
      case 'ASSIGNED':
      case 'ACCEPTED':
      case 'APPROVED':
        return 'approved';
      case 'PICKED_UP':
      case 'COMPLETED':
        return 'approved';
      case 'REJECTED':
        return 'rejected';
      default:
        return 'pending';
    }
  };

  const getStatusColor = (adminStatus) => {
    switch (adminStatus) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (adminStatus) => {
    switch (adminStatus) {
      case 'approved':
        return '✅';
      case 'pending':
        return '⏳';
      case 'rejected':
        return '❌';
      default:
        return '📋';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-green-200">
      <Navbar />
      <div className="px-6 py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-green-600 flex items-center justify-center">
            Welcome, {user.name || user.email || 'User'} 
            <span className="text-blue-500 ml-2">🌍</span>
          </h2>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">{recentPickups.length}</div>
            <div className="text-gray-600">Total Orders</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {recentPickups.filter(p => p.adminStatus === 'approved').length}
            </div>
            <div className="text-gray-600">Approved</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-yellow-600 mb-2">
              {recentPickups.filter(p => p.adminStatus === 'pending').length}
            </div>
            <div className="text-gray-600">Pending</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-red-600 mb-2">
              {recentPickups.filter(p => p.adminStatus === 'rejected').length}
            </div>
            <div className="text-gray-600">Rejected</div>
          </div>
        </div>

        {/* Recent Pickups Table */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-green-600 mb-6">📋 Your Order Status</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-green-100">
                  <th className="text-left py-3 px-4 font-semibold text-green-700">Order ID</th>
                  <th className="text-left py-3 px-4 font-semibold text-green-700">Type</th>
                  <th className="text-left py-3 px-4 font-semibold text-green-700">Weight (kg)</th>
                  <th className="text-left py-3 px-4 font-semibold text-green-700">Date</th>
                  <th className="text-left py-3 px-4 font-semibold text-green-700">Admin Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-green-700">Collector</th>
                </tr>
              </thead>
              <tbody>
                {recentPickups.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-12">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl">📭</span>
                      </div>
                      <h4 className="text-lg font-semibold text-gray-600 mb-2">No Orders Yet</h4>
                      <p className="text-gray-500">Submit your first pickup request to get started!</p>
                    </td>
                  </tr>
                ) : (
                  recentPickups.map((pickup, index) => (
                    <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="py-3 px-4 text-gray-700 font-mono text-sm">{pickup.id}</td>
                      <td className="py-3 px-4 text-gray-700">{pickup.type}</td>
                      <td className="py-3 px-4 text-gray-700">{pickup.weight}</td>
                      <td className="py-3 px-4 text-gray-700">{pickup.date}</td>
                      <td className="py-3 px-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${getStatusColor(pickup.adminStatus)}`}>
                          {getStatusIcon(pickup.adminStatus)} {pickup.adminStatus}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-700 text-sm">{pickup.collectorAssigned}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;