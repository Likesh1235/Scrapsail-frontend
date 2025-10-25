import React, { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import { redirectToRazorpay } from "../config/razorpay";

const CarbonWallet = () => {
  const [totalPoints] = useState(1000);
  const [walletBalance] = useState(1000.00);
  const [lastRedeem] = useState(0.00);
  const [remainingPoints] = useState(1000);
  const [rate] = useState("₹1/point");
  // TODO: Uncomment when withdrawal modal is implemented
  // const [showWithdrawalModal, setShowWithdrawalModal] = useState(false);
  // const [withdrawalForm, setWithdrawalForm] = useState({
  //   amount: '',
  //   accountHolderName: '',
  //   accountNumber: '',
  //   ifscCode: '',
  //   bankName: '',
  //   contact: ''
  // });
  // const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleRedeem = () => {
    // Simple Razorpay redirect - no complex forms needed
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (!user.email) {
      setMessage('❌ Please login first to redeem points!');
      return;
    }

    if (remainingPoints < 100) {
      setMessage('❌ Minimum 100 points required for redemption!');
      return;
    }

    // Calculate cash value (1 point = ₹1)
    const cashValue = remainingPoints;
    
    setMessage('🔄 Redirecting to Razorpay for redemption...');
    
    // Use the centralized Razorpay redirect function
    redirectToRazorpay(cashValue, user.email, 'ScrapSail Carbon Credit Redemption');
    
    // Show success message
    setTimeout(() => {
      setMessage('✅ Redirected to Razorpay! Complete your redemption there.');
    }, 1000);
  };

  // TODO: Implement withdrawal functionality when modal is added
  // const handleWithdrawalSubmit = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   setMessage('');

  //   try {
  //     // Validate form
  //     if (!withdrawalForm.amount || withdrawalForm.amount <= 0) {
  //       setMessage('❌ Please enter a valid withdrawal amount');
  //       setLoading(false);
  //       return;
  //     }

  //     if (!withdrawalForm.accountHolderName || !withdrawalForm.accountNumber || !withdrawalForm.ifscCode) {
  //       setMessage('❌ Please fill in all required bank account details');
  //       setLoading(false);
  //       return;
  //     }

  //     const cashValue = withdrawalForm.amount * 1; // 1 credit = 1 rupee
  //     if (cashValue < 100) {
  //       setMessage('❌ Minimum withdrawal amount is ₹100');
  //       setLoading(false);
  //       return;
  //     }

  //     if (withdrawalForm.amount > remainingPoints) {
  //       setMessage('❌ Insufficient carbon credits');
  //       setLoading(false);
  //       return;
  //     }

  //     // Mock API call - replace with actual API
  //     setMessage('🔄 Processing withdrawal request via Razorpay...');
      
  //     // Simulate API call delay
  //     await new Promise(resolve => setTimeout(resolve, 2000));

  //     // Mock successful response
  //     setMessage(`✅ Withdrawal request submitted successfully! Amount: ₹${cashValue}`);
  //     setRemainingPoints(remainingPoints - withdrawalForm.amount);
  //     setWalletBalance(walletBalance - cashValue);
  //     setShowWithdrawalModal(false);
      
  //     // Reset form
  //     setWithdrawalForm({
  //       amount: '',
  //       accountHolderName: '',
  //       accountNumber: '',
  //       ifscCode: '',
  //       bankName: '',
  //       contact: ''
  //     });

  //   } catch (error) {
  //     console.error('Withdrawal error:', error);
  //     setMessage('❌ Withdrawal failed. Please try again.');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // TODO: Implement input change handler when withdrawal modal is added
  // const handleInputChange = (e) => {
  //   const { name, value } = e.target;
  //   setWithdrawalForm(prev => ({
  //     ...prev,
  //     [name]: value
  //   }));
  // };

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
    </div>
  );
};

export default CarbonWallet;
