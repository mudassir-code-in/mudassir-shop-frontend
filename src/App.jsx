import React, { useState, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL;

// Pages & Functional Layout Components Imports
import Home from './pages/Home';
import Navbar from './components/Navbar';
import AdminDashboard from './pages/AdminDashboard';
import DeliveryAgentDashboard from './pages/DeliveryAgentDashboard';
import Register from './pages/Register';
import Login from './pages/Login';
import Cart from './pages/Cart';
import OtpVerification from './pages/OtpVerfication';

// Structural Historical Ledger Component
import MyOrders from './pages/MyOrders';

// Cryptographic Security Barrier Gates
import ProtectedRoute from './components/ProtectedRoute';
import Footer from './components/Footer';

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // SECURITY HANDSHAKE: Silently re-authenticate HTTP-Only session lifecycle tokens
    const triggerTokenRefresh = async () => {
      try {
        setLoading(true);

        const response = await axios.post(
          `${API_URL}/auth/refresh-token`,
          {},
          { withCredentials: true }
        );

        // Map payload states safely to align frontend node identity tracking
        if (response.data && response.data.user) {
          setUser(response.data.user);
        } else if (response.data && response.data.loggedInUser) {
          setUser(response.data.loggedInUser);
        } else {
          setUser(response.data);
        }

      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    triggerTokenRefresh();

    // Cron scheduler window tracking: Trigger automated handshakes every 14 minutes
    const fourteenMinutes = 14 * 60 * 1000;
    const refreshInterval = setInterval(triggerTokenRefresh, fourteenMinutes);

    return () => clearInterval(refreshInterval);
  }, []);

  return (
    <div className="min-h-screen bg-[#fafafa] font-mono selection:bg-black selection:text-white">
      {/* GLOBAL MANAGEMENT STRIP */}
      <Navbar user={user} setUser={setUser} />

      <Routes>
        {/* 🌍 PUBLIC LOGISTICAL NODES (OPEN PORTS) */}
        <Route path='/' element={<Home />} />
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login setUser={setUser} />} />
        <Route path='/verify-email' element={<OtpVerification />} />

        {/* 🔒 STANDARD AUTHENTICATED CHANNELS */}
        <Route element={<ProtectedRoute user={user} loading={loading} allowedRoles={['user', 'admin', 'deliveryagent']} />}>
          <Route path='/cart' element={<Cart />} />
          <Route path='/my-orders' element={<MyOrders user={user} />} />
        </Route>

        {/* 👑 ELEVATED PRIVILEGE: ADMIN OPERATIONS GATE */}
        <Route element={<ProtectedRoute user={user} loading={loading} allowedRoles={['admin']} />}>
          <Route path='/admin-dashboard' element={<AdminDashboard />} />
        </Route>

        {/* 🛵 AGENT DISPATCH PRIVILEGE: ROUTING GATE */}
        <Route element={<ProtectedRoute user={user} loading={loading} allowedRoles={['deliveryagent']} />}>
          <Route path='/delivery-dashboard' element={<DeliveryAgentDashboard />} />
        </Route>

        {/* 🚨 UNRESOLVED FALLBACK IDENTIFIER (404 SYSTEM FAULT) */}
        <Route
          path="*"
          element={
            <div className="min-h-screen flex items-center justify-center bg-[#fafafa] p-10 font-mono text-xs uppercase tracking-widest text-zinc-400">
              <div className="text-center space-y-2 border border-dashed border-zinc-200 p-12 rounded-2xl bg-white shadow-sm max-w-sm">
                <span className="text-xl block">⚠️</span>
                <div className="font-black text-black">EXCEPTION 404: ADDR_NOT_FOUND</div>
                <p className="text-[10px] font-sans text-zinc-400 normal-case leading-relaxed">
                  The targeted memory sector address or resource pipeline does not exist on this endpoint host.
                </p>
              </div>
            </div>
          }
        />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;