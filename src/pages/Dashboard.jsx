import React from "react";
import Navbar from "../components/Navbar";

const Dashboard = () => {
  const recentPickups = [
    { type: "Plastic", weight: "10", status: "Completed" },
    { type: "E-waste", weight: "1", status: "Pending" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-green-200">
      <Navbar />
      
      <div className="px-6 py-8">
        {/* Welcome Section */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-green-600 flex items-center justify-center">
            Welcome, Vasanth
            <span className="text-blue-500 ml-2">🌍</span>
          </h2>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-green-600 text-sm font-semibold mb-2">Total Waste Collected</h3>
            <p className="text-3xl font-bold text-green-600">42 kg</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-green-600 text-sm font-semibold mb-2">Carbon Credits</h3>
            <p className="text-3xl font-bold text-green-600">42 pts</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-green-600 text-sm font-semibold mb-2">Redeemable Cash</h3>
            <p className="text-3xl font-bold text-green-600">₹84</p>
          </div>
        </div>

        {/* Recent Pickups Table */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-green-600 mb-6">Recent Pickups</h3>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-green-100">
                  <th className="text-left py-3 px-4 font-semibold text-green-700">Type</th>
                  <th className="text-left py-3 px-4 font-semibold text-green-700">Weight (kg)</th>
                  <th className="text-left py-3 px-4 font-semibold text-green-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentPickups.map((pickup, index) => (
                  <tr key={index} className="border-b border-gray-200">
                    <td className="py-3 px-4 text-gray-700">{pickup.type}</td>
                    <td className="py-3 px-4 text-gray-700">{pickup.weight}</td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        pickup.status === 'Completed' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-orange-100 text-orange-800'
                      }`}>
                        {pickup.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;