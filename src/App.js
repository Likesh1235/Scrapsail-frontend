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
    return <Navigate to="/login" replace />;
  }
  
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to appropriate page based on role
    switch (user.role) {
      case 'admin':
        return <Navigate to="/admin" replace />;
      case 'collector':
        return <Navigate to="/collector" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }
  
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
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
        
        {/* Collector-only routes */}
        <Route 
          path="/collector" 
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