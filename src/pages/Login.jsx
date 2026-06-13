import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Login = ({ setUser }) => {
  const navigate = useNavigate();

  // State configurations
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const requestPayload = { email, password };

      // Axios POST request allowing cross-site cookie transfers
      const response = await axios.post(
        'https://mudassir-shop-backend.onrender.com/api/auth/login',
        requestPayload,
        { withCredentials: true } // Enables browser to automatically capture HTTP-Only cookies
      );

      setSuccessMsg(response.data.message || "Login successful! Redirecting...");

      // Update the user profile data safely
      const userProfile = {
        email: response.data.email,
        role: response.data.role
      };

      // Save session info to localStorage
      localStorage.setItem('user', JSON.stringify(userProfile));

      // 🎯 Fix: Direct state update. This automatically refreshes your Navbar & Protected Routes without a hard reload!
      if (setUser) {
        setUser(userProfile);
      }

      // Smooth layout routing based on role
      setTimeout(() => {
        if (response.data.role === 'admin') {
          navigate('/admin-dashboard', { replace: true });
        } else if (response.data.role === 'deliveryagent') {
          navigate('/delivery-dashboard', { replace: true });
        } else {
          navigate('/', { replace: true });
        }
      }, 1500);

    } catch (error) {
      setErrorMsg(error.response?.data?.message || "Login failed. Invalid credentials.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] flex items-center justify-center px-4 font-mono text-zinc-800">

      {/* LOGIN CARD CONTAINER */}
      <div className="max-w-md w-full bg-white p-6 sm:p-10 border border-zinc-200 rounded-2xl shadow-sm mx-auto space-y-6">

        {/* BRANDING HEADER */}
        <div className="text-center space-y-2 border-b border-zinc-100 pb-5">
          <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold block">
            VNTG.CO Platform
          </span>
          <h2 className="text-xl font-bold text-black tracking-wider">
            ACCOUNT SIGN IN
          </h2>
        </div>

        {/* ALERT NOTIFICATIONS */}
        {errorMsg && (
          <div className="bg-red-50 text-red-600 border border-red-200 p-4 text-xs rounded-xl font-bold text-center">
            ⚠️ {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="bg-zinc-900 text-white border border-zinc-800 p-4 text-xs rounded-xl font-bold tracking-wide text-center shadow-sm">
            {successMsg}
          </div>
        )}

        {/* LOGIN FORM */}
        <form onSubmit={handleLogin} className="space-y-4 text-xs tracking-wider">

          {/* Email Input Field */}
          <div className="space-y-1.5">
            <label className="block font-bold text-zinc-500 text-[10px] uppercase">
              Email Address *
            </label>
            <input
              type="email"
              placeholder="example@domain.com"
              // 🚨 FIX: Removed 'uppercase' class and 'tracking' attributes so user typing stays natural case
              className="w-full p-4 bg-zinc-50/50 border border-zinc-200 font-sans text-xs text-black rounded-xl focus:outline-none focus:border-black focus:bg-white transition-all placeholder-zinc-300 font-medium normal-case"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          {/* Password Input Field */}
          <div className="space-y-1.5">
            <label className="block font-bold text-zinc-500 text-[10px] uppercase">
              Password *
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full p-4 bg-zinc-50/50 border border-zinc-200 font-sans text-xs text-black rounded-xl focus:outline-none focus:border-black focus:bg-white transition-all placeholder-zinc-300"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-black text-white p-4 font-bold tracking-widest text-xs uppercase rounded-xl transition-all duration-200 mt-2 flex items-center justify-center space-x-2 active:scale-[0.99] ${loading ? 'opacity-60 cursor-not-allowed bg-zinc-900' : 'hover:bg-zinc-800'
              }`}
          >
            {loading ? (
              <>
                <span className="animate-spin">🔄</span>
                <span>Verifying...</span>
              </>
            ) : (
              <span>Sign In 🚀</span>
            )}
          </button>
        </form>

        {/* FOOTER SWITCH LINK */}
        <div className="text-center text-[11px] text-zinc-400 tracking-wide pt-2">
          New user?
          <Link to="/register" className="text-black font-bold border-b border-black pb-0.5 ml-1.5 hover:text-zinc-600 transition-colors">
            Register Account
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Login;