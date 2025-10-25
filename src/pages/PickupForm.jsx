import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";

const PickupForm = () => {
  const [form, setForm] = useState({
    wasteCategory: "Plastic",
    weight: "",
    pickupAddress: "",
    scheduledDate: "",
    coordinates: null,
    email: "",
  });
  const [msg, setMsg] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otp, setOtp] = useState("");

  // Get logged-in user's email
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.email) {
      setForm(prev => ({ ...prev, email: user.email }));
    }
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const captureLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const coords = {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude
        };
        setForm({ ...form, coordinates: coords });
        setMsg("📍 Location captured successfully!");
      });
    } else {
      setMsg("❌ Geolocation not supported");
    }
  };

  const sendOTP = async () => {
    if (!form.email) {
      setMsg("❌ Please login first to get your email address");
      return;
    }

    try {
      setMsg("📧 Sending OTP...");
      
      const response = await fetch('http://localhost:8080/api/otp/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: form.email,
          type: 'pickup'
        })
      });

      const data = await response.json();

      if (response.ok) {
        setOtpSent(true);
        if (data.otp) {
          // Email not configured - show OTP in message
          setMsg(`✅ OTP generated: ${data.otp} (Email not configured - check console)`);
        } else {
          setMsg(`✅ OTP sent successfully to ${form.email}! Check your email.`);
        }
      } else {
        setMsg(`❌ ${data.message || 'Failed to send OTP'}`);
      }
    } catch (error) {
      console.error('Send OTP error:', error);
      setMsg("❌ Failed to send OTP. Please check your internet connection.");
    }
  };

  const verifyOTP = async () => {
    if (!otp) {
      setMsg("❌ Please enter the OTP");
      return;
    }

    try {
      setMsg("🔍 Verifying OTP...");
      
      const response = await fetch('http://localhost:8080/api/otp/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: form.email,
          otp: otp,
          type: 'pickup'
        })
      });

      const data = await response.json();

      if (response.ok) {
        setOtpVerified(true);
        setMsg("✅ OTP verified successfully! You can now submit your request.");
      } else {
        setMsg(`❌ ${data.message || 'Invalid OTP'}`);
      }
    } catch (error) {
      console.error('Verify OTP error:', error);
      setMsg("❌ Failed to verify OTP. Please try again.");
    }
  };

          const handleSubmit = async (e) => {
            e.preventDefault();

            // Check if user is logged in
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            if (!user.email) {
              setMsg("❌ Please login first to submit a pickup request!");
              return;
            }

            if (!form.wasteCategory || !form.weight || !form.pickupAddress || !form.scheduledDate || !form.email) {
              setMsg("❌ Please fill in all required fields!");
              return;
            }

            if (!otpVerified) {
              setMsg("❌ Please verify your email with OTP first!");
              return;
            }

            try {
              setMsg("📤 Submitting pickup request...");
              
              const response = await fetch('http://localhost:8080/api/pickup', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                  wasteCategory: form.wasteCategory,
                  weight: parseFloat(form.weight),
                  pickupAddress: form.pickupAddress,
                  scheduledDate: form.scheduledDate,
                  coordinates: form.coordinates,
                  email: form.email
                })
              });

              const data = await response.json();

              if (response.ok) {
                setMsg("✅ Pickup request submitted successfully! Waiting for admin approval.");
                // Reset form
                setForm({
                  wasteCategory: "Plastic",
                  weight: "",
                  pickupAddress: "",
                  scheduledDate: "",
                  coordinates: null,
                  email: user.email, // Keep the logged-in user's email
                });
                setOtpSent(false);
                setOtpVerified(false);
                setOtp("");
              } else {
                setMsg(`❌ ${data.message || 'Failed to create pickup request'}`);
              }
            } catch (error) {
              console.error('Create pickup error:', error);
              setMsg("❌ Failed to create pickup request. Please check your internet connection.");
            }
          };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-teal-200">
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
                    <h1 className="text-3xl font-bold text-green-600 mb-2">
                      ♻️ Waste Pickup Request
                    </h1>
                    <p className="text-gray-600">
                      Every kilogram you recycle adds carbon credits to your wallet.
                    </p>
                    {form.email && (
                      <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-sm text-green-700">
                          <span className="font-semibold">Logged in as:</span> {form.email}
                        </p>
                        <p className="text-xs text-green-600 mt-1">
                          OTP will be sent to this email address
                        </p>
                      </div>
                    )}
                  </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Waste Category */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Waste Category</label>
              <select
                name="wasteCategory"
                value={form.wasteCategory}
                onChange={handleChange}
                className="w-full border border-gray-300 p-4 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                required
              >
                <option value="Plastic">Plastic</option>
                <option value="Metal">Metal</option>
                <option value="Paper">Paper</option>
                <option value="E-waste">E-waste</option>
                <option value="Organic">Organic</option>
              </select>
            </div>

            {/* Weight */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Weight (kg)</label>
              <input
                type="number"
                name="weight"
                placeholder="Enter weight in kilograms"
                value={form.weight}
                onChange={handleChange}
                className="w-full border border-gray-300 p-4 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                required
              />
            </div>

            {/* Pickup Address */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Pickup Address</label>
              <textarea
                name="pickupAddress"
                placeholder="Enter your full address"
                value={form.pickupAddress}
                onChange={handleChange}
                rows={4}
                className="w-full border border-gray-300 p-4 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none resize-none"
                required
              />
            </div>

            {/* Scheduled Date */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Scheduled Date</label>
              <input
                type="datetime-local"
                name="scheduledDate"
                value={form.scheduledDate}
                onChange={handleChange}
                className="w-full border border-gray-300 p-4 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                required
              />
            </div>

            {/* Location Capture */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Location</label>
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Click to capture your location"
                  value={form.coordinates ? `${form.coordinates.latitude}, ${form.coordinates.longitude}` : ""}
                  className="flex-1 border border-gray-300 p-4 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                  readOnly
                />
                <button
                  type="button"
                  onClick={captureLocation}
                  className="bg-green-500 hover:bg-green-600 text-white px-6 py-4 rounded-lg font-semibold transition-colors"
                >
                  📍 Capture
                </button>
              </div>
            </div>

            {/* Email for OTP Verification */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Email for OTP Verification</label>
              <div className="flex gap-3">
                <input
                  type="email"
                  name="email"
                  placeholder="Email from your login"
                  value={form.email}
                  onChange={handleChange}
                  className="flex-1 border border-gray-300 p-4 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none bg-gray-50"
                  required
                  readOnly
                />
                <button
                  type="button"
                  onClick={sendOTP}
                  disabled={otpSent || !form.email || !form.email.endsWith('@gmail.com')}
                  className={`px-6 py-4 rounded-lg font-semibold transition-colors ${
                    otpSent || !form.email || !form.email.endsWith('@gmail.com')
                      ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
                      : 'bg-green-500 hover:bg-green-600 text-white'
                  }`}
                >
                  {otpSent ? '✅ Sent' : 'Send OTP'}
                </button>
              </div>
              {!form.email && (
                <p className="text-sm text-gray-500 mt-1">Please login first to get your email</p>
              )}
              {form.email && !form.email.endsWith('@gmail.com') && (
                <p className="text-sm text-red-500 mt-1">⚠️ Only Gmail addresses (@gmail.com) are supported for OTP</p>
              )}
            </div>

            {/* OTP Verification */}
            {otpSent && !otpVerified && (
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Enter OTP</label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength={6}
                    className="flex-1 border border-gray-300 p-4 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                  />
                  <button
                    type="button"
                    onClick={verifyOTP}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-4 rounded-lg font-semibold transition-colors"
                  >
                    Verify OTP
                  </button>
                </div>
              </div>
            )}

            {/* OTP Verified Status */}
            {otpVerified && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
                ✅ Email verified successfully! You can now submit your pickup request.
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!otpVerified}
              className={`w-full font-bold py-4 rounded-xl transition-all duration-300 transform ${
                otpVerified 
                  ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white hover:scale-105' 
                  : 'bg-gray-400 text-gray-600 cursor-not-allowed'
              }`}
            >
              {otpVerified ? 'Raise Pickup Request' : 'Verify Email First'}
            </button>
          </form>

          {/* Message */}
          {msg && (
            <div className="mt-6 text-center">
              <p className="text-sm">{msg}</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Footer Message */}
      <div className="text-center pb-8">
        <p className="text-gray-600 italic text-lg">
          "Small steps towards recycling, big steps towards a greener future."
        </p>
      </div>
    </div>
  );
};

export default PickupForm;