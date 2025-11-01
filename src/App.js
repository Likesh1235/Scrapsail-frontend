import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import PickupForm from "./pages/PickupForm";
import Dashboard from "./pages/Dashboard";
import Leaderboard from "./pages/Leaderboard";
import CarbonWallet from "./pages/CarbonWallet";
import Home from "./pages/Home";
import AdminDashboard from "./pages/AdminDashboard";
import CollectorDashboard from "./pages/CollectorDashboard";

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  if (!user.role) {
    return <Navigate to="/" replace />;
  }
  
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to appropriate page based on role
    switch (user.role) {
      case 'admin':
        return <Navigate to="/admin-dashboard" replace />;
      case 'collector':
        return <Navigate to="/collector-dashboard" replace />;
      default:
        return <Navigate to="/dashboard" replace />;
    }
  }
  
  return children;
};

// Login Route Component - Redirects if already logged in
const LoginRoute = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  // If user is already logged in, redirect to appropriate dashboard
  if (user.role) {
    switch (user.role) {
      case 'admin':
        return <Navigate to="/admin-dashboard" replace />;
      case 'collector':
        return <Navigate to="/collector-dashboard" replace />;
      default:
        return <Navigate to="/dashboard" replace />;
    }
  }
  
  return <Login />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Root path shows login page */}
        <Route path="/" element={<LoginRoute />} />
        {/* Keep /login as alias for backwards compatibility */}
        <Route path="/login" element={<LoginRoute />} />
        {/* Keep /home for the home page if needed */}
        <Route path="/home" element={<Home />} />
        <Route path="/register" element={<Register />} />
        {/* User-only routes */}
        <Route 
          path="/pickup" 
          element={
            <ProtectedRoute allowedRoles={['user']}>
              <PickupForm />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/wallet" 
          element={
            <ProtectedRoute allowedRoles={['user']}>
              <CarbonWallet />
            </ProtectedRoute>
          } 
        />
        
        {/* General routes */}
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* General routes */}
        <Route path="/leaderboard" element={<Leaderboard />} />
        
        {/* Admin-only routes */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin-dashboard" 
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        
        {/* Collector-only routes */}
        <Route 
          path="/collector" 
          element={
            <ProtectedRoute allowedRoles={['collector']}>
              <CollectorDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/collector-dashboard" 
          element={
            <ProtectedRoute allowedRoles={['collector']}>
              <CollectorDashboard />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;